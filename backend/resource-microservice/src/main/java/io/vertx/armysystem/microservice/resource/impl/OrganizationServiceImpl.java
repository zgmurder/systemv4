package io.vertx.armysystem.microservice.resource.impl;

import io.vertx.armysystem.business.common.QueryCondition;
import io.vertx.armysystem.business.common.ServiceBase;
import io.vertx.armysystem.business.common.enums.OrgSequence;
import io.vertx.armysystem.business.common.resource.Organization;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.armysystem.microservice.resource.OrganizationService;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.mvel2.ast.Or;

import java.util.ArrayList;
import java.util.List;

public class OrganizationServiceImpl extends MongoRepositoryWrapper implements OrganizationService, ServiceBase {
  private final Vertx vertx;

  public OrganizationServiceImpl(Vertx vertx, JsonObject config) {
    super(vertx, config);
    this.vertx = vertx;
  }

  @Override
  public String getServiceName() {
    return "dictionary-Organization-eb-service";
  }

  @Override
  public String getServiceAddress() {
    return "service.dictionary.Organization";
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
            new JsonObject().put("orgCode", 1), new JsonObject().put("orgCode", true)))
        .otherwise(err -> null)
        .compose(o -> this.createIndexWithOptions(getCollectionName(),
            new JsonObject().put("parentIds", 1), new JsonObject()))
        .otherwise(err -> null)
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public OrganizationService addOne(JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    Organization organization = new Organization(item);

    getParentOrg(organization.getParentId(), principal).compose(parent -> {
      Future<JsonObject> future2 = Future.future();

      if (parent == null && organization.getParentId() != null) {
        // parentId not found
        future2.fail("No permission");
      } else {
        // 设置单位长名称
        organization.setDisplayName(makeDisplayName(parent, organization));
        // 设置单位 nodeCode 和 orgCode

//        organization.setParentIds(parent.getJsonArray(""))
      }

      return future2;
    });

    return this;
  }

  @Override
  public OrganizationService retrieveOne(String id, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    this.findOne(getCollectionName(), getCondition(id, principal).getQuery(), new JsonObject())
        .map(option -> option.orElse(null))
        .setHandler(resultHandler);

    return this;
  }

  @Override
  public OrganizationService retrieveAll(JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    return this;
  }

  @Override
  public OrganizationService count(JsonObject condition, JsonObject principal, Handler<AsyncResult<Long>> resultHandler) {
    return this;
  }

  @Override
  public OrganizationService retrieveManyByCondition(JsonObject condition, JsonObject principal, Handler<AsyncResult<List<JsonObject>>> resultHandler) {
    return this;
  }

  @Override
  public OrganizationService updateOne(String id, JsonObject item, JsonObject principal, Handler<AsyncResult<JsonObject>> resultHandler) {
    return this;
  }

  @Override
  public OrganizationService deleteOne(String id, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    return this;
  }

  @Override
  public OrganizationService swapPosition(String id, String otherId, JsonObject principal, Handler<AsyncResult<Void>> resultHandler) {
    return this;
  }

  private QueryCondition getCondition(String id, JsonObject principal) {
    JsonObject query = new JsonObject().put("_id", id);

    QueryCondition condition = new QueryCondition(query, new JsonObject())
        .filterByUserOrganizationV1("parentIds", principal);

    return condition;
  }

  private List<String> makeParentIds(JsonObject parent, String currId) {
    List<String> parentIds = new ArrayList<>();
    if (parent != null && parent.containsKey("parentIds")) {
      parentIds = parent.getJsonArray("parentIds").getList();
    }
    parentIds.add(currId);

    return parentIds;
  }

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

  private Future<JsonObject> getParentOrg(String parentId, JsonObject principal) {
    Future<JsonObject> future = Future.future();
    if (parentId != null) {
      retrieveOne(parentId, principal, future.completer());
    } else {
      if (principal.containsKey("organizationId")) {
        retrieveOne(principal.getString("organizationId"), principal, future.completer());
      } else {
        this.findWithOptions(getCollectionName(),
            new JsonObject().put("parentId", new JsonObject().put("$exists", false)), new JsonObject())
            .setHandler(ar -> {
              if (ar.succeeded() && !ar.result().isEmpty()) {
                future.complete(ar.result().get(0));
              } else {
                future.complete();
              }
            });
      }
    }

    return future;
  }

  private String makeOrgCode(JsonObject parent, Organization organization) {
    return "";
  }
}
