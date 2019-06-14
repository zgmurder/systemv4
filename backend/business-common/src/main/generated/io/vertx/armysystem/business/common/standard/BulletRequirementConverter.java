package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.BulletRequirement}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.BulletRequirement} original class using Vert.x codegen.
 */
public class BulletRequirementConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, BulletRequirement obj) {
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
        case "numType":
          if (member.getValue() instanceof String) {
            obj.setNumType((String)member.getValue());
          }
          break;
        case "ordnanceType":
          if (member.getValue() instanceof String) {
            obj.setOrdnanceType((String)member.getValue());
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
        case "rankL1":
          if (member.getValue() instanceof String) {
            obj.setRankL1((String)member.getValue());
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

  public static void toJson(BulletRequirement obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(BulletRequirement obj, java.util.Map<String, Object> json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getMajorType() != null) {
      json.put("majorType", obj.getMajorType());
    }
    if (obj.getNumType() != null) {
      json.put("numType", obj.getNumType());
    }
    if (obj.getOrdnanceType() != null) {
      json.put("ordnanceType", obj.getOrdnanceType());
    }
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    json.put("quota", obj.getQuota());
    if (obj.getRankL1() != null) {
      json.put("rankL1", obj.getRankL1());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    if (obj.getUnitType() != null) {
      json.put("unitType", obj.getUnitType());
    }
  }
}
