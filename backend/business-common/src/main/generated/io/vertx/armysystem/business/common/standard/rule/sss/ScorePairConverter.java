package io.vertx.armysystem.business.common.standard.rule.sss;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.sss.ScorePair}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.sss.ScorePair} original class using Vert.x codegen.
 */
public class ScorePairConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, ScorePair obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
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

  public static void toJson(ScorePair obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(ScorePair obj, java.util.Map<String, Object> json) {
    if (obj.getCount() != null) {
      json.put("count", obj.getCount());
    }
    if (obj.getScore() != null) {
      json.put("score", obj.getScore());
    }
  }
}
