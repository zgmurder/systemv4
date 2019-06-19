package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.RetrainRule}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.RetrainRule} original class using Vert.x codegen.
 */
public class RetrainRuleConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, RetrainRule obj) {
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
        case "sequence":
          if (member.getValue() instanceof Number) {
            obj.setSequence(((Number)member.getValue()).intValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "weight":
          if (member.getValue() instanceof Number) {
            obj.setWeight(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(RetrainRule obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(RetrainRule obj, java.util.Map<String, Object> json) {
    if (obj.getCourseId() != null) {
      json.put("courseId", obj.getCourseId());
    }
    json.put("hours", obj.getHours());
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
    json.put("sequence", obj.getSequence());
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    json.put("weight", obj.getWeight());
  }
}
