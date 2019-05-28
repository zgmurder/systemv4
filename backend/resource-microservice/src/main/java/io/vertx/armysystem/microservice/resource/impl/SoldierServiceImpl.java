package io.vertx.armysystem.microservice.resource.impl;

import io.vertx.armysystem.business.common.ModelUtil;
import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.business.common.enums.*;
import io.vertx.armysystem.business.common.resource.Organization;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class SoldierServiceImpl extends MongoRepositoryWrapper implements SoldierService, ServiceBase {
  private static final String ARCHIVE_COLLECTION = "SoldierArchive";
  private static final String FILTER_COLUMN_NAME = "organization.parentIds";
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

    logger.info("addOne original item " + item);
    ModelUtil.fillOrganization(this, item)
        .compose(o -> ModelUtil.validateOrganization(principal, o))
        .compose(o -> validateParams(o, true))
        .compose(o -> fillAutoParams(o, true))
        .compose(o -> {
          logger.info("addOne with soldier " + o);

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
    this.findOne(getCollectionName(), getCondition(id, principal).getQuery(), new JsonObject())
        .map(option -> option.map(json -> json.putNull("password")))
        .map(option -> option.orElse(null))
        .compose(u -> ModelUtil.fillOrganization(this, u))
        .compose(o -> fillPositionAndRank(o))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public SoldierService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    this.retrieveManyByCondition(new JsonObject(), principal, resultHandler);

    return this;
  }

  @Override
  public SoldierService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);

    qCondition.filterByUserOrganizationV2(FILTER_COLUMN_NAME, principal);
    logger.info("count soldier condition: " + qCondition);

    ModelUtil.countByWithOrganization(this, getCollectionName(), qCondition)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public SoldierService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);

    if (qCondition.getOption().getJsonObject("sort") == null) {
      qCondition.getOption().put("sort", new JsonObject().put("organization.orgCode", 1)
          .put("position.order", 1).put("rank.order", 1));
    }

    qCondition.filterByUserOrganizationV2(FILTER_COLUMN_NAME, principal);
    logger.info("query condition: " + qCondition);
    JsonArray pipeline = new JsonArray()
        .add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "Organization")
            .put("localField", "organizationId")
            .put("foreignField", "_id")
            .put("as", "organization")))
        .add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "Position")
            .put("localField", "positionId")
            .put("foreignField", "_id")
            .put("as", "position")))
        .add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "MilitaryRank")
            .put("localField", "rankId")
            .put("foreignField", "_id")
            .put("as", "rank")))
        .add(new JsonObject().put("$match", qCondition.getQuery()));
    if (qCondition.getOption().containsKey("sort")) {
      pipeline.add(new JsonObject().put("$sort", qCondition.getOption().getJsonObject("sort")));
    }
    if (qCondition.getOption().containsKey("skip")) {
      pipeline.add(new JsonObject().put("$skip", qCondition.getOption().getInteger("skip")));
    }
    if (qCondition.getOption().containsKey("limit")) {
      pipeline.add(new JsonObject().put("$limit", qCondition.getOption().getInteger("limit")));
    }
    if (qCondition.getOption().containsKey("fields")) {
      JsonObject project = new JsonObject();
      qCondition.getOption().getJsonArray("fields").getList()
          .forEach(field -> project.put(field.toString(), 1));
      pipeline.add(new JsonObject().put("$project", project));
    }

    List<JsonObject> results = new ArrayList<>();
    Future<List<JsonObject>> future = Future.future();
    this.aggregateWithOptions(getCollectionName(), pipeline, new JsonObject())
        .handler(object -> results.add(object))
        .endHandler(v -> {
          logger.info("retrieve soldiers: " + results);
          future.complete(results);
        })
        .exceptionHandler(ex -> {
          logger.error("retrieve soldiers failed: " + ex);
          future.fail(ex);
        });

    future.map(list -> list.stream()
        .map(item -> {
          if (item.containsKey("organization") && item.getJsonArray("organization").size() > 0) {
            item.put("organization", item.getJsonArray("organization").getJsonObject(0));
          } else {
            item.remove("organization");
          }

          if (item.containsKey("position") && item.getJsonArray("position").size() > 0) {
            item.put("position", item.getJsonArray("position").getJsonObject(0).getString("name"));
          } else {
            item.remove("position");
          }

          if (item.containsKey("rank") && item.getJsonArray("rank").size() > 0) {
            item.put("rank", item.getJsonArray("rank").getJsonObject(0).getString("name"));
          } else {
            item.remove("rank");
          }
          return item;
        }).collect(Collectors.toList())
    ).setHandler(resultHandler);

    return this;
  }

  @Override
  public SoldierService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    item.remove("id");
    item.remove("organizationId");
    item.remove("joinedAt");
    item.remove("leftAt");
    item.remove("inserviceStatus");
    item.remove("dischargedAt");

    logger.info("update soldier id: " + id + " to: " + item);

    this.findOne(getCollectionName(), getCondition(id, principal).getQuery(), new JsonObject())
        .map(option -> option.map(Soldier::new).orElse(null))
        .compose(soldier -> {
          if (soldier != null) {
            return this.update(getCollectionName(), new JsonObject().put("_id", soldier.getId()), item)
                .map(o -> soldier);
          } else {
            return Future.failedFuture("Not found");
          }
        })
        .compose(soldier -> this.findOne(getCollectionName(), new JsonObject().put("_id", soldier.getId()), new JsonObject()))
        .compose(s -> ModelUtil.fillOrganization(this, s.orElse(null)))
        .compose(s -> fillPositionAndRank(s))
        .setHandler(resultHandler);
