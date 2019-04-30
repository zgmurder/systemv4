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
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.TrainTask}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.TrainTask} original class using Vert.x codegen.
 */
public class TrainTaskConverter {

  public static void fromJson(JsonObject json, TrainTask obj) {
    if (json.getValue("name") instanceof String) {
      obj.setName((String)json.getValue("name"));
    }
    if (json.getValue("optionalSubjects") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("optionalSubjects").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setOptionalSubjects(list);
    }
  }

  public static void toJson(TrainTask obj, JsonObject json) {
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOptionalSubjects() != null) {
      JsonArray array = new JsonArray();
      obj.getOptionalSubjects().forEach(item -> array.add(item));
      json.put("optionalSubjects", array);
    }
  }
}