package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.CourseDistribution}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.CourseDistribution} original class using Vert.x codegen.
 */
public class CourseDistributionConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, CourseDistribution obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "courseId":
          if (member.getValue() instanceof String) {
            obj.setCourseId((String)member.getValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
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
        case "serviceReq":
          if (member.getValue() instanceof String) {
            obj.setServiceReq((String)member.getValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "subjects":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setSubjects(list);
          }
          break;
        case "task":
          if (member.getValue() instanceof String) {
            obj.setTask((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(CourseDistribution obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(CourseDistribution obj, java.util.Map<String, Object> json) {
    if (obj.getCourseId() != null) {
      json.put("courseId", obj.getCourseId());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
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
    if (obj.getServiceReq() != null) {
      json.put("serviceReq", obj.getServiceReq());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    if (obj.getSubjects() != null) {
      JsonArray array = new JsonArray();
      obj.getSubjects().forEach(item -> array.add(item));
      json.put("subjects", array);
    }
    if (obj.getTask() != null) {
      json.put("task", obj.getTask());
    }
  }
}