//        .compose(soldier -> {
//          SoldierArchive archive = new SoldierArchive();
//          archive.setName(soldier.getString("name"))
//              .setCardId(soldier.getString("cardId"))
//              .setOrganizationId(soldier.getString("organizationId"));
//
//          if (item.containsKey("position")) {
//            if (!soldier.containsKey("position") ||
//                !soldier.getString("position").equals(item.getString("position"))) {
//              archive.setPosition(item.getString("position"));
//              archive.setAction(SoldierAction.PositionChange.getName());
//            }
//          }
//
//          if (item.containsKey("rank")) {
//            if (!soldier.containsKey("rank") ||
//                !soldier.getString("rank").equals(item.getString("rank"))) {
//              archive.setRank(item.getString("rank"));
//              archive.setAction(SoldierAction.RankChange.getName());
//            }
//          }
//        });

    return this;
  }

  @Override
  public SoldierService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    JsonObject query = getCondition(id, principal).getQuery();

    logger.info("deleteOne id: " + id);

    this.findOne(getCollectionName(), query, new JsonObject())
        .compose(option -> {
          if (!option.isPresent()) {
            return Future.failedFuture("Not found");
          } else {
            // 根据卡号查找，如果是最后一条记录的话，删除对应的SoldierArchive表
            String cardId = option.get().getString("cardId");
            if (cardId != null && !cardId.isEmpty()) {
              return this.count(getCollectionName(), new JsonObject().put("cardId", cardId))
                  .compose(count -> {
                    if (count > 2) {
                      return Future.succeededFuture(option);
                    } else {
                      return this.remove(ARCHIVE_COLLECTION, new JsonObject().put("cardId", cardId))
                          .map(o -> option);
                    }
                  });
            } else {
              return Future.succeededFuture(option);
            }
          }
        })
        .compose(option -> {
          if (!option.isPresent()) {
            return Future.failedFuture("Not found");
          } else {
            return this.removeById(getCollectionName(), option.get().getString("id"));
          }
        }).setHandler(resultHandler);

    return this;
  }

  @Override
  public SoldierService change(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    JsonObject query = getCondition(id, principal).getQuery();

    logger.info("change soldier id: " + id + " with " + item);

    if (!item.containsKey("action")) {
      resultHandler.handle(Future.failedFuture("Invalid params"));
    } else {
      this.findOne(getCollectionName(), query, new JsonObject())
          .compose(option -> ModelUtil.fillOrganization(this, option.orElse(null)))
          .compose(soldier -> fillPositionAndRank(soldier))
          .compose(soldier -> {
            if (soldier == null) {
              return Future.failedFuture("Not found");
            } else {
              switch (SoldierAction.valueOf(item.getString("action"))) {
                case PositionChange:
                  return changePosition(soldier, item);
                case RankChange:
                  return changeRank(soldier, item);
                case OrganizationChange:
                  return changeOrganization(soldier, item);
                case SoldierRetire:
                  return retireSoldier(soldier, item);
                case TemporaryStudy:
                  return temporaryStudy(soldier, item);

                default:
                  return Future.failedFuture("Invalid params");
              }
            }
          }).setHandler(resultHandler);


    }

//    this.findOne(getCollectionName(), query, new JsonObject())
//        .compose(option -> {
//          if (option.isPresent())
//            return Future.succeededFuture(option.get());
//          else
//            return Future.failedFuture("Not found");
//        })
//        .compose(soldier -> ModelUtil.fillOrganization(this, soldier))
//        .compose(soldier -> fillPositionAndRank(soldier))
//        .map(soldier -> item.put("soldier", soldier))
//        .compose(archive -> ModelUtil.fillOrganization(this, archive))
//        .compose(archive -> fillPositionAndRank(archive))
//        .compose(archive -> {
//          JsonObject soldier = archive.getJsonObject("soldier");
//          JsonObject oldOrg = soldier.getJsonObject("organization");
//          JsonObject newOrg = archive.getJsonObject("organization");
//          SoldierArchive soldierArchive = new SoldierArchive(archive);
//
//          if (oldOrg == null || newOrg == null) {
//            return Future.failedFuture("Invalid params");
//          } else if (oldOrg.getString("id").equals(newOrg.getString("id"))) {
//
//          } else {
//
//          }
//
//        })
//        .setHandler(resultHandler);

    return this;
  }

  private Future<JsonObject> changePosition(JsonObject soldier, JsonObject archive) {
    return Future.succeededFuture();
  }

  private Future<JsonObject> changeRank(JsonObject soldier, JsonObject archive) {
    return Future.succeededFuture();
  }

  private Future<JsonObject> changeOrganization(JsonObject soldier, JsonObject archive) {
    return Future.succeededFuture();
  }

  private Future<JsonObject> retireSoldier(JsonObject soldier, JsonObject archive) {
    return Future.succeededFuture();
  }

  private Future<JsonObject> temporaryStudy(JsonObject soldier, JsonObject archive) {
    return Future.succeededFuture();
  }

  @Override
  public SoldierService retrieveArchives(String cardId, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    this.findWithOptions(ARCHIVE_COLLECTION,
        new JsonObject().put("cardId", cardId),
        new JsonObject().put("createdTime", -1))
        .setHandler(resultHandler);

    return this;
  }

  private Future<JsonObject> validateParams(JsonObject soldier, Boolean forAdd) {
    Future<JsonObject> future = Future.future();

    Boolean failed = false;

    if (forAdd) {
//      soldier.remove("id");
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
      if (organization != null && !organization.getString("orgProperty").equals("新兵")) {
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
    Boolean isNewRecruit = false;

    if (organization.containsKey("orgProperty")) {
      isNewRecruit = organization.getString("orgProperty").equals("新兵");
    }

    soldier.put("joinedAt", new Date().getTime());
    soldier.put("inserviceStatus", InserviceStatus.InService.getValue());

    soldier.put("isCivilServant", false);
    soldier.put("isSpecialForce", false);
    String personProperty = PersonProperty.UnitForce.getName();
    switch (SoldierCategory.fromString(soldier.getString("soldierCategory"))) {
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

  private Future<JsonObject> fillPosition(JsonObject soldier) {
    if (soldier == null) return Future.succeededFuture();

    if (soldier.containsKey("positionId") && soldier.containsKey("organization")) {
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
          });
    } else {
      return Future.succeededFuture(soldier);
    }
  }

  private Future<JsonObject> fillRank(JsonObject soldier) {
    if (soldier == null) return Future.succeededFuture();

    if (soldier.containsKey("positionId")) {
      return this.findOne("MilitaryRank",
          new JsonObject().put("_id", soldier.getString("rankId")), new JsonObject())
          .map(option -> {
            if (option.isPresent()) {
              soldier.put("rank", option.get().getString("name"));
            }
            return soldier;
          });
    } else {
      return Future.succeededFuture(soldier);
    }
  }

  private Future<JsonObject> fillPositionAndRank(JsonObject soldier) {
    return fillPosition(soldier)
        .compose(s -> fillRank(s));
  }

  private QueryCondition getCondition(String id, JsonObject principal) {
    JsonObject query = new JsonObject().put("$or", new JsonArray()
        .add(new JsonObject().put("_id", id))
        .add(new JsonObject().put("cardId", id).put("inserviceStatus", InserviceStatus.InService.getValue())));

    QueryCondition condition = new QueryCondition(query, new JsonObject())
        .filterByUserOrganizationV1(FILTER_COLUMN_NAME, principal);

    return condition;
  }

  private Future<JsonObject> getMainOrganizationByChild(JsonObject child) {
    List<Integer> validSequences = Arrays.asList(OrgSequence.Army.getValue(),
        OrgSequence.Division.getValue(),
        OrgSequence.Brigade.getValue(),
        OrgSequence.Regiment.getValue(),
        OrgSequence.Battalion.getValue(),
        OrgSequence.Company.getValue());

    List<String> parentIds = child.getJsonArray("parentIds", new JsonArray()).getList();
    if (parentIds.size() < 2) {
      return Future.succeededFuture(child);
    } else {
      return this.findWithOptions("Organization",
          new JsonObject().put("_id", new JsonObject().put("$in", new JsonArray(parentIds))),
          new JsonObject().put("sort", new JsonObject().put("orgCode", -1)))
          .map(list -> list.stream().filter(item ->
              validSequences.contains(item.getInteger("orgSequence")) &&
                  (item.getString("orgType").equals(OrgType.Troop.getName()) ||
                      item.getString("orgType").equals(OrgType.UnitForce.getName()))
            ).findFirst().orElse(child)
          );
    }
  }
}
