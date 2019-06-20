package io.vertx.armysystem.microservice.resource.impl;

import io.vertx.armysystem.business.common.*;
import io.vertx.armysystem.business.common.resource.TrainPlace;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import java.util.List;

public class TrainPlaceServiceImpl extends MongoRepositoryWrapper implements ServiceBase, CRUDService {
  private static final String FILTER_COLUMN_NAME = "organization.parentIds";
  private static final Logger logger = LoggerFactory.getLogger(TrainPlaceServiceImpl.class);
  private final Vertx vertx;

  public TrainPlaceServiceImpl(Vertx vertx, JsonObject config) {
    super(vertx, config);
    this.vertx = vertx;
  }

  @Override
  public String getServiceName() {
    return "dictionary-TrainPlace-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.resource.TrainPlace";
  }

  @Override
  public String getPermission() {
    return "TrainPlace";
  }

  @Override
  public String getCollectionName() {
    return "TrainPlace";
  }

  @Override
  public CRUDService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    this.createCollection(getCollectionName())
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("organizationId", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("name", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("placeTypes", 1), new JsonObject()))
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    logger.info("addOne place " + item);
    ModelUtil.fillOrganization(this, item)
        .compose(o -> ModelUtil.validateOrganization(principal, o))
        .compose(o -> validateParams(o, true))
        .compose(o -> this.insertOne(getCollectionName(), new TrainPlace(o).toJson()))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    this.findOne(getCollectionName(), getCondition(id, principal).getQuery(), new JsonObject())
        .map(option -> option.orElse(null))
        .compose(u -> ModelUtil.fillOrganization(this, u))
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

    qCondition.filterByUserOrganizationV2(FILTER_COLUMN_NAME, principal);
    logger.info("count place condition: " + qCondition);

    AggregateBuilder builder = new AggregateBuilder()
        .addLookupOrganization()
        .addQuery(qCondition.getQuery())
        .addCount();

    this.aggregateQuery(getCollectionName(), builder.getPipeline(), new JsonObject())
        .map(list -> builder.getCount(list))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);

    if (qCondition.getOption().getJsonObject("sort") == null) {
      qCondition.getOption().put("sort", new JsonObject().put("organization.orgCode", 1)
          .put("createdTime", 1));
    }

    qCondition.filterByUserOrganizationV2(FILTER_COLUMN_NAME, principal);
    logger.info("query condition: " + qCondition);

    AggregateBuilder builder = new AggregateBuilder()
        .addLookupOrganization()
        .addQuery(qCondition.getQuery())
        .addOption(qCondition.getOption());

    this.aggregateQuery(getCollectionName(), builder.getPipeline(), new JsonObject())
        .map(list -> builder.fixLookupResults(list))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    item.remove("id");

    this.update(getCollectionName(), getCondition(id, principal).getQuery(), new TrainPlace(item).toJson())
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
    this.remove(getCollectionName(), getCondition(id, principal).getQuery())
        .setHandler(resultHandler);

    return this;
  }

  private QueryCondition getCondition(String id, JsonObject principal) {
    JsonObject query = new JsonObject().put("_id", id);

    QueryCondition condition = new QueryCondition(query, new JsonObject())
        .filterByUserOrganizationV1(FILTER_COLUMN_NAME, principal);

    return condition;
  }

  private Future<JsonObject> validateParams(JsonObject item, Boolean forAdd) {
    Future<JsonObject> future = Future.future();

    TrainPlace trainPlace = new TrainPlace(item);
    Boolean failed = false;

    if (forAdd) {
      failed = BaseUtil.isEmpty(trainPlace.getOrganizationId())||
          BaseUtil.isEmpty(trainPlace.getPlaceTypes()) ||
          BaseUtil.isEmpty(trainPlace.getName());
    } else {

    }

    if (failed) {
      future.fail("Invalid parameter");
    } else {
      future.complete(trainPlace.toJson());
    }

    return future;
  }
}
