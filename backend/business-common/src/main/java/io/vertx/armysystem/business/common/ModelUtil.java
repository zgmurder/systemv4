package io.vertx.armysystem.business.common;

import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

public final class ModelUtil {

  public ModelUtil() {}

  public static Future<JsonObject> fillOrganization(MongoRepositoryWrapper mongo, JsonObject object) {
    if (object == null || !object.containsKey("organizationId")) {
      return Future.succeededFuture(object);
    } else {
      return mongo.findOne("Organization",
          new JsonObject().put("_id", object.getString("organizationId")), new JsonObject())
          .map(option -> option.isPresent()?object.put("organization", option.get()):object);
    }
  }

  public static Future<JsonObject> fillSoldier(MongoRepositoryWrapper mongo, JsonObject object) {
    if (object == null || !object.containsKey("soldierId")) {
      return Future.succeededFuture(object);
    } else {
      return mongo.findOne("Soldier",
          new JsonObject().put("_id", object.getString("soldierId")), new JsonObject())
          .map(option -> option.isPresent()?object.put("soldier", option.get()):object);
    }
  }

  public static Future<JsonObject> validateOrganization(JsonObject principal, JsonObject model) {
    Future<JsonObject> future = Future.future();

    String userOrgId = principal.getString("organizationId");
    if (userOrgId == null) {
      future.complete(model);
    } else {
      String organizationId = model.getString("organizationId");
      List<String> parentOrgIds = new ArrayList<>();
      if (model.containsKey("organization") &&
          model.getJsonObject("organization").containsKey("parentIds")) {
        parentOrgIds = model.getJsonObject("organization").getJsonArray("parentIds").getList();
      }

      if (parentOrgIds.contains(userOrgId) || userOrgId == organizationId) {
        future.complete(model);
      } else {
        future.fail("Unauthorized");
      }
    }

    return future;
  }
}
