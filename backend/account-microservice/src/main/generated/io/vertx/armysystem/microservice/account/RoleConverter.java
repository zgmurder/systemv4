package io.vertx.armysystem.microservice.account;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.microservice.account.Role}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.account.Role} original class using Vert.x codegen.
 */
public class RoleConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Role obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "buildIn":
          if (member.getValue() instanceof Boolean) {
            obj.setBuildIn((Boolean)member.getValue());
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
        case "displayName":
          if (member.getValue() instanceof String) {
            obj.setDisplayName((String)member.getValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "level":
          if (member.getValue() instanceof Number) {
            obj.setLevel(((Number)member.getValue()).intValue());
          }
          break;
        case "permissions":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.microservice.account.Permission> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.microservice.account.Permission((JsonObject)item));
            });
            obj.setPermissions(list);
          }
          break;
        case "roleName":
          if (member.getValue() instanceof String) {
            obj.setRoleName((String)member.getValue());
          }
          break;
        case "updatedTime":
          if (member.getValue() instanceof Number) {
            obj.setUpdatedTime(((Number)member.getValue()).longValue());
          }
          break;
      }
    }
  }

  public static void toJson(Role obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Role obj, java.util.Map<String, Object> json) {
    json.put("buildIn", obj.isBuildIn());
    if (obj.getCreatedTime() != null) {
      json.put("createdTime", obj.getCreatedTime());
    }
    if (obj.getDescription() != null) {
      json.put("description", obj.getDescription());
    }
    if (obj.getDisplayName() != null) {
      json.put("displayName", obj.getDisplayName());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    json.put("level", obj.getLevel());
    if (obj.getPermissions() != null) {
      JsonArray array = new JsonArray();
      obj.getPermissions().forEach(item -> array.add(item.toJson()));
      json.put("permissions", array);
    }
    if (obj.getRoleName() != null) {
      json.put("roleName", obj.getRoleName());
    }
    if (obj.getUpdatedTime() != null) {
      json.put("updatedTime", obj.getUpdatedTime());
    }
  }
}
