package io.vertx.armysystem.microservice.account;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.microservice.account.User}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.account.User} original class using Vert.x codegen.
 */
public class UserConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, User obj) {
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
        case "email":
          if (member.getValue() instanceof String) {
            obj.setEmail((String)member.getValue());
          }
          break;
        case "firstName":
          if (member.getValue() instanceof String) {
            obj.setFirstName((String)member.getValue());
          }
          break;
        case "fullName":
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "lastName":
          if (member.getValue() instanceof String) {
            obj.setLastName((String)member.getValue());
          }
          break;
        case "organizationId":
          if (member.getValue() instanceof String) {
            obj.setOrganizationId((String)member.getValue());
          }
          break;
        case "parentOrgIds":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setParentOrgIds(list);
          }
          break;
        case "password":
          if (member.getValue() instanceof String) {
            obj.setPassword((String)member.getValue());
          }
          break;
        case "phone":
          if (member.getValue() instanceof String) {
            obj.setPhone((String)member.getValue());
          }
          break;
        case "roleLevel":
          if (member.getValue() instanceof Number) {
            obj.setRoleLevel(((Number)member.getValue()).intValue());
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
        case "username":
          if (member.getValue() instanceof String) {
            obj.setUsername((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(User obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(User obj, java.util.Map<String, Object> json) {
    json.put("buildIn", obj.isBuildIn());
    if (obj.getCreatedTime() != null) {
      json.put("createdTime", obj.getCreatedTime());
    }
    if (obj.getDescription() != null) {
      json.put("description", obj.getDescription());
    }
    if (obj.getEmail() != null) {
      json.put("email", obj.getEmail());
    }
    if (obj.getFirstName() != null) {
      json.put("firstName", obj.getFirstName());
    }
    if (obj.getFullName() != null) {
      json.put("fullName", obj.getFullName());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getLastName() != null) {
      json.put("lastName", obj.getLastName());
    }
    if (obj.getOrganizationId() != null) {
      json.put("organizationId", obj.getOrganizationId());
    }
    if (obj.getParentOrgIds() != null) {
      JsonArray array = new JsonArray();
      obj.getParentOrgIds().forEach(item -> array.add(item));
      json.put("parentOrgIds", array);
    }
    if (obj.getPassword() != null) {
      json.put("password", obj.getPassword());
    }
    if (obj.getPhone() != null) {
      json.put("phone", obj.getPhone());
    }
    json.put("roleLevel", obj.getRoleLevel());
    if (obj.getRoleName() != null) {
      json.put("roleName", obj.getRoleName());
    }
    if (obj.getUpdatedTime() != null) {
      json.put("updatedTime", obj.getUpdatedTime());
    }
    if (obj.getUsername() != null) {
      json.put("username", obj.getUsername());
    }
  }
}
