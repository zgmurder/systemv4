package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.StageTime}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.StageTime} original class using Vert.x codegen.
 */
public class StageTimeConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, StageTime obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "months":
          if (member.getValue() instanceof Number) {
            obj.setMonths(((Number)member.getValue()).doubleValue());
          }
          break;
        case "task":
          if (member.getValue() instanceof String) {
            obj.setTask((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(StageTime obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(StageTime obj, java.util.Map<String, Object> json) {
    if (obj.getMonths() != null) {
      json.put("months", obj.getMonths());
    }
    if (obj.getTask() != null) {
      json.put("task", obj.getTask());
    }
  }
}
