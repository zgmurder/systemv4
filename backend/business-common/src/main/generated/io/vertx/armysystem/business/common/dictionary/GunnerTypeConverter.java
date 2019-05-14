package io.vertx.armysystem.business.common.dictionary;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.GunnerType}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.GunnerType} original class using Vert.x codegen.
 */
public class GunnerTypeConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, GunnerType obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "gunTypes":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setGunTypes(list);
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
        case "order":
          if (member.getValue() instanceof Number) {
            obj.setOrder(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(GunnerType obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(GunnerType obj, java.util.Map<String, Object> json) {
    if (obj.getGunTypes() != null) {
      JsonArray array = new JsonArray();
      obj.getGunTypes().forEach(item -> array.add(item));
      json.put("gunTypes", array);
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    json.put("order", obj.getOrder());
  }
}
