package io.vertx.armysystem.business.common.dictionary;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.TrainStep}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.TrainStep} original class using Vert.x codegen.
 */
public class TrainStepConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, TrainStep obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
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
        case "order":
          if (member.getValue() instanceof Number) {
            obj.setOrder(((Number)member.getValue()).intValue());
          }
          break;
        case "orgType":
          if (member.getValue() instanceof String) {
            obj.setOrgType((String)member.getValue());
          }
          break;
        case "priority":
          if (member.getValue() instanceof Number) {
            obj.setPriority(((Number)member.getValue()).intValue());
          }
          break;
        case "trainUnits":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.Integer> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof Number)
                list.add(((Number)item).intValue());
            });
            obj.setTrainUnits(list);
          }
          break;
      }
    }
  }

  public static void toJson(TrainStep obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(TrainStep obj, java.util.Map<String, Object> json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    json.put("order", obj.getOrder());
    if (obj.getOrgType() != null) {
      json.put("orgType", obj.getOrgType());
    }
    json.put("priority", obj.getPriority());
    if (obj.getTrainUnits() != null) {
      JsonArray array = new JsonArray();
      obj.getTrainUnits().forEach(item -> array.add(item));
      json.put("trainUnits", array);
    }
  }
}
