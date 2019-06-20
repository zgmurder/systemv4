package io.vertx.armysystem.microservice.resource;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.common.functional.Functional;
import io.vertx.armysystem.microservice.resource.api.ResourceRestAPIVerticle;
import io.vertx.armysystem.microservice.resource.impl.OrganizationServiceImpl;
import io.vertx.armysystem.microservice.resource.impl.SoldierServiceImpl;
import io.vertx.armysystem.microservice.resource.impl.TrainPlaceServiceImpl;
import io.vertx.armysystem.microservice.resource.impl.TrainerServiceImpl;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.armysystem.microservice.common.BaseMicroserviceVerticle;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.serviceproxy.ServiceBinder;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ResourceVerticle extends BaseMicroserviceVerticle {
  private static final Logger logger = LoggerFactory.getLogger(ResourceVerticle.class);
  private OrganizationService organizationService;
  private SoldierService soldierService;
  private List<CRUDService> services = new ArrayList<>();

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();

    logger.info("Starting : " + config());

    // create the service instance
    organizationService = new OrganizationServiceImpl(vertx, config());
    soldierService = new SoldierServiceImpl(vertx, config());
    // create the service instance
    CRUDService crudService = new TrainerServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new TrainPlaceServiceImpl(vertx, config());
    services.add(crudService);

    // register the service proxy on event bus
    new ServiceBinder(vertx)
        .setAddress(((ServiceBase)organizationService).getServiceAddress())
        .register(OrganizationService.class, organizationService);
    new ServiceBinder(vertx)
        .setAddress(((ServiceBase)soldierService).getServiceAddress())
        .register(SoldierService.class, soldierService);

    // register the service proxy on event bus
    services.forEach(service ->
        new ServiceBinder(vertx)
            .setAddress(((ServiceBase)service).getServiceAddress())
            .register(CRUDService.class, service)
    );

    // publish the service and REST endpoint in the discovery infrastructure
    new MongoRepositoryWrapper(vertx, config()).checkDatabase()
        .compose(r -> initOrganizationDatabase(organizationService))
        .compose(r -> initSoldierDatabase(soldierService))
        .compose(o -> publishEventBusService(
            ((ServiceBase)organizationService).getServiceName(),
            ((ServiceBase)organizationService).getServiceAddress(),
            OrganizationService.class))
        .compose(o -> publishEventBusService(
            ((ServiceBase)soldierService).getServiceName(),
            ((ServiceBase)soldierService).getServiceAddress(),
            SoldierService.class))
        .compose(o -> publicServices())
        .compose(servicePublished -> deployRestVerticle())
        .setHandler(future);
  }

  private Future<Void> initOrganizationDatabase(OrganizationService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture);
    return initFuture;
  }

  private Future<Void> initSoldierDatabase(SoldierService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture);
    return initFuture;
  }

  private Future<List<Void>> publicServices() {
    return Functional.allOfFutures(services.stream()
        .map(service -> publishEventBusService(((ServiceBase)service).getServiceName(), ((ServiceBase)service).getServiceAddress(), CRUDService.class))
        .collect(Collectors.toList()));
  }

  private Future<Void> deployRestVerticle() {
    Future<String> future = Future.future();
    vertx.deployVerticle(new ResourceRestAPIVerticle(organizationService, soldierService, services),
        new DeploymentOptions().setConfig(config()), future);

    logger.info("Started");
    return future.map(r -> null);
  }
}
