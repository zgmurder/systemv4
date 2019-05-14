package io.vertx.armysystem.business.common.dictionary;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.OrdnanceType}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.OrdnanceType} original class using Vert.x codegen.
 */
public class OrdnanceTypeConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, OrdnanceType obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "bulletUnit":
          if (member.getValue() instanceof String) {
            obj.setBulletUnit((String)member.getValue());
          }
          break;
        case "category":
          if (member.getValue() instanceof String) {
            obj.setCategory((String)member.getValue());
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
        case "weaponUnit":
          if (member.getValue() instanceof String) {
            obj.setWeaponUnit((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(OrdnanceType obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(OrdnanceType obj, java.util.Map<String, Object> json) {
    if (obj.getBulletUnit() != null) {
      json.put("bulletUnit", obj.getBulletUnit());
    }
    if (obj.getCategory() != null) {
      json.put("category", obj.getCategory());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    json.put("order", obj.getOrder());
    if (obj.getWeaponUnit() != null) {
      json.put("weaponUnit", obj.getWeaponUnit());
    }
  }
}
