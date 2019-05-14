package io.vertx.armysystem.microservice.resource;

import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.resource.api.ResourceRestAPIVerticle;
import io.vertx.armysystem.microservice.resource.impl.OrganizationServiceImpl;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.armysystem.microservice.common.BaseMicroserviceVerticle;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.serviceproxy.ServiceBinder;

public class ResourceVerticle extends BaseMicroserviceVerticle {
  private OrganizationService organizationService;

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();

    System.out.println("Starting ResourceVerticle : " + config());

    // create the service instance
    organizationService = new OrganizationServiceImpl(vertx, config());

    // register the service proxy on event bus
    new ServiceBinder(vertx)
        .setAddress(((ServiceBase)organizationService).getServiceAddress())
        .register(OrganizationService.class, organizationService);

    // publish the service and REST endpoint in the discovery infrastructure
    new MongoRepositoryWrapper(vertx, config()).checkDatabase()
        .compose(r -> initOrganizationDatabase(organizationService))
        .compose(o -> publishEventBusService(
            ((ServiceBase)organizationService).getServiceName(),
            ((ServiceBase)organizationService).getServiceAddress(),
            OrganizationService.class))
        .compose(servicePublished -> deployRestVerticle())
        .setHandler(future.completer());
  }

  private Future<Void> initOrganizationDatabase(OrganizationService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture.completer());
    return initFuture;
  }

  private Future<Void> deployRestVerticle() {
    Future<String> future = Future.future();
    vertx.deployVerticle(new ResourceRestAPIVerticle(organizationService),
        new DeploymentOptions().setConfig(config()),
        future.completer());

    System.out.println("Started ResourceVerticle...");
    return future.map(r -> null);
  }
}
