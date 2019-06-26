package io.vertx.armysystem.microservice.file;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.common.BaseMicroserviceVerticle;
import io.vertx.armysystem.microservice.common.functional.Functional;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.file.api.FileRestAPIVerticle;
import io.vertx.armysystem.microservice.file.impl.SmallFileServiceImpl;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.serviceproxy.ServiceBinder;

import java.util.List;
import java.util.stream.Collectors;

public class FileVerticle extends BaseMicroserviceVerticle {
  private static final Logger logger = LoggerFactory.getLogger(FileVerticle.class);
  private FileService fileService;

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();

    logger.info("Starting : " + config());

    // create the service instance
    fileService = new SmallFileServiceImpl(vertx, config());

    // register the service proxy on event bus
    new ServiceBinder(vertx)
        .setAddress(((ServiceBase)fileService).getServiceAddress())
        .register(FileService.class, fileService);

    // publish the service and REST endpoint in the discovery infrastructure
    new MongoRepositoryWrapper(vertx, config()).checkDatabase()
        .compose(r -> initSmallFileDatabase(fileService))
        .compose(o -> publishEventBusService(
            ((ServiceBase)fileService).getServiceName(),
            ((ServiceBase)fileService).getServiceAddress(),
            FileService.class))
        .compose(servicePublished -> deployRestVerticle())
        .setHandler(future);
  }

  private Future<Void> initSmallFileDatabase(FileService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture);
    return initFuture;
  }

  private Future<Void> deployRestVerticle() {
    Future<String> future = Future.future();
    vertx.deployVerticle(new FileRestAPIVerticle(fileService),
        new DeploymentOptions().setConfig(config()), future);

    logger.info("Started");
    return future.map(r -> null);
  }
}
