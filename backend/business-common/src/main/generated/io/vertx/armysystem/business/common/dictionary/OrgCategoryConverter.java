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
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.OrgCategory}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.OrgCategory} original class using Vert.x codegen.
 */
public class OrgCategoryConverter {

  public static void fromJson(JsonObject json, OrgCategory obj) {
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("name") instanceof String) {
      obj.setName((String)json.getValue("name"));
    }
    if (json.getValue("optionalMajors") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("optionalMajors").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setOptionalMajors(list);
    }
    if (json.getValue("optionalServices") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("optionalServices").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setOptionalServices(list);
    }
    if (json.getValue("optionalTasks") instanceof JsonArray) {
      java.util.ArrayList<io.vertx.armysystem.business.common.dictionary.TrainTask> list = new java.util.ArrayList<>();
      json.getJsonArray("optionalTasks").forEach( item -> {
        if (item instanceof JsonObject)
          list.add(new io.vertx.armysystem.business.common.dictionary.TrainTask((JsonObject)item));
      });
      obj.setOptionalTasks(list);
    }
    if (json.getValue("order") instanceof Number) {
      obj.setOrder(((Number)json.getValue("order")).intValue());
    }
    if (json.getValue("orgProperty") instanceof String) {
      obj.setOrgProperty((String)json.getValue("orgProperty"));
    }
    if (json.getValue("orgType") instanceof String) {
      obj.setOrgType((String)json.getValue("orgType"));
    }
    if (json.getValue("physicalLevel") instanceof String) {
      obj.setPhysicalLevel((String)json.getValue("physicalLevel"));
    }
    if (json.getValue("troopCategory") instanceof String) {
      obj.setTroopCategory((String)json.getValue("troopCategory"));
    }
  }

  public static void toJson(OrgCategory obj, JsonObject json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOptionalMajors() != null) {
      JsonArray array = new JsonArray();
      obj.getOptionalMajors().forEach(item -> array.add(item));
      json.put("optionalMajors", array);
    }
    if (obj.getOptionalServices() != null) {
      JsonArray array = new JsonArray();
      obj.getOptionalServices().forEach(item -> array.add(item));
      json.put("optionalServices", array);
    }
    if (obj.getOptionalTasks() != null) {
      JsonArray array = new JsonArray();
      obj.getOptionalTasks().forEach(item -> array.add(item.toJson()));
      json.put("optionalTasks", array);
    }
    json.put("order", obj.getOrder());
    if (obj.getOrgProperty() != null) {
      json.put("orgProperty", obj.getOrgProperty());
    }
    if (obj.getOrgType() != null) {
      json.put("orgType", obj.getOrgType());
    }
    if (obj.getPhysicalLevel() != null) {
      json.put("physicalLevel", obj.getPhysicalLevel());
    }
    if (obj.getTroopCategory() != null) {
      json.put("troopCategory", obj.getTroopCategory());
    }
  }
}