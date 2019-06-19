package io.vertx.armysystem.business.common.standard.rule.sss;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.sss.Condition}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.sss.Condition} original class using Vert.x codegen.
 */
public class ConditionConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Condition obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "ageFrom":
          if (member.getValue() instanceof Number) {
            obj.setAgeFrom(((Number)member.getValue()).intValue());
          }
          break;
        case "ageTo":
          if (member.getValue() instanceof Number) {
            obj.setAgeTo(((Number)member.getValue()).intValue());
          }
          break;
        case "count":
          if (member.getValue() instanceof Number) {
            obj.setCount(((Number)member.getValue()).doubleValue());
          }
          break;
        case "score":
          if (member.getValue() instanceof Number) {
            obj.setScore(((Number)member.getValue()).doubleValue());
          }
          break;
      }
    }
  }

  public static void toJson(Condition obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Condition obj, java.util.Map<String, Object> json) {
    json.put("ageFrom", obj.getAgeFrom());
    json.put("ageTo", obj.getAgeTo());
    if (obj.getCount() != null) {
      json.put("count", obj.getCount());
    }
    if (obj.getScore() != null) {
      json.put("score", obj.getScore());
    }
  }
}
