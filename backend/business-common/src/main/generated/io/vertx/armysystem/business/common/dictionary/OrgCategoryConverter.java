package io.vertx.armysystem.business.common.dictionary;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.OrgCategory}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.OrgCategory} original class using Vert.x codegen.
 */
public class OrgCategoryConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, OrgCategory obj) {
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
        case "optionalMajors":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setOptionalMajors(list);
          }
          break;
        case "optionalServices":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setOptionalServices(list);
          }
          break;
        case "optionalTasks":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.dictionary.TrainTask> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.business.common.dictionary.TrainTask((JsonObject)item));
            });
            obj.setOptionalTasks(list);
          }
          break;
        case "order":
          if (member.getValue() instanceof Number) {
            obj.setOrder(((Number)member.getValue()).intValue());
          }
          break;
        case "orgProperty":
          if (member.getValue() instanceof String) {
            obj.setOrgProperty((String)member.getValue());
          }
          break;
        case "orgType":
          if (member.getValue() instanceof String) {
            obj.setOrgType((String)member.getValue());
          }
          break;
        case "physicalLevel":
          if (member.getValue() instanceof String) {
            obj.setPhysicalLevel((String)member.getValue());
          }
          break;
        case "troopCategory":
          if (member.getValue() instanceof String) {
            obj.setTroopCategory((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(OrgCategory obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(OrgCategory obj, java.util.Map<String, Object> json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOptionalMajors() != null) {
      JsonArray array = new JsonArray();
      obj.getOptionalMajors().forEach(item -> array.add(item));
      json.put("optionalMajors", array);
    }
    if (obj.getOptionalServices() != null) {
      JsonArray array = new JsonArray();
      obj.getOptionalServices().forEach(item -> array.add(item));
      json.put("optionalServices", array);
    }
    if (obj.getOptionalTasks() != null) {
      JsonArray array = new JsonArray();
      obj.getOptionalTasks().forEach(item -> array.add(item.toJson()));
      json.put("optionalTasks", array);
    }
    json.put("order", obj.getOrder());
    if (obj.getOrgProperty() != null) {
      json.put("orgProperty", obj.getOrgProperty());
    }
    if (obj.getOrgType() != null) {
      json.put("orgType", obj.getOrgType());
    }
    if (obj.getPhysicalLevel() != null) {
      json.put("physicalLevel", obj.getPhysicalLevel());
    }
    if (obj.getTroopCategory() != null) {
      json.put("troopCategory", obj.getTroopCategory());
    }
  }
}
