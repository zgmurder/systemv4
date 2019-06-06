package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.SportTime}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.SportTime} original class using Vert.x codegen.
 */
public class SportTimeConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, SportTime obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "hours":
          if (member.getValue() instanceof Number) {
            obj.setHours(((Number)member.getValue()).intValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "physicalLevel":
          if (member.getValue() instanceof String) {
            obj.setPhysicalLevel((String)member.getValue());
          }
          break;
        case "sportCategory":
          if (member.getValue() instanceof String) {
            obj.setSportCategory((String)member.getValue());
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

  public static void toJson(SportTime obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(SportTime obj, java.util.Map<String, Object> json) {
    json.put("hours", obj.getHours());
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getPhysicalLevel() != null) {
      json.put("physicalLevel", obj.getPhysicalLevel());
    }
    if (obj.getSportCategory() != null) {
      json.put("sportCategory", obj.getSportCategory());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
  }
}
