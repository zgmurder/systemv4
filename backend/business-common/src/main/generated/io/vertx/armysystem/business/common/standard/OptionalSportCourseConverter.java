package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.OptionalSportCourse}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.OptionalSportCourse} original class using Vert.x codegen.
 */
public class OptionalSportCourseConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, OptionalSportCourse obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "courseIds":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setCourseIds(list);
          }
          break;
        case "gender":
          if (member.getValue() instanceof String) {
            obj.setGender((String)member.getValue());
          }
          break;
        case "groupId":
          if (member.getValue() instanceof Number) {
            obj.setGroupId(((Number)member.getValue()).intValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "itemSeq":
          if (member.getValue() instanceof Number) {
            obj.setItemSeq(((Number)member.getValue()).intValue());
          }
          break;
        case "physicalLevel":
          if (member.getValue() instanceof String) {
            obj.setPhysicalLevel((String)member.getValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
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

  public static void toJson(OptionalSportCourse obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(OptionalSportCourse obj, java.util.Map<String, Object> json) {
    if (obj.getCourseIds() != null) {
      JsonArray array = new JsonArray();
      obj.getCourseIds().forEach(item -> array.add(item));
      json.put("courseIds", array);
    }
    if (obj.getGender() != null) {
      json.put("gender", obj.getGender());
    }
    json.put("groupId", obj.getGroupId());
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    json.put("itemSeq", obj.getItemSeq());
    if (obj.getPhysicalLevel() != null) {
      json.put("physicalLevel", obj.getPhysicalLevel());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    if (obj.getTroopCategory() != null) {
      json.put("troopCategory", obj.getTroopCategory());
    }
  }
}
