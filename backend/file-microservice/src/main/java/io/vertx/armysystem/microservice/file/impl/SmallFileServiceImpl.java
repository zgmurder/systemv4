package io.vertx.armysystem.microservice.file.impl;

import io.vertx.armysystem.business.common.BaseUtil;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.file.FileService;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

public class SmallFileServiceImpl extends MongoRepositoryWrapper implements FileService, ServiceBase {
  private static final Logger logger = LoggerFactory.getLogger(SmallFileServiceImpl.class);
  private final Vertx vertx;

  public SmallFileServiceImpl(Vertx vertx, JsonObject config) {
    super(vertx, config);

    this.vertx = vertx;
  }

  @Override
  public String getServiceName() {
    return "file-SmallFile-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.file.SmallFile";
  }

  @Override
  public String getPermission() {
    return "file";
  }

  @Override
  public String getCollectionName() {
    return "SmallFile";
  }

  @Override
  public FileService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    this.createCollection(getCollectionName())
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public FileService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    validateParams(item, true)
        .compose(o -> this.insertOne(getCollectionName(), o))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public FileService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    this.findOne(getCollectionName(), getIdQuery(id), new JsonObject())
        .map(option -> option.orElse(null))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public FileService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    this.remove(getCollectionName(), getIdQuery(id))
        .setHandler(resultHandler);

    return this;
  }

  private JsonObject getIdQuery(String id) {
    return new JsonObject().put("_id", id);
  }

  private Future<JsonObject> validateParams(JsonObject item, Boolean forAdd) {
    Future<JsonObject> future = Future.future();

    Boolean failed = false;

    if (forAdd) {
      failed = !item.containsKey("fileName") ||
          !item.containsKey("extName") ||
          !item.containsKey("fileSize") ||
          !item.containsKey("fileData");
    } else {

    }

    if (failed) {
      future.fail("Invalid parameter");
    } else {
      future.complete(item);
    }

    return future;
  }
}
