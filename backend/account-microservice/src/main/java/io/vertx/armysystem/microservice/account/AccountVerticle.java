package io.vertx.armysystem.microservice.account;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.account.api.AccountRestAPIVerticle;
import io.vertx.armysystem.microservice.account.impl.RoleServiceImpl;
import io.vertx.armysystem.microservice.account.impl.UserServiceImpl;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.armysystem.microservice.common.BaseMicroserviceVerticle;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.serviceproxy.ProxyHelper;
import io.vertx.serviceproxy.ServiceBinder;

public class AccountVerticle extends BaseMicroserviceVerticle {
  private static final Logger logger = LoggerFactory.getLogger(AccountVerticle.class);
  private UserService userService;
  private CRUDService roleService;

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();

    logger.info("Starting : " + config());

    // create the service instance
    roleService = new RoleServiceImpl(vertx, config());
    userService = new UserServiceImpl(vertx, config(), roleService);

    // register the service proxy on event bus
    new ServiceBinder(vertx)
        .setAddress(((ServiceBase)userService).getServiceAddress())
        .register(UserService.class, userService);
    new ServiceBinder(vertx)
        .setAddress(((ServiceBase)roleService).getServiceAddress())
        .register(CRUDService.class, roleService);

    // publish the service and REST endpoint in the discovery infrastructure
    new MongoRepositoryWrapper(vertx, config()).checkDatabase()
        .compose(r -> initUserDatabase(userService))
        .compose(o -> initRoleDatabase(roleService))
        .compose(o -> publishEventBusService(((ServiceBase)userService).getServiceName(), ((ServiceBase)userService).getServiceAddress(), UserService.class))
        .compose(o -> publishEventBusService(((ServiceBase)roleService).getServiceName(), ((ServiceBase)roleService).getServiceAddress(), CRUDService.class))
        .compose(servicePublished -> deployRestVerticle())
        .setHandler(future);
  }

  private Future<Void> initUserDatabase(UserService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture);
    return initFuture;
  }

  private Future<Void> initRoleDatabase(CRUDService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture);
    return initFuture;
  }

  private Future<Void> deployRestVerticle() {
    Future<String> future = Future.future();
    vertx.deployVerticle(new AccountRestAPIVerticle(userService, roleService),
        new DeploymentOptions().setConfig(config()), future);

    logger.info("Started");
    return future.map(r -> null);
  }
}
