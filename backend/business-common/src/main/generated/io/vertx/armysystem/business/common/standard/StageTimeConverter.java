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
 * Converter for {@link io.vertx.armysystem.business.common.standard.StageTime}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.StageTime} original class using Vert.x codegen.
 */
public class StageTimeConverter {

  public static void fromJson(JsonObject json, StageTime obj) {
    if (json.getValue("months") instanceof Number) {
      obj.setMonths(((Number)json.getValue("months")).doubleValue());
    }
    if (json.getValue("task") instanceof String) {
      obj.setTask((String)json.getValue("task"));
    }
  }

  public static void toJson(StageTime obj, JsonObject json) {
    if (obj.getMonths() != null) {
      json.put("months", obj.getMonths());
    }
    if (obj.getTask() != null) {
      json.put("task", obj.getTask());
    }
  }
}