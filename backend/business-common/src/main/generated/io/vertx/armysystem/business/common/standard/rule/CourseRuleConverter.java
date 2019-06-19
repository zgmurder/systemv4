package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.CourseRule}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.CourseRule} original class using Vert.x codegen.
 */
public class CourseRuleConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, CourseRule obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "childRules":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.standard.rule.ChildRule> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.business.common.standard.rule.ChildRule((JsonObject)item));
            });
            obj.setChildRules(list);
          }
          break;
        case "courseId":
          if (member.getValue() instanceof String) {
            obj.setCourseId((String)member.getValue());
          }
          break;
        case "forbiddenWeathers":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setForbiddenWeathers(list);
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
        case "preRuleId":
          if (member.getValue() instanceof String) {
            obj.setPreRuleId((String)member.getValue());
          }
          break;
        case "rateEnabled":
          if (member.getValue() instanceof Boolean) {
            obj.setRateEnabled((Boolean)member.getValue());
          }
          break;
        case "rateUnit":
          if (member.getValue() instanceof String) {
            obj.setRateUnit((String)member.getValue());
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
        case "totalEnabled":
          if (member.getValue() instanceof Boolean) {
            obj.setTotalEnabled((Boolean)member.getValue());
          }
          break;
        case "totalTimes":
          if (member.getValue() instanceof Number) {
            obj.setTotalTimes(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(CourseRule obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(CourseRule obj, java.util.Map<String, Object> json) {
    if (obj.getChildRules() != null) {
      JsonArray array = new JsonArray();
      obj.getChildRules().forEach(item -> array.add(item.toJson()));
      json.put("childRules", array);
    }
    if (obj.getCourseId() != null) {
      json.put("courseId", obj.getCourseId());
    }
    if (obj.getForbiddenWeathers() != null) {
      JsonArray array = new JsonArray();
      obj.getForbiddenWeathers().forEach(item -> array.add(item));
      json.put("forbiddenWeathers", array);
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getOrgCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgCategories().forEach(item -> array.add(item));
      json.put("orgCategories", array);
    }
    if (obj.getPreRuleId() != null) {
      json.put("preRuleId", obj.getPreRuleId());
    }
    if (obj.getRateEnabled() != null) {
      json.put("rateEnabled", obj.getRateEnabled());
    }
    if (obj.getRateUnit() != null) {
      json.put("rateUnit", obj.getRateUnit());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    json.put("times", obj.getTimes());
    if (obj.getTotalEnabled() != null) {
      json.put("totalEnabled", obj.getTotalEnabled());
    }
    json.put("totalTimes", obj.getTotalTimes());
  }
}
