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
 * Converter for {@link io.vertx.armysystem.business.common.dictionary.MilitaryRank}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.dictionary.MilitaryRank} original class using Vert.x codegen.
 */
public class MilitaryRankConverter {

  public static void fromJson(JsonObject json, MilitaryRank obj) {
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("name") instanceof String) {
      obj.setName((String)json.getValue("name"));
    }
    if (json.getValue("order") instanceof Number) {
      obj.setOrder(((Number)json.getValue("order")).intValue());
    }
    if (json.getValue("rankLevel1") instanceof String) {
      obj.setRankLevel1((String)json.getValue("rankLevel1"));
    }
    if (json.getValue("rankLevel2") instanceof String) {
      obj.setRankLevel2((String)json.getValue("rankLevel2"));
    }
  }

  public static void toJson(MilitaryRank obj, JsonObject json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    json.put("order", obj.getOrder());
    if (obj.getRankLevel1() != null) {
      json.put("rankLevel1", obj.getRankLevel1());
    }
    if (obj.getRankLevel2() != null) {
      json.put("rankLevel2", obj.getRankLevel2());
    }
  }
}