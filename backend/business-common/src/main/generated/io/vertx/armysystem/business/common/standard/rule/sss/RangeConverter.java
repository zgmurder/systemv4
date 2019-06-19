package io.vertx.armysystem.business.common.standard.rule.sss;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.sss.Range}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.sss.Range} original class using Vert.x codegen.
 */
public class RangeConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Range obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "from":
          if (member.getValue() instanceof Number) {
            obj.setFrom(((Number)member.getValue()).intValue());
          }
          break;
        case "to":
          if (member.getValue() instanceof Number) {
            obj.setTo(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(Range obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Range obj, java.util.Map<String, Object> json) {
    json.put("from", obj.getFrom());
    json.put("to", obj.getTo());
  }
}
