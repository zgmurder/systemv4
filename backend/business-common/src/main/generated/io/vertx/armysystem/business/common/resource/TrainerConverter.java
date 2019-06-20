package io.vertx.armysystem.business.common.resource;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.resource.Trainer}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.resource.Trainer} original class using Vert.x codegen.
 */
public class TrainerConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Trainer obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "assistCourses":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setAssistCourses(list);
          }
          break;
        case "availableCourses":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setAvailableCourses(list);
          }
          break;
        case "createdTime":
          if (member.getValue() instanceof Number) {
            obj.setCreatedTime(((Number)member.getValue()).longValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "level":
          if (member.getValue() instanceof String) {
            obj.setLevel((String)member.getValue());
          }
          break;
        case "organizationId":
          if (member.getValue() instanceof String) {
            obj.setOrganizationId((String)member.getValue());
          }
          break;
        case "soldierId":
          if (member.getValue() instanceof String) {
            obj.setSoldierId((String)member.getValue());
          }
          break;
        case "startedAt":
          if (member.getValue() instanceof Number) {
            obj.setStartedAt(((Number)member.getValue()).longValue());
          }
          break;
        case "updatedTime":
          if (member.getValue() instanceof Number) {
            obj.setUpdatedTime(((Number)member.getValue()).longValue());
          }
          break;
      }
    }
  }

  public static void toJson(Trainer obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Trainer obj, java.util.Map<String, Object> json) {
    if (obj.getAssistCourses() != null) {
      JsonArray array = new JsonArray();
      obj.getAssistCourses().forEach(item -> array.add(item));
      json.put("assistCourses", array);
    }
    if (obj.getAvailableCourses() != null) {
      JsonArray array = new JsonArray();
      obj.getAvailableCourses().forEach(item -> array.add(item));
      json.put("availableCourses", array);
    }
    if (obj.getCreatedTime() != null) {
      json.put("createdTime", obj.getCreatedTime());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getLevel() != null) {
      json.put("level", obj.getLevel());
    }
    if (obj.getOrganizationId() != null) {
      json.put("organizationId", obj.getOrganizationId());
    }
    if (obj.getSoldierId() != null) {
      json.put("soldierId", obj.getSoldierId());
    }
    if (obj.getStartedAt() != null) {
      json.put("startedAt", obj.getStartedAt());
    }
    if (obj.getUpdatedTime() != null) {
      json.put("updatedTime", obj.getUpdatedTime());
    }
  }
}
