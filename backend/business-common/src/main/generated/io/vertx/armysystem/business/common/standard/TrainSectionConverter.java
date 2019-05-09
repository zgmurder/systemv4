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

package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.TrainSection}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.TrainSection} original class using Vert.x codegen.
 */
public class TrainSectionConverter {

  public static void fromJson(JsonObject json, TrainSection obj) {
    if (json.getValue("code") instanceof String) {
      obj.setCode((String)json.getValue("code"));
    }
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("name") instanceof String) {
      obj.setName((String)json.getValue("name"));
    }
    if (json.getValue("orgCategories") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("orgCategories").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setOrgCategories(list);
    }
    if (json.getValue("orgTypes") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("orgTypes").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setOrgTypes(list);
    }
    if (json.getValue("personProperties") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("personProperties").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setPersonProperties(list);
    }
    if (json.getValue("standardName") instanceof String) {
      obj.setStandardName((String)json.getValue("standardName"));
    }
  }

  public static void toJson(TrainSection obj, JsonObject json) {
    if (obj.getCode() != null) {
      json.put("code", obj.getCode());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOrgCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgCategories().forEach(item -> array.add(item));
      json.put("orgCategories", array);
    }
    if (obj.getOrgTypes() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgTypes().forEach(item -> array.add(item));
      json.put("orgTypes", array);
    }
    if (obj.getPersonProperties() != null) {
      JsonArray array = new JsonArray();
      obj.getPersonProperties().forEach(item -> array.add(item));
      json.put("personProperties", array);
    }
    if (obj.getStandardName() != null) {
      json.put("standardName", obj.getStandardName());
    }
  }
}