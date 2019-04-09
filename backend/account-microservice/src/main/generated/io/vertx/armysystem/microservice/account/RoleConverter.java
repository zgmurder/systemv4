/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

package io.vertx.armysystem.microservice.account;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;

/**
 * Converter for {@link io.vertx.armysystem.microservice.account.Role}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.account.Role} original class using Vert.x codegen.
 */
public class RoleConverter {

  public static void fromJson(JsonObject json, Role obj) {
    if (json.getValue("buildIn") instanceof Boolean) {
      obj.setBuildIn((Boolean)json.getValue("buildIn"));
    }
    if (json.getValue("createdTime") instanceof Number) {
      obj.setCreatedTime(((Number)json.getValue("createdTime")).longValue());
    }
    if (json.getValue("description") instanceof String) {
      obj.setDescription((String)json.getValue("description"));
    }
    if (json.getValue("displayName") instanceof String) {
      obj.setDisplayName((String)json.getValue("displayName"));
    }
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("permissions") instanceof JsonArray) {
      java.util.ArrayList<io.vertx.armysystem.microservice.account.Permission> list = new java.util.ArrayList<>();
      json.getJsonArray("permissions").forEach( item -> {
        if (item instanceof JsonObject)
          list.add(new io.vertx.armysystem.microservice.account.Permission((JsonObject)item));
      });
      obj.setPermissions(list);
    }
    if (json.getValue("roleName") instanceof String) {
      obj.setRoleName((String)json.getValue("roleName"));
    }
    if (json.getValue("updatedTime") instanceof Number) {
      obj.setUpdatedTime(((Number)json.getValue("updatedTime")).longValue());
    }
  }

  public static void toJson(Role obj, JsonObject json) {
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