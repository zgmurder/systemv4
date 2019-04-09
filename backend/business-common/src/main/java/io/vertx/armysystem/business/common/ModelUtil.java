package io.vertx.armysystem.business.common;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

public final class ModelUtil {

  public ModelUtil() {}

  public static Future<Void> validateOrganization(JsonObject principal, JsonObject model) {
    Future<Void> future = Future.future();

    String userOrgId = principal.getString("organizationId");
    if (userOrgId == null) {
      future.complete();
    } else {
      String organizationId = model.getString("organizationId");
      List<String> parentOrgIds = new ArrayList<>();
      if (model.getJsonArray("parentOrgIds") != null)
        parentOrgIds = model.getJsonArray("parentOrgIds").getList();

      if (parentOrgIds.contains(userOrgId) || userOrgId == organizationId) {
        future.complete();
      } else {
        future.fail("Unauthorized");
      }
    }

    return future;
  }
}
