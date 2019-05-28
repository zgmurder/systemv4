package io.vertx.armysystem.microservice.dictionary.impl;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.business.common.dictionary.MotorType;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.List;

public class MotorTypeServiceImpl extends MongoRepositoryWrapper implements CRUDService, ServiceBase {
  private final Vertx vertx;

  public MotorTypeServiceImpl(Vertx vertx, JsonObject config) {
    super(vertx, config);

    this.vertx = vertx;
  }

  @Override
  public String getServiceName() {
    return "dictionary-MotorType-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.dictionary.MotorType";
  }

  @Override
  public String getPermission() {
    return "dictionary";
  }

  @Override
  public String getCollectionName() {
    return "MotorType";
  }

  @Override
  public CRUDService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    this.createCollection(getCollectionName())
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("name", 1), new JsonObject().put("unique", true)))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("order", 1), new JsonObject()))
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    this.insertOne(getCollectionName(), new MotorType(item).toJson())
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    this.findOne(getCollectionName(), getIdQuery(id), new JsonObject())
        .map(option -> option.orElse(null))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    this.retrieveManyByCondition(new JsonObject(), principal, resultHandler);

    return this;
  }

  @Override
  public CRUDService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);
    this.count(getCollectionName(), qCondition.getQuery()).setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);

    if (qCondition.getOption().getJsonObject("sort") == null) {
      qCondition.getOption().put("sort", new JsonObject().put("order", 1));
    }

    this.findWithOptions(getCollectionName(), qCondition.getQuery(), qCondition.getOption())
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    item.remove("id");
    item.remove("_id");

    this.update(getCollectionName(), getIdQuery(id), new MotorType(item).toJson())
        .setHandler(ar -> {
          if (ar.succeeded()) {
            this.retrieveOne(id, principal, resultHandler);
          } else {
            resultHandler.handle(Future.failedFuture(ar.cause()));
          }
        });

    return this;
  }

  @Override
  public CRUDService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    this.remove(getCollectionName(), getIdQuery(id))
        .setHandler(resultHandler);

    return this;
  }

  private JsonObject getIdQuery(String id) {
    return new JsonObject().put("$or", new JsonArray()
        .add(new JsonObject().put("_id", id))
        .add(new JsonObject().put("name", id)));
  }
}
