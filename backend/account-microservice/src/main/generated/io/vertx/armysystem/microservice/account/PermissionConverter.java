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
 * Converter for {@link io.vertx.armysystem.microservice.account.Permission}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.microservice.account.Permission} original class using Vert.x codegen.
 */
public class PermissionConverter {

  public static void fromJson(JsonObject json, Permission obj) {
    if (json.getValue("actions") instanceof JsonArray) {
      java.util.ArrayList<io.vertx.armysystem.business.common.Action> list = new java.util.ArrayList<>();
      json.getJsonArray("actions").forEach( item -> {
        if (item instanceof String)
          list.add(io.vertx.armysystem.business.common.Action.valueOf((String)item));
      });
      obj.setActions(list);
    }
    if (json.getValue("schemaName") instanceof String) {
      obj.setSchemaName((String)json.getValue("schemaName"));
    }
  }

  public static void toJson(Permission obj, JsonObject json) {
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