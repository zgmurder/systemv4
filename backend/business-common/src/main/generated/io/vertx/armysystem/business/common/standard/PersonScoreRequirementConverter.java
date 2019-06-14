package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.PersonScoreRequirement}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.PersonScoreRequirement} original class using Vert.x codegen.
 */
public class PersonScoreRequirementConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, PersonScoreRequirement obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "endYear":
          if (member.getValue() instanceof Number) {
            obj.setEndYear(((Number)member.getValue()).intValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "personProperty":
          if (member.getValue() instanceof String) {
            obj.setPersonProperty((String)member.getValue());
          }
          break;
        case "ranks":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setRanks(list);
          }
          break;
        case "scoreReq":
          if (member.getValue() instanceof Number) {
            obj.setScoreReq(((Number)member.getValue()).intValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "startYear":
          if (member.getValue() instanceof Number) {
            obj.setStartYear(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(PersonScoreRequirement obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(PersonScoreRequirement obj, java.util.Map<String, Object> json) {
    json.put("endYear", obj.getEndYear());
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getPersonProperty() != null) {
      json.put("personProperty", obj.getPersonProperty());
    }
    if (obj.getRanks() != null) {
      JsonArray array = new JsonArray();
      obj.getRanks().forEach(item -> array.add(item));
      json.put("ranks", array);
    }
    json.put("scoreReq", obj.getScoreReq());
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    json.put("startYear", obj.getStartYear());
  }
}
