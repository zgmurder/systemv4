package io.vertx.armysystem.business.common.standard;

import io.vertx.armysystem.business.common.standard.rule.PBFStandard;
import io.vertx.core.json.JsonObject;

/**
 * Converter for {@link PBFStandard}.
 * NOTE: This class has been automatically generated from the {@link PBFStandard} original class using Vert.x codegen.
 */
public class PBFStandardConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, PBFStandard obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "ageFrom":
          if (member.getValue() instanceof Number) {
            obj.setAgeFrom(((Number)member.getValue()).intValue());
          }
          break;
        case "ageTo":
          if (member.getValue() instanceof Number) {
            obj.setAgeTo(((Number)member.getValue()).intValue());
          }
          break;
        case "gender":
          if (member.getValue() instanceof String) {
            obj.setGender((String)member.getValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "pbfFrom":
          if (member.getValue() instanceof Number) {
            obj.setPbfFrom(((Number)member.getValue()).doubleValue());
          }
          break;
        case "pbfTo":
          if (member.getValue() instanceof Number) {
            obj.setPbfTo(((Number)member.getValue()).doubleValue());
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

  public static void toJson(PBFStandard obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(PBFStandard obj, java.util.Map<String, Object> json) {
    json.put("ageFrom", obj.getAgeFrom());
    json.put("ageTo", obj.getAgeTo());
    if (obj.getGender() != null) {
      json.put("gender", obj.getGender());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getPbfFrom() != null) {
      json.put("pbfFrom", obj.getPbfFrom());
    }
    if (obj.getPbfTo() != null) {
      json.put("pbfTo", obj.getPbfTo());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
  }
}
