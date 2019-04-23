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

package io.vertx.armysystem.business.common.dictionary;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;

/**
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.OrdnanceType}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.OrdnanceType} original class using Vert.x codegen.
 */
public class OrdnanceTypeConverter {

  public static void fromJson(JsonObject json, OrdnanceType obj) {
    if (json.getValue("bulletUnit") instanceof String) {
      obj.setBulletUnit((String)json.getValue("bulletUnit"));
    }
    if (json.getValue("category") instanceof String) {
      obj.setCategory((String)json.getValue("category"));
    }
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("name") instanceof String) {
      obj.setName((String)json.getValue("name"));
    }
    if (json.getValue("order") instanceof Number) {
      obj.setOrder(((Number)json.getValue("order")).intValue());
    }
    if (json.getValue("weaponUnit") instanceof String) {
      obj.setWeaponUnit((String)json.getValue("weaponUnit"));
    }
  }

  public static void toJson(OrdnanceType obj, JsonObject json) {
    if (obj.getBulletUnit() != null) {
      json.put("bulletUnit", obj.getBulletUnit());
    }
    if (obj.getCategory() != null) {
      json.put("category", obj.getCategory());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    json.put("order", obj.getOrder());
    if (obj.getWeaponUnit() != null) {
      json.put("weaponUnit", obj.getWeaponUnit());
    }
  }
}