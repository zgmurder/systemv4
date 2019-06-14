package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.MotorRequirement}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.MotorRequirement} original class using Vert.x codegen.
 */
public class MotorRequirementConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, MotorRequirement obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "majorType":
          if (member.getValue() instanceof String) {
            obj.setMajorType((String)member.getValue());
          }
          break;
        case "orgCategory":
          if (member.getValue() instanceof String) {
            obj.setOrgCategory((String)member.getValue());
          }
          break;
        case "quota":
          if (member.getValue() instanceof Number) {
            obj.setQuota(((Number)member.getValue()).intValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "unitType":
          if (member.getValue() instanceof String) {
            obj.setUnitType((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(MotorRequirement obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(MotorRequirement obj, java.util.Map<String, Object> json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getMajorType() != null) {
      json.put("majorType", obj.getMajorType());
    }
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    json.put("quota", obj.getQuota());
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    if (obj.getUnitType() != null) {
      json.put("unitType", obj.getUnitType());
    }
  }
}
