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
 * Converter for {@link io.vertx.armysystem.business.common.standard.TrainStageTime}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.TrainStageTime} original class using Vert.x codegen.
 */
public class TrainStageTimeConverter {

  public static void fromJson(JsonObject json, TrainStageTime obj) {
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("majors") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("majors").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setMajors(list);
    }
    if (json.getValue("orgCategories") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("orgCategories").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setOrgCategories(list);
    }
    if (json.getValue("stageTimes") instanceof JsonArray) {
      java.util.ArrayList<io.vertx.armysystem.business.common.standard.StageTime> list = new java.util.ArrayList<>();
      json.getJsonArray("stageTimes").forEach( item -> {
        if (item instanceof JsonObject)
          list.add(new io.vertx.armysystem.business.common.standard.StageTime((JsonObject)item));
      });
      obj.setStageTimes(list);
    }
    if (json.getValue("standardName") instanceof String) {
      obj.setStandardName((String)json.getValue("standardName"));
    }
  }

  public static void toJson(TrainStageTime obj, JsonObject json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getMajors() != null) {
      JsonArray array = new JsonArray();
      obj.getMajors().forEach(item -> array.add(item));
      json.put("majors", array);
    }
    if (obj.getOrgCategories() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgCategories().forEach(item -> array.add(item));
      json.put("orgCategories", array);
    }
    if (obj.getStageTimes() != null) {
      JsonArray array = new JsonArray();
      obj.getStageTimes().forEach(item -> array.add(item.toJson()));
      json.put("stageTimes", array);
    }
    if (obj.getStandardName() != null) {
      json.put("standardName", obj.getStandardName());
    }
  }
}