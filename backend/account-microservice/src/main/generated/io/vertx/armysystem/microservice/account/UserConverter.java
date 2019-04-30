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
 * Converter for {@link io.vertx.armysystem.microservice.account.User}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.account.User} original class using Vert.x codegen.
 */
public class UserConverter {

  public static void fromJson(JsonObject json, User obj) {
    if (json.getValue("buildIn") instanceof Boolean) {
      obj.setBuildIn((Boolean)json.getValue("buildIn"));
    }
    if (json.getValue("createdTime") instanceof Number) {
      obj.setCreatedTime(((Number)json.getValue("createdTime")).longValue());
    }
    if (json.getValue("description") instanceof String) {
      obj.setDescription((String)json.getValue("description"));
    }
    if (json.getValue("email") instanceof String) {
      obj.setEmail((String)json.getValue("email"));
    }
    if (json.getValue("firstName") instanceof String) {
      obj.setFirstName((String)json.getValue("firstName"));
    }
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("lastName") instanceof String) {
      obj.setLastName((String)json.getValue("lastName"));
    }
    if (json.getValue("organizationId") instanceof String) {
      obj.setOrganizationId((String)json.getValue("organizationId"));
    }
    if (json.getValue("parentOrgIds") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("parentOrgIds").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setParentOrgIds(list);
    }
    if (json.getValue("password") instanceof String) {
      obj.setPassword((String)json.getValue("password"));
    }
    if (json.getValue("phone") instanceof String) {
      obj.setPhone((String)json.getValue("phone"));
    }
    if (json.getValue("roleLevel") instanceof Number) {
      obj.setRoleLevel(((Number)json.getValue("roleLevel")).intValue());
    }
    if (json.getValue("roleName") instanceof String) {
      obj.setRoleName((String)json.getValue("roleName"));
    }
    if (json.getValue("updatedTime") instanceof Number) {
      obj.setUpdatedTime(((Number)json.getValue("updatedTime")).longValue());
    }
    if (json.getValue("username") instanceof String) {
      obj.setUsername((String)json.getValue("username"));
    }
  }

  public static void toJson(User obj, JsonObject json) {
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