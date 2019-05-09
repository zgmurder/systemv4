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
 * Converter for {@link io.vertx.armysystem.business.common.standard.TrainStandard}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.TrainStandard} original class using Vert.x codegen.
 */
public class TrainStandardConverter {

  public static void fromJson(JsonObject json, TrainStandard obj) {
    if (json.getValue("endTime") instanceof Number) {
      obj.setEndTime(((Number)json.getValue("endTime")).longValue());
    }
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("name") instanceof String) {
      obj.setName((String)json.getValue("name"));
    }
    if (json.getValue("startTime") instanceof Number) {
      obj.setStartTime(((Number)json.getValue("startTime")).longValue());
    }
    if (json.getValue("state") instanceof Number) {
      obj.setState(((Number)json.getValue("state")).intValue());
    }
  }

  public static void toJson(TrainStandard obj, JsonObject json) {
    if (obj.getEndTime() != null) {
      json.put("endTime", obj.getEndTime());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getStartTime() != null) {
      json.put("startTime", obj.getStartTime());
    }
    json.put("state", obj.getState());
  }
}