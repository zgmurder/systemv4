package io.vertx.armysystem.microservice.resource.impl;

import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.business.common.enums.OrgSequence;
import io.vertx.armysystem.business.common.enums.OrgType;
import io.vertx.armysystem.business.common.resource.Organization;
import io.vertx.armysystem.microservice.common.functional.Functional;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.resource.OrganizationService;
import io.vertx.armysystem.microservice.resource.api.OrganizationRouter;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.mongo.BulkOperation;
import org.mvel2.ast.Or;

import java.util.*;
import java.util.stream.Collectors;

public class OrganizationServiceImpl extends MongoRepositoryWrapper implements OrganizationService, ServiceBase {
  private static final Logger logger = LoggerFactory.getLogger(OrganizationRouter.class);
  private final Vertx vertx;

  public OrganizationServiceImpl(Vertx vertx, JsonObject config) {
    super(vertx, config);
    this.vertx = vertx;
  }

  @Override
  public String getServiceName() {
    return "resource-organization-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.resource.organization";
  }

  @Override
  public String getPermission() {
    return "Organization";
  }

  @Override
  public String getCollectionName() {
    return "Organization";
  }

  @Override
  public OrganizationService initializePersistence(Handler<AsyncResult<Void>> resultHandler) {
    this.createCollection(getCollectionName())
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("name", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("displayName", 1), new JsonObject().put("unique", true)))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("orgCode", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("parentIds", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("parentId", 1), new JsonObject()))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("orgSequence", 1), new JsonObject()))
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public OrganizationService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    Organization organization = new Organization(item);

    logger.info("addOne " + organization);

    validateParams(organization, true)    // 参数检查
        .compose(o -> getParentOrg(organization.getParentId(), principal))
        .compose(parent -> {
          Future<JsonObject> future = Future.future();

          logger.info("get parent " + parent);

          if (parent == null && organization.getParentId() != null) {
            // parentId not found
            future.fail("Not found");
          } else if (!checkPermission(parent, principal)) {
            future.fail("No permission");
          } else {
            organization.setId(UUID.randomUUID().toString());
            organization.setDeactivated(false);
            // 设置单位长名称
            organization.setDisplayName(makeDisplayName(parent, organization));
            // 设置本单位的parentIds
            organization.setParentIds(getParentIds(parent));
            organization.getParentIds().add(organization.getId());
            // 设置单位orgCode
            organization.setOrgCode(makeOrgCode(parent, organization));

            JsonObject jsonObject = organization.toJson();
            jsonObject.remove("childCount");
            return this.insertOne(getCollectionName(), jsonObject)
                .map(org -> org.put("childCount", 0));
          }

          return future;
        }).setHandler(resultHandler);

    return this;
  }

  @Override
  public OrganizationService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    this.findOne(getCollectionName(), getCondition(id, principal).getQuery(), new JsonObject())
        .map(option -> option.orElse(null))
        .compose(item -> fillChildCount(item))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public OrganizationService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    this.retrieveManyByCondition(new JsonObject(), principal, resultHandler);

    return this;
  }

  @Override
  public OrganizationService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);
    qCondition.filterByUserOrganizationV2(getCollectionName(), principal);
    logger.info("count condition: " + qCondition);

    this.count(getCollectionName(), qCondition.getQuery())
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public OrganizationService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    QueryCondition qCondition = QueryCondition.parse(condition);

    if (qCondition.getOption().getJsonObject("sort") == null) {
      qCondition.getOption().put("sort", new JsonObject().put("orgCode", 1));
    }

    qCondition.filterByUserOrganizationV2(getCollectionName(), principal);
    logger.info("retrieveManyByCondition condition: " + qCondition);

    this.findWithOptions(getCollectionName(), qCondition.getQuery(), qCondition.getOption())
        .map(list -> list.stream()
            .map(json -> new Organization(json).toJson())
            .collect(Collectors.toList()))
        .compose(list -> {
          // 通过parentId查子节点时需要填充childCount字段
          if (!list.isEmpty() && qCondition.getQuery().containsKey("parentId")) {
            return Functional.allOfFutures(list.stream()
                .map(object -> fillChildCount(object))
                .collect(Collectors.toList()));
          } else {
            return Future.succeededFuture(list);
          }
        })
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public OrganizationService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    item.remove("id");
    item.remove("parentId");
    item.remove("parentIds");
    item.remove("childCount");
    item.remove("orgCode");
    item.remove("displayName");
    item.remove("deactivated");
    item.remove("deactivatedAt");

    logger.info("updateOne id: " + id + " to: " + item);

    this.findOne(getCollectionName(), getCondition(id, principal).getQuery(), new JsonObject())
        .map(option -> option.map(Organization::new).orElse(null))
        .compose(organization -> {
          if (organization != null) {
            // 如果修改单位名称，则自动更新全名称
            if (item.containsKey("name") && !organization.getName().equals(item.getString("name"))) {
              item.put("displayName",
                  organization.getDisplayName().replace(organization.getName(), item.getString("name")));
            }

            if (item.containsKey("nodeCode") && organization.getNodeCode() != item.getInteger("nodeCode")) {
              item.put("orgCode", makeOrgCode(organization, item.getInteger("nodeCode")));
            }

            return this.update(getCollectionName(), new JsonObject().put("_id", organization.getId()), item)
                .map(o -> organization);
          } else {
            return Future.failedFuture("Not found");
          }
        }).compose(organization -> {
          if (item.containsKey("displayName") || item.containsKey("orgCode")) {
            return this.findWithOptions(getCollectionName(),
                new JsonObject().put("parentIds", organization.getId()),
                new JsonObject().put("limit", 10000))
                .map(list -> list.stream().filter(org -> org.getString("id") != organization.getId())
                      .map(org -> {
                        JsonObject obj = new JsonObject();
                        if (item.containsKey("displayName") && org.containsKey("displayName")) {
                          obj.put("displayName",
                              org.getString("displayName")
                                  .replace(organization.getDisplayName(), item.getString("displayName")));
                        }

                        if (item.containsKey("orgCode") && org.containsKey("orgCode")) {
                          obj.put("orgCode",
                              org.getString("orgCode")
                                  .replace(organization.getOrgCode(), item.getString("orgCode")));
                        }
                        obj.put("updatedTime", new Date().getTime());

                        return new BulkOperation(new JsonObject()
                            .put("type", "update")
                            .put("filter", new JsonObject().put("_id", org.getString("id")))
                            .put("document", new JsonObject().put("$set", obj))
                            .put("upsert", false)
                            .put("multi", false));
                      }).collect(Collectors.toList())
                )
            .compose(list -> {
              logger.info("before bulkwrite: " + list);
              if (list == null || list.isEmpty()) {
                return Future.succeededFuture();
              } else {
                return this.bulkWrite(getCollectionName(), list);
              }
            })
            .compose(list ->
              this.findOne(getCollectionName(), new JsonObject().put("_id", organization.getId()), new JsonObject())
                  .map(option -> option.orElse(null))
            );
          } else {
            return this.findOne(getCollectionName(), new JsonObject().put("_id", organization.getId()), new JsonObject())
                .map(option -> option.orElse(null));
          }
        })
        .compose(o -> fillChildCount(o))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public OrganizationService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    JsonObject query = getCondition(id, principal).getQuery();

    logger.info("deleteOne id: " + id);

    this.findOne(getCollectionName(), query, new JsonObject())
        .compose(o -> fillChildCount(o.get()))
        .compose(organization -> {
          if (organization == null) {
            return Future.failedFuture("Not found");
          } else if (organization.getInteger("childCount")>0){
            return Future.failedFuture("Not allowed");
          } else {
            return this.removeById(getCollectionName(), organization.getString("id"));
          }
        }).setHandler(resultHandler);

    return this;
  }

  @Override
  public OrganizationService swapPosition(String id, String otherId, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    JsonObject query1 = getCondition(id, principal).getQuery();
    JsonObject query2 = getCondition(id, principal).getQuery();

    logger.info("swapPosition " + id + "<->" + otherId);

    this.findOne(getCollectionName(), query1, new JsonObject())
        .map(option -> option.orElse(null))
        .compose(organization ->
            this.findOne(getCollectionName(), query2, new JsonObject())
                .map(option -> option.orElse(null))
                .map(o -> new JsonObject().put("org1", organization).put("org2", o))
        ).compose(both -> {
          if (both.getJsonObject("org1") == null || both.getJsonObject("org2") == null) {
            return Future.failedFuture("Not found");
          } else {
            Organization org1 = new Organization(both.getJsonObject("org1"));
            Organization org2 = new Organization(both.getJsonObject("org2"));
            String newOrgCode1 = makeOrgCode(org1, org2.getNodeCode());
            String newOrgCode2 = makeOrgCode(org2, org1.getNodeCode());
            List<BulkOperation> bulkOperations = new ArrayList<>();

            // 进行批量更新操作
            return getUpdateCodeList(org1, newOrgCode1, org2.getNodeCode())
                .compose(list -> {
                  bulkOperations.addAll(list);

                  return getUpdateCodeList(org2, newOrgCode2, org1.getNodeCode());
                }).compose(list -> {
                  bulkOperations.addAll(list);

                  return this.bulkWrite(getCollectionName(), bulkOperations);
                });
          }
        }).setHandler(ar -> {
          if (ar.succeeded()) {
            resultHandler.handle(Future.succeededFuture());
          } else {
            resultHandler.handle(Future.failedFuture(ar.cause()));
          }
        });

    return this;
  }

  @Override
  public OrganizationService deactivate(String id, Boolean deactivated, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    JsonObject query = getCondition(id, principal).getQuery();

    logger.info("deactivate " + id + " to " + deactivated);

    this.findOne(getCollectionName(), query, new JsonObject())
        .map(option -> option.map(Organization::new).orElse(null))
        .compose(organization -> {
          if (organization == null) {
            return Future.failedFuture("Not found");
          } else if (organization.getDeactivated() == deactivated) {
            return Future.succeededFuture();
          } else {
            JsonObject update = new JsonObject().put("deactivated", deactivated);
            if (deactivated) {
              update.put("deactivatedAt", new Date().getTime());
            } else {
              update.put("deactivatedAt", 0);
            }

            return this.update(getCollectionName(),
                new JsonObject().put("parentIds", organization.getId()), update);
          }
        }).setHandler(resultHandler);

    return this;
  }

  private Future<List<BulkOperation>> getUpdateCodeList(Organization organization, String orgCode, int nodeCode) {
    return this.findWithOptions(getCollectionName(),
        new JsonObject().put("parentIds", organization.getId()),
        new JsonObject().put("skip", 10000))
        .map(list -> list.stream().map(org -> {
          JsonObject object = new JsonObject()
              .put("orgCode", org.getString("orgCode").replace(organization.getOrgCode(), orgCode));
          if (org.getString("id") == organization.getId()) {
            object.put("nodeCode", nodeCode);
          }
          object.put("updatedTime", new Date().getTime());

          return new BulkOperation(new JsonObject()
              .put("type", "update")
              .put("filter", new JsonObject().put("_id", org.getString("id")))
              .put("document", new JsonObject().put("$set", object))
              .put("upsert", false)
              .put("multi", false));
        }).collect(Collectors.toList()));
  }

  // 设置按单位权限过滤检索条件
  private QueryCondition getCondition(String id, JsonObject principal) {
//    JsonObject query = new JsonObject().put("_id", id);
    JsonObject query = new JsonObject().put("$or", new JsonArray()
        .add(new JsonObject().put("_id", id))
        .add(new JsonObject().put("displayName", id)));

    QueryCondition condition = new QueryCondition(query, new JsonObject())
        .filterByUserOrganizationV1("parentIds", principal);

    return condition;
  }

  private List<String> getParentIds(JsonObject obj) {
    List<String> parentIds = new ArrayList<>();
    if (obj != null && obj.containsKey("parentIds")) {
      parentIds = obj.getJsonArray("parentIds").getList();
    }

    return parentIds;
  }

  private List<String> makeParentIds(JsonObject parent) {
    List<String> parentIds = new ArrayList<>();
    if (parent != null && parent.containsKey("parentIds")) {
      parentIds = parent.getJsonArray("parentIds").getList();
    }
    if (parent != null) {
      parentIds.add(parent.getString("id"));
    }


    return parentIds;
  }

  // 自动设置单位全名称
  private String makeDisplayName(JsonObject parent, Organization organization) {
    if (parent != null) {
      if ((parent.getInteger("orgSequence") == OrgSequence.Army.getValue() &&
        organization.getOrgSequence() > OrgSequence.Army.getValue()) || !parent.containsKey("displayName")) {
        return organization.getName();
      } else {
        return parent.getString("displayName") + organization.getName();
      }
    } else {
      return organization.getName();
    }
  }

  private String makeOrgCode(JsonObject parent, Organization organization) {
    if (parent != null)
      return parent.getString("orgCode") + String.format("%02d", organization.getNodeCode()%100);
    else
      return String.format("%02d", organization.getNodeCode()%100);
  }

  private String makeOrgCode(Organization organization, int newNodeCode) {
    String newCode = organization.getOrgCode() == null ? "" : organization.getOrgCode();
    if (newCode.length() < 2) {
      newCode = "";
    } else {
      newCode = newCode.substring(0, newCode.length()-2);
    }
    newCode += String.format("%02d", newNodeCode%100);

    return newCode;
  }

  // 获取单位父节点
  private Future<JsonObject> getParentOrg(String parentId, JsonObject principal) {
    if (parentId == null && principal.containsKey("organizationId")) {
      parentId = principal.getString("organizationId");
    }

    if (parentId != null) {
      return this.findOne(getCollectionName(), new JsonObject().put("_id", parentId), new JsonObject())
          .otherwise(Optional.empty())
          .map(option -> option.orElse(null));
    } else {
//      return this.findWithOptions(getCollectionName(),
//          new JsonObject().put("parentId", new JsonObject().put("$exists", false)), new JsonObject())
//          .otherwiseEmpty()
//          .map(list -> list.isEmpty() ? null : list.get(0));
      return Future.succeededFuture();
    }
  }

  // 检查添加单位权限
  private boolean checkPermission(JsonObject parent, JsonObject principal) {
    String userOrgId = principal.getString("organizationId");

    if (userOrgId == null) {
      return true;
    } else if (parent == null || parent.getJsonArray("parentIds") == null) {
      return false;
    } else {
      return parent.getJsonArray("parentIds").getList().contains(userOrgId);
    }
  }

  private Future<Void> validateParams(Organization organization, Boolean forAdd) {
    Future<Void> future = Future.future();

    Boolean failed = false;

    if (forAdd) {
      failed = failed || organization.getName() == null || organization.getName().isEmpty();
      failed = failed || organization.getNodeCode() == 0;
      failed = failed || !(Arrays.stream(OrgSequence.values())
          .anyMatch(os -> os.getValue() == organization.getOrgSequence()));
      failed = failed || !(Arrays.stream(OrgType.values())
          .anyMatch(ot -> ot.getName().equals(organization.getOrgType())));
    } else {
      failed = failed || !((organization.getOrgSequence() == 0) ||
          Arrays.stream(OrgSequence.values())
              .anyMatch(os -> os.getValue() == organization.getOrgSequence()));
      failed = failed || !((organization.getOrgType() == null) ||
          Arrays.stream(OrgType.values())
          .anyMatch(ot -> ot.getName().equals(organization.getOrgType())));
    }


    if ((forAdd && organization.getId() != null) ||
        failed) {
      future.fail("Invalid parameter");
    } else {
      future.complete();
    }

    return future;
  }

  private Future<JsonObject> fillChildCount(JsonObject object) {
    if (object != null) {
      return this.count(getCollectionName(), new JsonObject().put("parentId", object.getString("id")))
          .map(count -> object.put("childCount", count));
    } else {
      return Future.succeededFuture(null);
    }
  }
}
