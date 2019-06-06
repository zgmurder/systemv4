package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.CourseTime}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.CourseTime} original class using Vert.x codegen.
 */
public class CourseTimeConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, CourseTime obj) {
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
        case "hoursAtNight":
          if (member.getValue() instanceof Number) {
            obj.setHoursAtNight(((Number)member.getValue()).intValue());
          }
          break;
        case "hoursInDay":
          if (member.getValue() instanceof Number) {
            obj.setHoursInDay(((Number)member.getValue()).intValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "major":
          if (member.getValue() instanceof String) {
            obj.setMajor((String)member.getValue());
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
        case "sectionId":
          if (member.getValue() instanceof String) {
            obj.setSectionId((String)member.getValue());
          }
          break;
        case "serviceReqs":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setServiceReqs(list);
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "tasks":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setTasks(list);
          }
          break;
      }
    }
  }

  public static void toJson(CourseTime obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(CourseTime obj, java.util.Map<String, Object> json) {
    if (obj.getCourseIds() != null) {
      JsonArray array = new JsonArray();
      obj.getCourseIds().forEach(item -> array.add(item));
      json.put("courseIds", array);
    }
    json.put("hoursAtNight", obj.getHoursAtNight());
    json.put("hoursInDay", obj.getHoursInDay());
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getMajor() != null) {
      json.put("major", obj.getMajor());
    }
    if (obj.getOrgCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgCategories().forEach(item -> array.add(item));
      json.put("orgCategories", array);
    }
    if (obj.getPersonProperties() != null) {
      JsonArray array = new JsonArray();
      obj.getPersonProperties().forEach(item -> array.add(item));
      json.put("personProperties", array);
    }
    if (obj.getSectionId() != null) {
      json.put("sectionId", obj.getSectionId());
    }
    if (obj.getServiceReqs() != null) {
      JsonArray array = new JsonArray();
      obj.getServiceReqs().forEach(item -> array.add(item));
      json.put("serviceReqs", array);
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    if (obj.getTasks() != null) {
      JsonArray array = new JsonArray();
      obj.getTasks().forEach(item -> array.add(item));
      json.put("tasks", array);
    }
  }
}
