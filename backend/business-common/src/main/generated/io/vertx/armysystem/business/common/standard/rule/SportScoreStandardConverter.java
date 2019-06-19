package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.SportScoreStandard}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.SportScoreStandard} original class using Vert.x codegen.
 */
public class SportScoreStandardConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, SportScoreStandard obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
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
        case "gender":
          if (member.getValue() instanceof String) {
            obj.setGender((String)member.getValue());
          }
          break;
        case "groups":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.standard.rule.sss.ScorePair> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.business.common.standard.rule.sss.ScorePair((JsonObject)item));
            });
            obj.setGroups(list);
          }
          break;
        case "heightFactorCountStep":
          if (member.getValue() instanceof Number) {
            obj.setHeightFactorCountStep(((Number)member.getValue()).doubleValue());
          }
          break;
        case "heightFactorStep":
          if (member.getValue() instanceof Number) {
            obj.setHeightFactorStep(((Number)member.getValue()).doubleValue());
          }
          break;
        case "heightFrom":
          if (member.getValue() instanceof Number) {
            obj.setHeightFrom(((Number)member.getValue()).intValue());
          }
          break;
        case "heightTo":
          if (member.getValue() instanceof Number) {
            obj.setHeightTo(((Number)member.getValue()).intValue());
          }
          break;
        case "highScoreCountStep":
          if (member.getValue() instanceof Number) {
            obj.setHighScoreCountStep(((Number)member.getValue()).doubleValue());
          }
          break;
        case "highScoreScoreStep":
          if (member.getValue() instanceof Number) {
            obj.setHighScoreScoreStep(((Number)member.getValue()).doubleValue());
          }
          break;
        case "highland":
          if (member.getValue() instanceof Boolean) {
            obj.setHighland((Boolean)member.getValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "individualEnabled":
          if (member.getValue() instanceof Boolean) {
            obj.setIndividualEnabled((Boolean)member.getValue());
          }
          break;
        case "individuals":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.standard.rule.sss.Condition> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.business.common.standard.rule.sss.Condition((JsonObject)item));
            });
            obj.setIndividuals(list);
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

  public static void toJson(SportScoreStandard obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(SportScoreStandard obj, java.util.Map<String, Object> json) {
    if (obj.getCivilServant() != null) {
      json.put("civilServant", obj.getCivilServant());
    }
    if (obj.getCourseId() != null) {
      json.put("courseId", obj.getCourseId());
    }
    if (obj.getGender() != null) {
      json.put("gender", obj.getGender());
    }
    if (obj.getGroups() != null) {
      JsonArray array = new JsonArray();
      obj.getGroups().forEach(item -> array.add(item.toJson()));
      json.put("groups", array);
    }
    if (obj.getHeightFactorCountStep() != null) {
      json.put("heightFactorCountStep", obj.getHeightFactorCountStep());
    }
    if (obj.getHeightFactorStep() != null) {
      json.put("heightFactorStep", obj.getHeightFactorStep());
    }
    json.put("heightFrom", obj.getHeightFrom());
    json.put("heightTo", obj.getHeightTo());
    if (obj.getHighScoreCountStep() != null) {
      json.put("highScoreCountStep", obj.getHighScoreCountStep());
    }
    if (obj.getHighScoreScoreStep() != null) {
      json.put("highScoreScoreStep", obj.getHighScoreScoreStep());
    }
    if (obj.getHighland() != null) {
      json.put("highland", obj.getHighland());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getIndividualEnabled() != null) {
      json.put("individualEnabled", obj.getIndividualEnabled());
    }
    if (obj.getIndividuals() != null) {
      JsonArray array = new JsonArray();
      obj.getIndividuals().forEach(item -> array.add(item.toJson()));
      json.put("individuals", array);
    }
    if (obj.getPhysicalLevels() != null) {
      JsonArray array = new JsonArray();
      obj.getPhysicalLevels().forEach(item -> array.add(item));
      json.put("physicalLevels", array);
    }
    if (obj.getScoreCriteria() != null) {
      json.put("scoreCriteria", obj.getScoreCriteria());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    if (obj.getTroopCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getTroopCategories().forEach(item -> array.add(item));
      json.put("troopCategories", array);
    }
  }
}
