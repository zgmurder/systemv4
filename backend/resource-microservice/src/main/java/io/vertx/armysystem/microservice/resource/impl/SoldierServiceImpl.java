package io.vertx.armysystem.microservice.resource.impl;

import io.vertx.armysystem.business.common.ModelUtil;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.business.common.enums.SoldierCategory;
import io.vertx.armysystem.business.common.resource.Soldier;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.resource.SoldierService;
import io.vertx.armysystem.microservice.resource.SoldierService;
import io.vertx.armysystem.microservice.resource.api.OrganizationRouter;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import java.util.List;

public class SoldierServiceImpl extends MongoRepositoryWrapper implements SoldierService, ServiceBase {
  private static final String ARCHIVE_COLLECTION = "SoldierArchive";
  private static final Logger logger = LoggerFactory.getLogger(OrganizationRouter.class);
  private final Vertx vertx;

  public SoldierServiceImpl(Vertx vertx, JsonObject config) {
    super(vertx, config);
    this.vertx = vertx;
  }

  @Override
  public String getServiceName() {
    return "dictionary-soldier-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.resource.soldier";
  }

  @Override
  public String getPermission() {
    return "Soldier";
  }

  @Override
  public String getCollectionName() {
    return "Soldier";
  }

  @Override
  public SoldierService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    this.createCollection(getCollectionName())
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("name", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("cardId", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("soldierCategory", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("organizationId", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("positionId", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("rankId", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createCollection(ARCHIVE_COLLECTION))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("cardId", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("organizationId", 1), new JsonObject()))
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public SoldierService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    Soldier soldier = new Soldier(item);

    logger.info("addOne " + soldier);
    ModelUtil.fillOrganization(this, item)
        .compose(o -> ModelUtil.validateOrganization(principal, o))
        .compose(o -> validateParams(o, true))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public SoldierService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    return null;
  }

  @Override
  public SoldierService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    return null;
  }

  @Override
  public SoldierService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) {
    return null;
  }

  @Override
  public SoldierService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    return null;
  }

  @Override
  public SoldierService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    return null;
  }

  @Override
  public SoldierService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    return null;
  }

  @Override
  public SoldierService change(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    return null;
  }

  @Override
  public SoldierService retrieveArchives(String cardId, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    return null;
  }

  private Future<JsonObject> validateParams(JsonObject soldier, Boolean forAdd) {
    Future<JsonObject> future = Future.future();

    Boolean failed = false;

    if (forAdd) {
      soldier.remove("id");
      JsonObject organization = soldier.getJsonObject("organization");
      failed = failed || organization == null;
      failed = failed || !soldier.containsKey("name") || soldier.getString("name").isEmpty();
      failed = failed || !soldier.containsKey("gender") || soldier.getString("gender").isEmpty();
      failed = failed || !soldier.containsKey("birthday");
      failed = failed || !soldier.containsKey("enlistedAt");
      failed = failed || !soldier.containsKey("politicalStatus") || soldier.getString("politicalStatus").isEmpty();
      failed = failed || !soldier.containsKey("positionId") || soldier.getString("positionId").isEmpty();
      failed = failed || !soldier.containsKey("rankId") || soldier.getString("rankId").isEmpty();
      failed = failed || !soldier.containsKey("soldierCategory") || soldier.getString("soldierCategory").isEmpty();

      // 新兵单位录入人员时，可能还未分配士兵证
      if (!organization.getString("orgProperty").equals("新兵")) {
        failed = failed || !soldier.containsKey("cardId") || soldier.getString("cardId").isEmpty();
      }
    } else {

    }

    if (failed) {
      future.fail("Invalid parameter");
    } else {
      future.complete(soldier);
    }

    return future;
  }

  private Future<JsonObject> fillAutoParams(JsonObject soldier, Boolean forAdd) {
    Future<JsonObject> future = Future.future();

    return future;
  }
}
