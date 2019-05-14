package io.vertx.armysystem.business.common.dictionary;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.MilitaryRank}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.MilitaryRank} original class using Vert.x codegen.
 */
public class MilitaryRankConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, MilitaryRank obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
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
        case "rankLevel1":
          if (member.getValue() instanceof String) {
            obj.setRankLevel1((String)member.getValue());
          }
          break;
        case "rankLevel2":
          if (member.getValue() instanceof String) {
            obj.setRankLevel2((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(MilitaryRank obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(MilitaryRank obj, java.util.Map<String, Object> json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    json.put("order", obj.getOrder());
    if (obj.getRankLevel1() != null) {
      json.put("rankLevel1", obj.getRankLevel1());
    }
    if (obj.getRankLevel2() != null) {
      json.put("rankLevel2", obj.getRankLevel2());
    }
  }
}
