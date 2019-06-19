package io.vertx.armysystem.business.common.standard.rule.loasr;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.loasr.Condition}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.loasr.Condition} original class using Vert.x codegen.
 */
public class ConditionConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Condition obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "courseNum":
          if (member.getValue() instanceof Number) {
            obj.setCourseNum(((Number)member.getValue()).intValue());
          }
          break;
        case "exerciseSocre":
          if (member.getValue() instanceof Number) {
            obj.setExerciseSocre(((Number)member.getValue()).intValue());
          }
          break;
        case "scoreCriteria":
          if (member.getValue() instanceof String) {
            obj.setScoreCriteria((String)member.getValue());
          }
          break;
        case "scoreReq":
          if (member.getValue() instanceof Number) {
            obj.setScoreReq(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(Condition obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Condition obj, java.util.Map<String, Object> json) {
    json.put("courseNum", obj.getCourseNum());
    json.put("exerciseSocre", obj.getExerciseSocre());
    if (obj.getScoreCriteria() != null) {
      json.put("scoreCriteria", obj.getScoreCriteria());
    }
    json.put("scoreReq", obj.getScoreReq());
  }
}
