package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.PlaceRequirement}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.PlaceRequirement} original class using Vert.x codegen.
 */
public class PlaceRequirementConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, PlaceRequirement obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "optionalPlaces":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setOptionalPlaces(list);
          }
          break;
        case "orgCategory":
          if (member.getValue() instanceof String) {
            obj.setOrgCategory((String)member.getValue());
          }
          break;
        case "requiredPlaces":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setRequiredPlaces(list);
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

  public static void toJson(PlaceRequirement obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(PlaceRequirement obj, java.util.Map<String, Object> json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getOptionalPlaces() != null) {
      JsonArray array = new JsonArray();
      obj.getOptionalPlaces().forEach(item -> array.add(item));
      json.put("optionalPlaces", array);
    }
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    if (obj.getRequiredPlaces() != null) {
      JsonArray array = new JsonArray();
      obj.getRequiredPlaces().forEach(item -> array.add(item));
      json.put("requiredPlaces", array);
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
  }
}
