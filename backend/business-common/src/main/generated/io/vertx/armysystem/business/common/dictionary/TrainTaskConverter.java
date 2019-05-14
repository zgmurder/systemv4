package io.vertx.armysystem.business.common.dictionary;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.TrainTask}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.TrainTask} original class using Vert.x codegen.
 */
public class TrainTaskConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, TrainTask obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "name":
          if (member.getValue() instanceof String) {
            obj.setName((String)member.getValue());
          }
          break;
        case "optionalSubjects":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setOptionalSubjects(list);
          }
          break;
      }
    }
  }

  public static void toJson(TrainTask obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(TrainTask obj, java.util.Map<String, Object> json) {
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOptionalSubjects() != null) {
      JsonArray array = new JsonArray();
      obj.getOptionalSubjects().forEach(item -> array.add(item));
      json.put("optionalSubjects", array);
    }
  }
}
