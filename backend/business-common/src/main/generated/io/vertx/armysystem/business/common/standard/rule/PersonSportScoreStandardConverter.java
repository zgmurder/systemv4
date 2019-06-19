package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.PersonSportScoreStandard}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.PersonSportScoreStandard} original class using Vert.x codegen.
 */
public class PersonSportScoreStandardConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, PersonSportScoreStandard obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "evaluatedScore":
          if (member.getValue() instanceof Number) {
            obj.setEvaluatedScore(((Number)member.getValue()).intValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "physicalLevel":
          if (member.getValue() instanceof String) {
            obj.setPhysicalLevel((String)member.getValue());
          }
          break;
        case "scoreCondtion":
          if (member.getValue() instanceof Number) {
            obj.setScoreCondtion(((Number)member.getValue()).intValue());
          }
          break;
        case "scoreCriteria":
          if (member.getValue() instanceof String) {
            obj.setScoreCriteria((String)member.getValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "totalEnabled":
          if (member.getValue() instanceof Boolean) {
            obj.setTotalEnabled((Boolean)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(PersonSportScoreStandard obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(PersonSportScoreStandard obj, java.util.Map<String, Object> json) {
    json.put("evaluatedScore", obj.getEvaluatedScore());
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getPhysicalLevel() != null) {
      json.put("physicalLevel", obj.getPhysicalLevel());
    }
    json.put("scoreCondtion", obj.getScoreCondtion());
    if (obj.getScoreCriteria() != null) {
      json.put("scoreCriteria", obj.getScoreCriteria());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    if (obj.getTotalEnabled() != null) {
      json.put("totalEnabled", obj.getTotalEnabled());
    }
  }
}
