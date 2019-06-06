package io.vertx.armysystem.microservice.standard.impl;

import io.vertx.armysystem.business.common.*;
import io.vertx.armysystem.business.common.enums.CourseCategory;
import io.vertx.armysystem.business.common.standard.Course;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import java.util.List;

public class CourseServiceImpl extends MongoRepositoryWrapper implements ServiceBase, CRUDService {
  private static final Logger logger = LoggerFactory.getLogger(CourseServiceImpl.class);
  private final Vertx vertx;

  public CourseServiceImpl(Vertx vertx, JsonObject config) {
    super(vertx, config);

    this.vertx = vertx;
  }

  @Override
  public String getServiceName() {
    return "standard-Course-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.standard.Course";
  }

  @Override
  public String getPermission() {
    return "standard";
  }

  @Override
  public String getCollectionName() {
    return "Course";
  }

  @Override
  public CRUDService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    this.createCollection(getCollectionName())
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("name", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("seq", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("category", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("standardId", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("sectionId", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("trainStepName", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("orgType", 1), new JsonObject()))
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    validateParams(item, true)
        .compose(o -> this.insertOne(getCollectionName(), new Course(o).toJson()))
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

    AggregateBuilder builder = new AggregateBuilder()
        .addLookupStandard()
        .addLookupSection()
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
      qCondition.getOption().put("sort", new JsonObject()
          .put("standard.version", -1)
          .put("section.code", 1)
          .put("trainStep.priority", 1)
          .put("seq", 1));
    }

    logger.info("query condition: " + qCondition);
    AggregateBuilder builder = new AggregateBuilder()
        .addLookupStandard()
        .addLookupSection()
        .addLookupTrainStep()
        .addQuery(qCondition.getQuery())
        .addCount();

    this.aggregateQuery(getCollectionName(), builder.getPipeline(), new JsonObject())
        .map(list -> builder.fixLookupResults(list))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public CRUDService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    item.remove("id");

    this.update(getCollectionName(), getIdQuery(id), new Course(item).toJson())
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

    Course course = new Course(item);

    Boolean failed = false;

    if (forAdd) {
      failed = course.getSeq() == 0 ||
          BaseUtil.isEmpty(course.getName()) ||
          BaseUtil.isEmpty(course.getStandardId()) ||
          BaseUtil.isEmpty(course.getSectionId()) ||
          BaseUtil.isEmpty(course.getRequire()) ||
          BaseUtil.isEmpty(course.getPlaceTypes());

      if (course.getCategory() == CourseCategory.Train.getValue()) {
        failed = failed || BaseUtil.isEmpty(course.getTrainStepName()) ||
            BaseUtil.isEmpty(course.getTrainUnits()) ||
            BaseUtil.isEmpty(course.getOrgType()) ||
            BaseUtil.isEmpty(course.getOrgCategories()) ||
            BaseUtil.isEmpty(course.getPersonProperties()) ||
            BaseUtil.isEmpty(course.getScoreCriteria());
      }

      if (course.getCategory() == CourseCategory.Sport.getValue()) {
        failed = failed || BaseUtil.isEmpty(course.getSportCategory()) ||
            BaseUtil.isEmpty(course.getScoreCriteria());
      }
    } else {

    }

    if (failed) {
      future.fail("Invalid parameter");
    } else {
      future.complete(course.toJson());
    }

    return future;
  }
}
