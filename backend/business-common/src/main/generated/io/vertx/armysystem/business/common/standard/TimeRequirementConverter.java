package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.TimeRequirement}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.TimeRequirement} original class using Vert.x codegen.
 */
public class TimeRequirementConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, TimeRequirement obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "days":
          if (member.getValue() instanceof Number) {
            obj.setDays(((Number)member.getValue()).doubleValue());
          }
          break;
        case "daysPerMonth":
          if (member.getValue() instanceof Number) {
            obj.setDaysPerMonth(((Number)member.getValue()).doubleValue());
          }
          break;
        case "daysPerWeek":
          if (member.getValue() instanceof Number) {
            obj.setDaysPerWeek(((Number)member.getValue()).doubleValue());
          }
          break;
        case "flexibleDays":
          if (member.getValue() instanceof Number) {
            obj.setFlexibleDays(((Number)member.getValue()).doubleValue());
          }
          break;
        case "hours":
          if (member.getValue() instanceof Number) {
            obj.setHours(((Number)member.getValue()).doubleValue());
          }
          break;
        case "hoursAtNight":
          if (member.getValue() instanceof Number) {
            obj.setHoursAtNight(((Number)member.getValue()).doubleValue());
          }
          break;
        case "hoursPerDay":
          if (member.getValue() instanceof Number) {
            obj.setHoursPerDay(((Number)member.getValue()).doubleValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "months":
          if (member.getValue() instanceof Number) {
            obj.setMonths(((Number)member.getValue()).doubleValue());
          }
          break;
        case "orgCategory":
          if (member.getValue() instanceof String) {
            obj.setOrgCategory((String)member.getValue());
          }
          break;
        case "personProperty":
          if (member.getValue() instanceof String) {
            obj.setPersonProperty((String)member.getValue());
          }
          break;
        case "rateAtNight":
          if (member.getValue() instanceof Number) {
            obj.setRateAtNight(((Number)member.getValue()).doubleValue());
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

  public static void toJson(TimeRequirement obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(TimeRequirement obj, java.util.Map<String, Object> json) {
    if (obj.getDays() != null) {
      json.put("days", obj.getDays());
    }
    if (obj.getDaysPerMonth() != null) {
      json.put("daysPerMonth", obj.getDaysPerMonth());
    }
    if (obj.getDaysPerWeek() != null) {
      json.put("daysPerWeek", obj.getDaysPerWeek());
    }
    if (obj.getFlexibleDays() != null) {
      json.put("flexibleDays", obj.getFlexibleDays());
    }
    if (obj.getHours() != null) {
      json.put("hours", obj.getHours());
    }
    if (obj.getHoursAtNight() != null) {
      json.put("hoursAtNight", obj.getHoursAtNight());
    }
    if (obj.getHoursPerDay() != null) {
      json.put("hoursPerDay", obj.getHoursPerDay());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getMonths() != null) {
      json.put("months", obj.getMonths());
    }
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    if (obj.getPersonProperty() != null) {
      json.put("personProperty", obj.getPersonProperty());
    }
    if (obj.getRateAtNight() != null) {
      json.put("rateAtNight", obj.getRateAtNight());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
  }
}
