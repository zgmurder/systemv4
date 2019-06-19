package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.OrgMultipleCourseScoreRule}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.OrgMultipleCourseScoreRule} original class using Vert.x codegen.
 */
public class OrgMultipleCourseScoreRuleConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, OrgMultipleCourseScoreRule obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "conditions":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.standard.rule.mtsr.Condition> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.business.common.standard.rule.mtsr.Condition((JsonObject)item));
            });
            obj.setConditions(list);
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "score":
          if (member.getValue() instanceof Number) {
            obj.setScore(((Number)member.getValue()).intValue());
          }
          break;
        case "scoreCriteria":
          if (member.getValue() instanceof String) {
            obj.setScoreCriteria((String)member.getValue());
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

  public static void toJson(OrgMultipleCourseScoreRule obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(OrgMultipleCourseScoreRule obj, java.util.Map<String, Object> json) {
    if (obj.getConditions() != null) {
      JsonArray array = new JsonArray();
      obj.getConditions().forEach(item -> array.add(item.toJson()));
      json.put("conditions", array);
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    json.put("score", obj.getScore());
    if (obj.getScoreCriteria() != null) {
      json.put("scoreCriteria", obj.getScoreCriteria());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
  }
}
