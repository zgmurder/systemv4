package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.TrainSection}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.TrainSection} original class using Vert.x codegen.
 */
public class TrainSectionConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, TrainSection obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "code":
          if (member.getValue() instanceof String) {
            obj.setCode((String)member.getValue());
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
        case "orgTypes":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setOrgTypes(list);
          }
          break;
        case "personProperties":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setPersonProperties(list);
          }
          break;
        case "standardName":
          if (member.getValue() instanceof String) {
            obj.setStandardName((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(TrainSection obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(TrainSection obj, java.util.Map<String, Object> json) {
    if (obj.getCode() != null) {
      json.put("code", obj.getCode());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOrgCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgCategories().forEach(item -> array.add(item));
      json.put("orgCategories", array);
    }
    if (obj.getOrgTypes() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgTypes().forEach(item -> array.add(item));
      json.put("orgTypes", array);
    }
    if (obj.getPersonProperties() != null) {
      JsonArray array = new JsonArray();
      obj.getPersonProperties().forEach(item -> array.add(item));
      json.put("personProperties", array);
    }
    if (obj.getStandardName() != null) {
      json.put("standardName", obj.getStandardName());
    }
  }
}
