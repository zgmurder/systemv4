package io.vertx.armysystem.business.common.dictionary;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.Position}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.Position} original class using Vert.x codegen.
 */
public class PositionConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Position obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "commander":
          if (member.getValue() instanceof Boolean) {
            obj.setCommander((Boolean)member.getValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "master":
          if (member.getValue() instanceof Boolean) {
            obj.setMaster((Boolean)member.getValue());
          }
          break;
        case "name":
          if (member.getValue() instanceof String) {
            obj.setName((String)member.getValue());
          }
          break;
        case "order":
          if (member.getValue() instanceof Number) {
            obj.setOrder(((Number)member.getValue()).intValue());
          }
          break;
        case "orgCategory":
          if (member.getValue() instanceof String) {
            obj.setOrgCategory((String)member.getValue());
          }
          break;
        case "orgSequence":
          if (member.getValue() instanceof Number) {
            obj.setOrgSequence(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(Position obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Position obj, java.util.Map<String, Object> json) {
    json.put("commander", obj.isCommander());
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    json.put("master", obj.isMaster());
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    json.put("order", obj.getOrder());
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    json.put("orgSequence", obj.getOrgSequence());
  }
}
