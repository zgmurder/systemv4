package io.vertx.armysystem.microservice.resource.impl;

import io.vertx.armysystem.business.common.ModelUtil;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.business.common.enums.InserviceStatus;
import io.vertx.armysystem.business.common.enums.PersonProperty;
import io.vertx.armysystem.business.common.enums.SoldierAction;
import io.vertx.armysystem.business.common.enums.SoldierCategory;
import io.vertx.armysystem.business.common.resource.Soldier;
import io.vertx.armysystem.business.common.resource.SoldierArchive;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.resource.SoldierService;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import java.util.Date;
import java.util.List;

public class SoldierServiceImpl extends MongoRepositoryWrapper implements SoldierService, ServiceBase {
  private static final String ARCHIVE_COLLECTION = "SoldierArchive";
  private static final Logger logger = LoggerFactory.getLogger(SoldierServiceImpl.class);
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
        .compose(o -> fillAutoParams(o, true))
        .compose(o -> {
          if (o.containsKey("cardId") && !o.getString("cardId").isEmpty()){
            return this.findOne(getCollectionName(), new JsonObject()
                .put("cardId", o.getString("cardId"))
                .put("inserviceStatus", InserviceStatus.InService.getValue()),
                new JsonObject())
                .compose(option -> {
                  if (option.isPresent()) {
                    return Future.failedFuture("Soldier already exists with cardId " + o.getString("cardId"));
                  } else {
                    return Future.succeededFuture(o);
                  }
                });
          } else {
            return Future.succeededFuture(o);
          }
        })
        .compose(o -> this.insertOne(getCollectionName(), new Soldier(o).toJson()))
        .compose(o -> ModelUtil.fillOrganization(this, o))
        .compose(o -> fillPositionAndRank(o))
        .compose(o -> {
          SoldierArchive archive = new SoldierArchive();
          archive.setName(o.getString("name"))
              .setCardId(o.getString("cardId"))
              .setOrganizationId(o.getString("organizationId"))
              .setPosition(o.getString("position"))
              .setRank(o.getString("rank"))
              .setDescription("");

          if (o.getJsonObject("organization").getString("orgProperty").equals("新兵")) {
            archive.setAction(SoldierAction.NewRecruit.getName());
          } else {
            archive.setAction(SoldierAction.InitialRegister.getName());
          }

          return this.insertOne(ARCHIVE_COLLECTION, archive.toJson())
              .otherwiseEmpty()
              .map(u -> o);
        })
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
    JsonObject organization = soldier.getJsonObject("organization");
    Boolean isNewRecruit = organization.getString("orgProperty").equals("新兵");
    soldier.put("joinedAt", new Date().getTime());
    soldier.put("inserviceStatus", InserviceStatus.InService.getValue());

    soldier.put("isCivilServant", false);
    soldier.put("isSpecialForce", false);
    String personProperty = PersonProperty.UnitForce.getName();
    switch (SoldierCategory.valueOf(soldier.getString("soldierCategory"))) {
      case Officer:
        if (isNewRecruit)
          personProperty = PersonProperty.RecruitOfficer.getName();
        else
          personProperty = PersonProperty.Officer.getName();
        break;
      case TechOfficer:
        if (isNewRecruit)
          personProperty = PersonProperty.RecruitOfficer.getName();
        else
          personProperty = PersonProperty.TechOfficer.getName();
        break;
      case Soldier:
      case Sergeant:
        if (isNewRecruit)
          personProperty = PersonProperty.Recruit.getName();
        else
          personProperty = PersonProperty.UnitForce.getName();
        break;
      case CivilServant:
        personProperty = PersonProperty.Officer.getName();
        soldier.put("isCivilServant", true);
        break;
    }

    if (soldier.getBoolean("isSupporter")) {
      personProperty = PersonProperty.Supporter.getName();
    }
    soldier.put("personProperty", personProperty);

    if (!soldier.containsKey("cardId")) {
      soldier.put("cardId", "");
    }

    if (soldier.containsKey("specialForceType") && !soldier.getString("specialForceType").isEmpty()) {
      soldier.put("isSpecialForce", true);
      if (soldier.getString("specialForceType").equals(PersonProperty.ReserveMember.getName())) {
        soldier.put("personProperty", PersonProperty.ReserveMember.getName());
      }
    }

    String orgCategory = organization.containsKey("orgCategory") ? organization.getString("orgCategory") : "";
    return this.findOne("OrgCategory", new JsonObject().put("name", orgCategory), new JsonObject())
        .map(option -> {
          if (option.isPresent()) {
            soldier.put("physicalLevel", option.get().getString("physicalLevel"));
            soldier.put("troopCategory", option.get().getString("troopCategory"));
          }

          return soldier;
        });
  }

  private Future<JsonObject> fillPositionAndRank(JsonObject soldier) {
    return this.findOne("Position",
        new JsonObject().put("$or", new JsonArray()
            .add(new JsonObject().put("orgSequence", soldier.getJsonObject("organization").getInteger("orgSequence"))
                .put("_id", soldier.getString("positionId")))
            .add(new JsonObject().put("orgCategory", soldier.getJsonObject("organization").getInteger("orgCategory"))
                .put("_id", soldier.getString("positionId")))),
        new JsonObject())
    .map(option -> {
      if (option.isPresent()) {
        soldier.put("position", option.get().getString("name"));
      }
      return soldier;
    }).compose(s ->
        this.findOne("MilitaryRank",
            new JsonObject().put("_id", soldier.getString("rankId")), new JsonObject())
        .map(option -> {
          if (option.isPresent()) {
            soldier.put("rank", option.get().getString("name"));
          }
          return soldier;
        })
    );
  }
}
