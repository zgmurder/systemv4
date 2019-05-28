package io.vertx.armysystem.business.common;

import io.vertx.armysystem.business.common.resource.Organization;
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

  public static Future<Long> countByWithOrganization(MongoRepositoryWrapper mongo, String collection, QueryCondition qCondition) {
    JsonArray pipeline = new JsonArray()
        .add(new JsonObject().put("$lookup", new JsonObject()
            .put("from", "Organization")
            .put("localField", "organizationId")
            .put("foreignField", "_id")
            .put("as", "organization")))
        .add(new JsonObject().put("$match", qCondition.getQuery()))
        .add(new JsonObject().put("$count", "count"));

    List<JsonObject> results = new ArrayList<>();
    Future<List<JsonObject>> future = Future.future();
    mongo.aggregateWithOptions(collection, pipeline, new JsonObject())
        .handler(object -> results.add(object))
        .endHandler(v -> {
          future.complete(results);
        })
        .exceptionHandler(ex -> {
          future.fail(ex);
        });
    return future.map(list -> {
      if (list.isEmpty()) {
        return 0L;
      } else {
        return list.get(0).getLong("count");
      }
    });
  }
}
