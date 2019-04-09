package io.vertx.armysystem.microservice.account;

import io.vertx.armysystem.microservice.account.api.AccountRestAPIVerticle;
import io.vertx.armysystem.microservice.account.impl.RoleServiceImpl;
import io.vertx.armysystem.microservice.account.impl.UserServiceImpl;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.armysystem.microservice.common.BaseMicroserviceVerticle;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.serviceproxy.ProxyHelper;

public class AccountVerticle extends BaseMicroserviceVerticle {
  private UserService userService;
  private RoleService roleService;

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();

    System.out.println("Starting AccountVerticle : " + config());

    // create the service instance
    roleService = new RoleServiceImpl(vertx, config());
    userService = new UserServiceImpl(vertx, config(), roleService);

    // register the service proxy on event bus
    ProxyHelper.registerService(UserService.class, vertx, userService, UserService.SERVICE_ADDRESS);
    ProxyHelper.registerService(RoleService.class, vertx, roleService, RoleService.SERVICE_ADDRESS);

    // publish the service and REST endpoint in the discovery infrastructure
    new MongoRepositoryWrapper(vertx, config()).checkDatabase()
        .compose(r -> initUserDatabase(userService))
        .compose(o -> initRoleDatabase(roleService))
        .compose(o -> publishEventBusService(UserService.SERVICE_NAME, UserService.SERVICE_ADDRESS, UserService.class))
        .compose(o -> publishEventBusService(RoleService.SERVICE_NAME, RoleService.SERVICE_ADDRESS, RoleService.class))
        .compose(servicePublished -> deployRestVerticle())
        .setHandler(future.completer());
  }

  private Future<Void> initUserDatabase(UserService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture.completer());
    return initFuture;
  }

  private Future<Void> initRoleDatabase(RoleService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture.completer());
    return initFuture;
  }

  private Future<Void> deployRestVerticle() {
    Future<String> future = Future.future();
    vertx.deployVerticle(new AccountRestAPIVerticle(userService, roleService),
        new DeploymentOptions().setConfig(config()),
        future.completer());

    System.out.println("Started AccountVerticle...");
    return future.map(r -> null);
  }
}
