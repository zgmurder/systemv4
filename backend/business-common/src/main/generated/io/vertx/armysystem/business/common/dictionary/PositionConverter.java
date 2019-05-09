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
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.Position}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.Position} original class using Vert.x codegen.
 */
public class PositionConverter {

  public static void fromJson(JsonObject json, Position obj) {
    if (json.getValue("commander") instanceof Boolean) {
      obj.setCommander((Boolean)json.getValue("commander"));
    }
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("master") instanceof Boolean) {
      obj.setMaster((Boolean)json.getValue("master"));
    }
    if (json.getValue("name") instanceof String) {
      obj.setName((String)json.getValue("name"));
    }
    if (json.getValue("order") instanceof Number) {
      obj.setOrder(((Number)json.getValue("order")).intValue());
    }
    if (json.getValue("orgCategory") instanceof String) {
      obj.setOrgCategory((String)json.getValue("orgCategory"));
    }
    if (json.getValue("orgSequence") instanceof Number) {
      obj.setOrgSequence(((Number)json.getValue("orgSequence")).intValue());
    }
  }

  public static void toJson(Position obj, JsonObject json) {
    json.put("commander", obj.isCommander());
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    json.put("master", obj.isMaster());
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    json.put("order", obj.getOrder());
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    json.put("orgSequence", obj.getOrgSequence());
  }
}