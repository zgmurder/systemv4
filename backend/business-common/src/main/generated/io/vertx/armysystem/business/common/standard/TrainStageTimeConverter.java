package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.TrainStageTime}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.TrainStageTime} original class using Vert.x codegen.
 */
public class TrainStageTimeConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, TrainStageTime obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "majors":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setMajors(list);
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
        case "stageTimes":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.standard.StageTime> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.business.common.standard.StageTime((JsonObject)item));
            });
            obj.setStageTimes(list);
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

  public static void toJson(TrainStageTime obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(TrainStageTime obj, java.util.Map<String, Object> json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getMajors() != null) {
      JsonArray array = new JsonArray();
      obj.getMajors().forEach(item -> array.add(item));
      json.put("majors", array);
    }
    if (obj.getOrgCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgCategories().forEach(item -> array.add(item));
      json.put("orgCategories", array);
    }
    if (obj.getStageTimes() != null) {
      JsonArray array = new JsonArray();
      obj.getStageTimes().forEach(item -> array.add(item.toJson()));
      json.put("stageTimes", array);
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
  }
}
