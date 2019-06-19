package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.DailySchedule}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.DailySchedule} original class using Vert.x codegen.
 */
public class DailyScheduleConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, DailySchedule obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "afternoon":
          if (member.getValue() instanceof Number) {
            obj.setAfternoon(((Number)member.getValue()).doubleValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "morning":
          if (member.getValue() instanceof Number) {
            obj.setMorning(((Number)member.getValue()).doubleValue());
          }
          break;
        case "night":
          if (member.getValue() instanceof Number) {
            obj.setNight(((Number)member.getValue()).doubleValue());
          }
          break;
        case "orgCategory":
          if (member.getValue() instanceof String) {
            obj.setOrgCategory((String)member.getValue());
          }
          break;
        case "sport":
          if (member.getValue() instanceof Number) {
            obj.setSport(((Number)member.getValue()).doubleValue());
          }
          break;
      }
    }
  }

  public static void toJson(DailySchedule obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(DailySchedule obj, java.util.Map<String, Object> json) {
    if (obj.getAfternoon() != null) {
      json.put("afternoon", obj.getAfternoon());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getMorning() != null) {
      json.put("morning", obj.getMorning());
    }
    if (obj.getNight() != null) {
      json.put("night", obj.getNight());
    }
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    if (obj.getSport() != null) {
      json.put("sport", obj.getSport());
    }
  }
}
