package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.OrgScoreRequirement}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.OrgScoreRequirement} original class using Vert.x codegen.
 */
public class OrgScoreRequirementConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, OrgScoreRequirement obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "orgCategory":
          if (member.getValue() instanceof String) {
            obj.setOrgCategory((String)member.getValue());
          }
          break;
        case "scoreReq":
          if (member.getValue() instanceof Number) {
            obj.setScoreReq(((Number)member.getValue()).intValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(OrgScoreRequirement obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(OrgScoreRequirement obj, java.util.Map<String, Object> json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    json.put("scoreReq", obj.getScoreReq());
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
  }
}
