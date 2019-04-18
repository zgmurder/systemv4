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
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.TrainStep}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.TrainStep} original class using Vert.x codegen.
 */
public class TrainStepConverter {

  public static void fromJson(JsonObject json, TrainStep obj) {
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("name") instanceof String) {
      obj.setName((String)json.getValue("name"));
    }
    if (json.getValue("order") instanceof Number) {
      obj.setOrder(((Number)json.getValue("order")).intValue());
    }
    if (json.getValue("orgType") instanceof String) {
      obj.setOrgType((String)json.getValue("orgType"));
    }
    if (json.getValue("priority") instanceof Number) {
      obj.setPriority(((Number)json.getValue("priority")).intValue());
    }
    if (json.getValue("trainUnits") instanceof JsonArray) {
      java.util.ArrayList<java.lang.Integer> list = new java.util.ArrayList<>();
      json.getJsonArray("trainUnits").forEach( item -> {
        if (item instanceof Number)
          list.add(((Number)item).intValue());
      });
      obj.setTrainUnits(list);
    }
  }

  public static void toJson(TrainStep obj, JsonObject json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    json.put("order", obj.getOrder());
    if (obj.getOrgType() != null) {
      json.put("orgType", obj.getOrgType());
    }
    json.put("priority", obj.getPriority());
    if (obj.getTrainUnits() != null) {
      JsonArray array = new JsonArray();
      obj.getTrainUnits().forEach(item -> array.add(item));
      json.put("trainUnits", array);
    }
  }
}