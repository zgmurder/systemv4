package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.CompetitionRule}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.CompetitionRule} original class using Vert.x codegen.
 */
public class CompetitionRuleConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, CompetitionRule obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "courseId":
          if (member.getValue() instanceof String) {
            obj.setCourseId((String)member.getValue());
          }
          break;
        case "hours":
          if (member.getValue() instanceof Number) {
            obj.setHours(((Number)member.getValue()).intValue());
          }
          break;
        case "hoursEnabled":
          if (member.getValue() instanceof Boolean) {
            obj.setHoursEnabled((Boolean)member.getValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "orgCategories":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setOrgCategories(list);
          }
          break;
        case "sectionId":
          if (member.getValue() instanceof String) {
            obj.setSectionId((String)member.getValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "times":
          if (member.getValue() instanceof Number) {
            obj.setTimes(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(CompetitionRule obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(CompetitionRule obj, java.util.Map<String, Object> json) {
    if (obj.getCourseId() != null) {
      json.put("courseId", obj.getCourseId());
    }
    json.put("hours", obj.getHours());
    if (obj.getHoursEnabled() != null) {
      json.put("hoursEnabled", obj.getHoursEnabled());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getOrgCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgCategories().forEach(item -> array.add(item));
      json.put("orgCategories", array);
    }
    if (obj.getSectionId() != null) {
      json.put("sectionId", obj.getSectionId());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    json.put("times", obj.getTimes());
  }
}
