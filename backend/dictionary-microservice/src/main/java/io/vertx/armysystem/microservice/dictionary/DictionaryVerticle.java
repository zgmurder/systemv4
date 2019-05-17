package io.vertx.armysystem.microservice.dictionary;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.common.BaseMicroserviceVerticle;
import io.vertx.armysystem.microservice.common.functional.Functional;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.dictionary.api.DictionaryRestAPIVerticle;
import io.vertx.armysystem.microservice.dictionary.impl.*;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.serviceproxy.ProxyHelper;
import io.vertx.serviceproxy.ServiceBinder;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class DictionaryVerticle extends BaseMicroserviceVerticle {
  private static final Logger logger = LoggerFactory.getLogger(DictionaryVerticle.class);
  private List<CRUDService> services = new ArrayList<>();

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();

    logger.info("Starting : " + config());

    // create the service instance
    CRUDService crudService = new GroupTrainMethodServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new GunnerTypeServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new MilitaryRankServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new MotorTypeServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new OrdnanceTypeServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new OrgCategoryServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new OrgPropertyServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new PlaceTypeServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new PositionServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new SpecialMissionServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new SportCategoryServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new SupporterMajorServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new TrainerLevelServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new TrainStepServiceImpl(vertx, config());
    services.add(crudService);
    crudService = new WeatherTypeServiceImpl(vertx, config());
    services.add(crudService);

    // register the service proxy on event bus
    services.forEach(service ->
      new ServiceBinder(vertx)
          .setAddress(((ServiceBase)service).getServiceAddress())
          .register(CRUDService.class, service)
    );

    // publish the service and REST endpoint in the discovery infrastructure
    new MongoRepositoryWrapper(vertx, config()).checkDatabase()
        .compose(o -> initAllDatabases())
        .compose(o -> publicServices())
        .compose(o -> deployRestVerticle())
        .setHandler(future);
  }

  private Future<Void> initDatabase(CRUDService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture);
    return initFuture;
  }

  private Future<List<Void>> initAllDatabases() {
    return Functional.allOfFutures(services.stream()
        .map(service -> initDatabase(service))
        .collect(Collectors.toList()));
  }

  private Future<List<Void>> publicServices() {
    return Functional.allOfFutures(services.stream()
        .map(service -> publishEventBusService(((ServiceBase)service).getServiceName(), ((ServiceBase)service).getServiceAddress(), CRUDService.class))
        .collect(Collectors.toList()));
  }

  private Future<Void> deployRestVerticle() {
    Future<String> future = Future.future();
    vertx.deployVerticle(new DictionaryRestAPIVerticle(services),
        new DeploymentOptions().setConfig(config()), future);

    logger.info("Started");
    return future.map(r -> null);
  }
}
