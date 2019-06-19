package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.rule.ChildRule}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.rule.ChildRule} original class using Vert.x codegen.
 */
public class ChildRuleConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, ChildRule obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "dayType":
          if (member.getValue() instanceof String) {
            obj.setDayType((String)member.getValue());
          }
          break;
        case "fromHour":
          if (member.getValue() instanceof Number) {
            obj.setFromHour(((Number)member.getValue()).intValue());
          }
          break;
        case "holidays":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.Integer> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof Number)
                list.add(((Number)item).intValue());
            });
            obj.setHolidays(list);
          }
          break;
        case "hours":
          if (member.getValue() instanceof Number) {
            obj.setHours(((Number)member.getValue()).intValue());
          }
          break;
        case "months":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.Integer> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof Number)
                list.add(((Number)item).intValue());
            });
            obj.setMonths(list);
          }
          break;
        case "priority":
          if (member.getValue() instanceof Number) {
            obj.setPriority(((Number)member.getValue()).intValue());
          }
          break;
        case "section":
          if (member.getValue() instanceof String) {
            obj.setSection((String)member.getValue());
          }
          break;
        case "weekSeqs":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.Integer> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof Number)
                list.add(((Number)item).intValue());
            });
            obj.setWeekSeqs(list);
          }
          break;
        case "weekdays":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.Integer> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof Number)
                list.add(((Number)item).intValue());
            });
            obj.setWeekdays(list);
          }
          break;
      }
    }
  }

  public static void toJson(ChildRule obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(ChildRule obj, java.util.Map<String, Object> json) {
    if (obj.getDayType() != null) {
      json.put("dayType", obj.getDayType());
    }
    json.put("fromHour", obj.getFromHour());
    if (obj.getHolidays() != null) {
      JsonArray array = new JsonArray();
      obj.getHolidays().forEach(item -> array.add(item));
      json.put("holidays", array);
    }
    json.put("hours", obj.getHours());
    if (obj.getMonths() != null) {
      JsonArray array = new JsonArray();
      obj.getMonths().forEach(item -> array.add(item));
      json.put("months", array);
    }
    json.put("priority", obj.getPriority());
    if (obj.getSection() != null) {
      json.put("section", obj.getSection());
    }
    if (obj.getWeekSeqs() != null) {
      JsonArray array = new JsonArray();
      obj.getWeekSeqs().forEach(item -> array.add(item));
      json.put("weekSeqs", array);
    }
    if (obj.getWeekdays() != null) {
      JsonArray array = new JsonArray();
      obj.getWeekdays().forEach(item -> array.add(item));
      json.put("weekdays", array);
    }
  }
}
