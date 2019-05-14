package io.vertx.armysystem.microservice.account;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.microservice.account.Permission}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.account.Permission} original class using Vert.x codegen.
 */
public class PermissionConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Permission obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "actions":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.Action> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add(io.vertx.armysystem.business.common.Action.valueOf((String)item));
            });
            obj.setActions(list);
          }
          break;
        case "schemaName":
          if (member.getValue() instanceof String) {
            obj.setSchemaName((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(Permission obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Permission obj, java.util.Map<String, Object> json) {
    if (obj.getActions() != null) {
      JsonArray array = new JsonArray();
      obj.getActions().forEach(item -> array.add(item.name()));
      json.put("actions", array);
    }
    if (obj.getSchemaName() != null) {
      json.put("schemaName", obj.getSchemaName());
    }
  }
}
