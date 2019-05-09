package io.vertx.armysystem.business.common;

import io.vertx.armysystem.business.common.resource.Organization;
import io.vertx.armysystem.microservice.common.service.MongoRepositoryWrapper;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

public final class ModelUtil {

  public ModelUtil() {}

  public static Future<JsonObject> fillOrganization(MongoRepositoryWrapper mongo, JsonObject model) {
    if (model.containsKey("organizationId")) {
      return mongo.findOne("Organization", new JsonObject().put("_id", model.getString("organizationId")), new JsonObject())
          .map(o -> {
            if (o.isPresent()) {
              model.put("parentOrgIds", o.get().getJsonArray("parentIds"));
              model.put("organization", o.get());
            }

            return model;
          });
    } else {
      return Future.succeededFuture(model);
    }
  }

  public static Future<Void> validateOrganization(JsonObject principal, JsonObject model) {
    Future<Void> future = Future.future();

    String userOrgId = principal.getString("organizationId");
    if (userOrgId == null) {
      future.complete();
    } else {
      String organizationId = model.getString("organizationId");
      List<String> parentOrgIds = new ArrayList<>();
      if (model.getJsonArray("parentOrgIds") != null) {
        parentOrgIds = model.getJsonArray("parentOrgIds").getList();
      } else if (model.getJsonArray("parentIds") != null) {
        parentOrgIds = model.getJsonArray("parentIds").getList();
      }

      if (parentOrgIds.contains(userOrgId) || userOrgId == organizationId) {
        future.complete();
      } else {
        future.fail("Unauthorized");
      }
    }

    return future;
  }
}
