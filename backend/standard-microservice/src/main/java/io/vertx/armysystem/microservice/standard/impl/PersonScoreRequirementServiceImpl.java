package io.vertx.armysystem.microservice.standard.impl;

import io.vertx.armysystem.business.common.*;
import io.vertx.armysystem.business.common.standard.PersonScoreRequirement;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.standard.StandardModelUtil;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

public class PersonScoreRequirementServiceImpl extends MongoRepositoryWrapper implements ServiceBase, CRUDService {
  private static final Logger logger = LoggerFactory.getLogger(PersonScoreRequirementServiceImpl.class);
  private final Vertx vertx;

  public PersonScoreRequirementServiceImpl(Vertx vertx, JsonObject config) {
    super(vertx, config);

    this.vertx = vertx;
  }

  @Override
  public String getServiceName() {
    return "standard-PersonScoreRequirement-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.standard.PersonScoreRequirement";
  }

  @Override
  public String getPermission() {
    return "standard";
  }

  @Override
  public String getCollectionName() {
    return "PersonScoreRequirement";
  }

  @Override
  public CRUDService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    this.createCollection(getCollectionName())
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("personProperty", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("standardId", 1), new JsonObject()))
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    validateParams(item, true)
        .compose(o -> this.insertOne(getCollectionName(), new PersonScoreRequirement(o).toJson()))
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
    StandardModelUtil.countWithStandard(this, getCollectionName(), qCondition).setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);

    if (qCondition.getOption().getJsonObject("sort") == null) {
      qCondition.getOption().put("sort", new JsonObject()
          .put("standard.version", -1)
          .put("createdTime", 1));
    }

    logger.info("query condition: " + qCondition);
    StandardModelUtil.queryWithStandard(this, getCollectionName(), qCondition)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    item.remove("id");

    this.update(getCollectionName(), getIdQuery(id), new PersonScoreRequirement(item).toJson())
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
    return new JsonObject().put("_id", id);
  }

  private Future<JsonObject> validateParams(JsonObject item, Boolean forAdd) {
    Future<JsonObject> future = Future.future();

    PersonScoreRequirement requirement = new PersonScoreRequirement(item);

    Boolean failed = false;

    if (forAdd) {
      failed = BaseUtil.isEmpty(requirement.getStandardId()) ||
          BaseUtil.isEmpty(requirement.getPersonProperty());
    } else {

    }

    if (failed) {
      future.fail("Invalid parameter");
    } else {
      future.complete(requirement.toJson());
    }

    return future;
  }
}
