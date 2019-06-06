package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.RequiredSportCourse}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.RequiredSportCourse} original class using Vert.x codegen.
 */
public class RequiredSportCourseConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, RequiredSportCourse obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "ageEnabled":
          if (member.getValue() instanceof Boolean) {
            obj.setAgeEnabled((Boolean)member.getValue());
          }
          break;
        case "civilServant":
          if (member.getValue() instanceof Boolean) {
            obj.setCivilServant((Boolean)member.getValue());
          }
          break;
        case "courseId":
          if (member.getValue() instanceof String) {
            obj.setCourseId((String)member.getValue());
          }
          break;
        case "fromAge":
          if (member.getValue() instanceof Number) {
            obj.setFromAge(((Number)member.getValue()).intValue());
          }
          break;
        case "genders":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setGenders(list);
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "physicalLevels":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setPhysicalLevels(list);
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "toAge":
          if (member.getValue() instanceof Number) {
            obj.setToAge(((Number)member.getValue()).intValue());
          }
          break;
        case "troopCategories":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setTroopCategories(list);
          }
          break;
      }
    }
  }

  public static void toJson(RequiredSportCourse obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(RequiredSportCourse obj, java.util.Map<String, Object> json) {
    if (obj.getAgeEnabled() != null) {
      json.put("ageEnabled", obj.getAgeEnabled());
    }
    if (obj.getCivilServant() != null) {
      json.put("civilServant", obj.getCivilServant());
    }
    if (obj.getCourseId() != null) {
      json.put("courseId", obj.getCourseId());
    }
    json.put("fromAge", obj.getFromAge());
    if (obj.getGenders() != null) {
      JsonArray array = new JsonArray();
      obj.getGenders().forEach(item -> array.add(item));
      json.put("genders", array);
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getPhysicalLevels() != null) {
      JsonArray array = new JsonArray();
      obj.getPhysicalLevels().forEach(item -> array.add(item));
      json.put("physicalLevels", array);
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    json.put("toAge", obj.getToAge());
    if (obj.getTroopCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getTroopCategories().forEach(item -> array.add(item));
      json.put("troopCategories", array);
    }
  }
}
