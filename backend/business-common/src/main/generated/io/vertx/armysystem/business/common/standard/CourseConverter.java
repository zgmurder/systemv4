package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.Course}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.Course} original class using Vert.x codegen.
 */
public class CourseConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Course obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "ascending":
          if (member.getValue() instanceof Boolean) {
            obj.setAscending((Boolean)member.getValue());
          }
          break;
        case "category":
          if (member.getValue() instanceof Number) {
            obj.setCategory(((Number)member.getValue()).intValue());
          }
          break;
        case "countType":
          if (member.getValue() instanceof String) {
            obj.setCountType((String)member.getValue());
          }
          break;
        case "gunnerType":
          if (member.getValue() instanceof String) {
            obj.setGunnerType((String)member.getValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "majorReqs":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setMajorReqs(list);
          }
          break;
        case "manual":
          if (member.getValue() instanceof Boolean) {
            obj.setManual((Boolean)member.getValue());
          }
          break;
        case "name":
          if (member.getValue() instanceof String) {
            obj.setName((String)member.getValue());
          }
          break;
        case "ordnanceTypes":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setOrdnanceTypes(list);
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
        case "orgType":
          if (member.getValue() instanceof String) {
            obj.setOrgType((String)member.getValue());
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
        case "placeTypes":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setPlaceTypes(list);
          }
          break;
        case "rankReqs":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setRankReqs(list);
          }
          break;
        case "require":
          if (member.getValue() instanceof String) {
            obj.setRequire((String)member.getValue());
          }
          break;
        case "scoreCriteria":
          if (member.getValue() instanceof String) {
            obj.setScoreCriteria((String)member.getValue());
          }
          break;
        case "sectionId":
          if (member.getValue() instanceof String) {
            obj.setSectionId((String)member.getValue());
          }
          break;
        case "seq":
          if (member.getValue() instanceof Number) {
            obj.setSeq(((Number)member.getValue()).intValue());
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
        case "sportCategory":
          if (member.getValue() instanceof String) {
            obj.setSportCategory((String)member.getValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "subcourses":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.standard.SubCourseL1> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.business.common.standard.SubCourseL1((JsonObject)item));
            });
            obj.setSubcourses(list);
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
        case "testContents":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.standard.TestContent> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.business.common.standard.TestContent((JsonObject)item));
            });
            obj.setTestContents(list);
          }
          break;
        case "textCondition":
          if (member.getValue() instanceof String) {
            obj.setTextCondition((String)member.getValue());
          }
          break;
        case "textEvaluation":
          if (member.getValue() instanceof String) {
            obj.setTextEvaluation((String)member.getValue());
          }
          break;
        case "textStandard":
          if (member.getValue() instanceof String) {
            obj.setTextStandard((String)member.getValue());
          }
          break;
        case "trainStepName":
          if (member.getValue() instanceof String) {
            obj.setTrainStepName((String)member.getValue());
          }
          break;
        case "trainUnits":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.Integer> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof Number)
                list.add(((Number)item).intValue());
            });
            obj.setTrainUnits(list);
          }
          break;
        case "unitType":
          if (member.getValue() instanceof String) {
            obj.setUnitType((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(Course obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Course obj, java.util.Map<String, Object> json) {
    if (obj.getAscending() != null) {
      json.put("ascending", obj.getAscending());
    }
    json.put("category", obj.getCategory());
    if (obj.getCountType() != null) {
      json.put("countType", obj.getCountType());
    }
    if (obj.getGunnerType() != null) {
      json.put("gunnerType", obj.getGunnerType());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getMajorReqs() != null) {
      JsonArray array = new JsonArray();
      obj.getMajorReqs().forEach(item -> array.add(item));
      json.put("majorReqs", array);
    }
    if (obj.getManual() != null) {
      json.put("manual", obj.getManual());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOrdnanceTypes() != null) {
      JsonArray array = new JsonArray();
      obj.getOrdnanceTypes().forEach(item -> array.add(item));
      json.put("ordnanceTypes", array);
    }
    if (obj.getOrgCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgCategories().forEach(item -> array.add(item));
      json.put("orgCategories", array);
    }
    if (obj.getOrgType() != null) {
      json.put("orgType", obj.getOrgType());
    }
    if (obj.getPersonProperties() != null) {
      JsonArray array = new JsonArray();
      obj.getPersonProperties().forEach(item -> array.add(item));
      json.put("personProperties", array);
    }
    if (obj.getPlaceTypes() != null) {
      JsonArray array = new JsonArray();
      obj.getPlaceTypes().forEach(item -> array.add(item));
      json.put("placeTypes", array);
    }
    if (obj.getRankReqs() != null) {
      JsonArray array = new JsonArray();
      obj.getRankReqs().forEach(item -> array.add(item));
      json.put("rankReqs", array);
    }
    if (obj.getRequire() != null) {
      json.put("require", obj.getRequire());
    }
    if (obj.getScoreCriteria() != null) {
      json.put("scoreCriteria", obj.getScoreCriteria());
    }
    if (obj.getSectionId() != null) {
      json.put("sectionId", obj.getSectionId());
    }
    json.put("seq", obj.getSeq());
    if (obj.getServiceReqs() != null) {
      JsonArray array = new JsonArray();
      obj.getServiceReqs().forEach(item -> array.add(item));
      json.put("serviceReqs", array);
    }
    if (obj.getSportCategory() != null) {
      json.put("sportCategory", obj.getSportCategory());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    if (obj.getSubcourses() != null) {
      JsonArray array = new JsonArray();
      obj.getSubcourses().forEach(item -> array.add(item.toJson()));
      json.put("subcourses", array);
    }
    if (obj.getTasks() != null) {
      JsonArray array = new JsonArray();
      obj.getTasks().forEach(item -> array.add(item));
      json.put("tasks", array);
    }
    if (obj.getTestContents() != null) {
      JsonArray array = new JsonArray();
      obj.getTestContents().forEach(item -> array.add(item.toJson()));
      json.put("testContents", array);
    }
    if (obj.getTextCondition() != null) {
      json.put("textCondition", obj.getTextCondition());
    }
    if (obj.getTextEvaluation() != null) {
      json.put("textEvaluation", obj.getTextEvaluation());
    }
    if (obj.getTextStandard() != null) {
      json.put("textStandard", obj.getTextStandard());
    }
    if (obj.getTrainStepName() != null) {
      json.put("trainStepName", obj.getTrainStepName());
    }
    if (obj.getTrainUnits() != null) {
      JsonArray array = new JsonArray();
      obj.getTrainUnits().forEach(item -> array.add(item));
      json.put("trainUnits", array);
    }
    if (obj.getUnitType() != null) {
      json.put("unitType", obj.getUnitType());
    }
  }
}
