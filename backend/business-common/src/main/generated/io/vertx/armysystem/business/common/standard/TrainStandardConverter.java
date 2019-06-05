package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.TrainStandard}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.TrainStandard} original class using Vert.x codegen.
 */
public class TrainStandardConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, TrainStandard obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "endTime":
          if (member.getValue() instanceof Number) {
            obj.setEndTime(((Number)member.getValue()).longValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "name":
          if (member.getValue() instanceof String) {
            obj.setName((String)member.getValue());
          }
          break;
        case "startTime":
          if (member.getValue() instanceof Number) {
            obj.setStartTime(((Number)member.getValue()).longValue());
          }
          break;
        case "state":
          if (member.getValue() instanceof Number) {
            obj.setState(((Number)member.getValue()).intValue());
          }
          break;
        case "version":
          if (member.getValue() instanceof String) {
            obj.setVersion((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(TrainStandard obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(TrainStandard obj, java.util.Map<String, Object> json) {
    if (obj.getEndTime() != null) {
      json.put("endTime", obj.getEndTime());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getStartTime() != null) {
      json.put("startTime", obj.getStartTime());
    }
    json.put("state", obj.getState());
    if (obj.getVersion() != null) {
      json.put("version", obj.getVersion());
    }
  }
}
