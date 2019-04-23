package io.vertx.armysystem.microservice.dictionary;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.common.BaseMicroserviceVerticle;
import io.vertx.armysystem.microservice.common.functional.Functional;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.dictionary.api.DictionaryRestAPIVerticle;
import io.vertx.armysystem.microservice.dictionary.impl.GroupTrainMethodServiceImpl;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.serviceproxy.ProxyHelper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class DictionaryVerticle extends BaseMicroserviceVerticle {
  private List<CRUDService> services = new ArrayList<>();

  @Override
  public void start(Future<Void> future) throws Exception {
    super.start();

    System.out.println("Starting DictionaryVerticle : " + config());

    // create the service instance
    CRUDService groupTrainMethodService = new GroupTrainMethodServiceImpl(vertx, config());
    services.add(groupTrainMethodService);

    // register the service proxy on event bus
    services.forEach(service -> {
      ProxyHelper.registerService(CRUDService.class, vertx, service, ((ServiceBase)service).getServiceAddress());
    });

    // publish the service and REST endpoint in the discovery infrastructure
    new MongoRepositoryWrapper(vertx, config()).checkDatabase()
        .compose(o -> initAllDatabases())
        .compose(o -> publicServices())
        .compose(o -> deployRestVerticle())
        .setHandler(future.completer());
  }

  private Future<Void> initDatabase(CRUDService service) {
    Future<Void> initFuture = Future.future();
    service.initializePersistence(initFuture.completer());
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
        new DeploymentOptions().setConfig(config()),
        future.completer());

    System.out.println("Started DictionaryVerticle...");
    return future.map(r -> null);
  }
}
