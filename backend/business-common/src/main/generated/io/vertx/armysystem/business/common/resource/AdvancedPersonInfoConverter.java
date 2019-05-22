package io.vertx.armysystem.business.common.resource;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.resource.AdvancedPersonInfo}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.resource.AdvancedPersonInfo} original class using Vert.x codegen.
 */
public class AdvancedPersonInfoConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, AdvancedPersonInfo obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "bloodType":
          if (member.getValue() instanceof String) {
            obj.setBloodType((String)member.getValue());
          }
          break;
        case "currentCity":
          if (member.getValue() instanceof String) {
            obj.setCurrentCity((String)member.getValue());
          }
          break;
        case "fromCity":
          if (member.getValue() instanceof String) {
            obj.setFromCity((String)member.getValue());
          }
          break;
        case "graduatedAt":
          if (member.getValue() instanceof String) {
            obj.setGraduatedAt((String)member.getValue());
          }
          break;
        case "graduatedMajor":
          if (member.getValue() instanceof String) {
            obj.setGraduatedMajor((String)member.getValue());
          }
          break;
        case "graduatedSchool":
          if (member.getValue() instanceof String) {
            obj.setGraduatedSchool((String)member.getValue());
          }
          break;
        case "highestDegree":
          if (member.getValue() instanceof String) {
            obj.setHighestDegree((String)member.getValue());
          }
          break;
        case "nationality":
          if (member.getValue() instanceof String) {
            obj.setNationality((String)member.getValue());
          }
          break;
        case "phoneNum":
          if (member.getValue() instanceof String) {
            obj.setPhoneNum((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(AdvancedPersonInfo obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(AdvancedPersonInfo obj, java.util.Map<String, Object> json) {
    if (obj.getBloodType() != null) {
      json.put("bloodType", obj.getBloodType());
    }
    if (obj.getCurrentCity() != null) {
      json.put("currentCity", obj.getCurrentCity());
    }
    if (obj.getFromCity() != null) {
      json.put("fromCity", obj.getFromCity());
    }
    if (obj.getGraduatedAt() != null) {
      json.put("graduatedAt", obj.getGraduatedAt());
    }
    if (obj.getGraduatedMajor() != null) {
      json.put("graduatedMajor", obj.getGraduatedMajor());
    }
    if (obj.getGraduatedSchool() != null) {
      json.put("graduatedSchool", obj.getGraduatedSchool());
    }
    if (obj.getHighestDegree() != null) {
      json.put("highestDegree", obj.getHighestDegree());
    }
    if (obj.getNationality() != null) {
      json.put("nationality", obj.getNationality());
    }
    if (obj.getPhoneNum() != null) {
      json.put("phoneNum", obj.getPhoneNum());
    }
  }
}
