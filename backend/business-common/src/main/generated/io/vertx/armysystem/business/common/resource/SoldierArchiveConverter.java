package io.vertx.armysystem.business.common.resource;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.resource.SoldierArchive}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.resource.SoldierArchive} original class using Vert.x codegen.
 */
public class SoldierArchiveConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, SoldierArchive obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "action":
          if (member.getValue() instanceof String) {
            obj.setAction((String)member.getValue());
          }
          break;
        case "cardId":
          if (member.getValue() instanceof String) {
            obj.setCardId((String)member.getValue());
          }
          break;
        case "createdTime":
          if (member.getValue() instanceof Number) {
            obj.setCreatedTime(((Number)member.getValue()).longValue());
          }
          break;
        case "description":
          if (member.getValue() instanceof String) {
            obj.setDescription((String)member.getValue());
          }
          break;
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
        case "organizationId":
          if (member.getValue() instanceof String) {
            obj.setOrganizationId((String)member.getValue());
          }
          break;
        case "position":
          if (member.getValue() instanceof String) {
            obj.setPosition((String)member.getValue());
          }
          break;
        case "rank":
          if (member.getValue() instanceof String) {
            obj.setRank((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(SoldierArchive obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(SoldierArchive obj, java.util.Map<String, Object> json) {
    if (obj.getAction() != null) {
      json.put("action", obj.getAction());
    }
    if (obj.getCardId() != null) {
      json.put("cardId", obj.getCardId());
    }
    if (obj.getCreatedTime() != null) {
      json.put("createdTime", obj.getCreatedTime());
    }
    if (obj.getDescription() != null) {
      json.put("description", obj.getDescription());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOrganizationId() != null) {
      json.put("organizationId", obj.getOrganizationId());
    }
    if (obj.getPosition() != null) {
      json.put("position", obj.getPosition());
    }
    if (obj.getRank() != null) {
      json.put("rank", obj.getRank());
    }
  }
}
