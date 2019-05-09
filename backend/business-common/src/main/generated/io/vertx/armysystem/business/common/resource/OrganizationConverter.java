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

package io.vertx.armysystem.business.common.resource;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;

/**
 * Converter for {@link io.vertx.armysystem.business.common.resource.Organization}.
 *
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.resource.Organization} original class using Vert.x codegen.
 */
public class OrganizationConverter {

  public static void fromJson(JsonObject json, Organization obj) {
    if (json.getValue("address") instanceof String) {
      obj.setAddress((String)json.getValue("address"));
    }
    if (json.getValue("altitude") instanceof Number) {
      obj.setAltitude(((Number)json.getValue("altitude")).doubleValue());
    }
    if (json.getValue("childrenIds") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("childrenIds").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setChildrenIds(list);
    }
    if (json.getValue("deleted") instanceof Boolean) {
      obj.setDeleted((Boolean)json.getValue("deleted"));
    }
    if (json.getValue("displayName") instanceof String) {
      obj.setDisplayName((String)json.getValue("displayName"));
    }
    if (json.getValue("expireDate") instanceof Number) {
      obj.setExpireDate(((Number)json.getValue("expireDate")).longValue());
    }
    if (json.getValue("id") instanceof String) {
      obj.setId((String)json.getValue("id"));
    }
    if (json.getValue("important") instanceof Boolean) {
      obj.setImportant((Boolean)json.getValue("important"));
    }
    if (json.getValue("latitude") instanceof Number) {
      obj.setLatitude(((Number)json.getValue("latitude")).doubleValue());
    }
    if (json.getValue("longitude") instanceof Number) {
      obj.setLongitude(((Number)json.getValue("longitude")).doubleValue());
    }
    if (json.getValue("name") instanceof String) {
      obj.setName((String)json.getValue("name"));
    }
    if (json.getValue("orgCategory") instanceof String) {
      obj.setOrgCategory((String)json.getValue("orgCategory"));
    }
    if (json.getValue("orgCode") instanceof String) {
      obj.setOrgCode((String)json.getValue("orgCode"));
    }
    if (json.getValue("orgMajors") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("orgMajors").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setOrgMajors(list);
    }
    if (json.getValue("orgProperty") instanceof String) {
      obj.setOrgProperty((String)json.getValue("orgProperty"));
    }
    if (json.getValue("orgSequence") instanceof Number) {
      obj.setOrgSequence(((Number)json.getValue("orgSequence")).intValue());
    }
    if (json.getValue("orgType") instanceof String) {
      obj.setOrgType((String)json.getValue("orgType"));
    }
    if (json.getValue("parentId") instanceof String) {
      obj.setParentId((String)json.getValue("parentId"));
    }
    if (json.getValue("parentIds") instanceof JsonArray) {
      java.util.ArrayList<java.lang.String> list = new java.util.ArrayList<>();
      json.getJsonArray("parentIds").forEach( item -> {
        if (item instanceof String)
          list.add((String)item);
      });
      obj.setParentIds(list);
    }
    if (json.getValue("planSodierCount") instanceof Number) {
      obj.setPlanSodierCount(((Number)json.getValue("planSodierCount")).intValue());
    }
    if (json.getValue("serviceType") instanceof String) {
      obj.setServiceType((String)json.getValue("serviceType"));
    }
    if (json.getValue("specialMission") instanceof String) {
      obj.setSpecialMission((String)json.getValue("specialMission"));
    }
    if (json.getValue("temp") instanceof Boolean) {
      obj.setTemp((Boolean)json.getValue("temp"));
    }
  }

  public static void toJson(Organization obj, JsonObject json) {
    if (obj.getAddress() != null) {
      json.put("address", obj.getAddress());
    }
    if (obj.getAltitude() != null) {
      json.put("altitude", obj.getAltitude());
    }
    if (obj.getChildrenIds() != null) {
      JsonArray array = new JsonArray();
      obj.getChildrenIds().forEach(item -> array.add(item));
      json.put("childrenIds", array);
    }
    if (obj.getDeleted() != null) {
      json.put("deleted", obj.getDeleted());
    }
    if (obj.getDisplayName() != null) {
      json.put("displayName", obj.getDisplayName());
    }
    if (obj.getExpireDate() != null) {
      json.put("expireDate", obj.getExpireDate());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getImportant() != null) {
      json.put("important", obj.getImportant());
    }
    if (obj.getLatitude() != null) {
      json.put("latitude", obj.getLatitude());
    }
    if (obj.getLongitude() != null) {
      json.put("longitude", obj.getLongitude());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    if (obj.getOrgCode() != null) {
      json.put("orgCode", obj.getOrgCode());
    }
    if (obj.getOrgMajors() != null) {
      JsonArray array = new JsonArray();
      obj.getOrgMajors().forEach(item -> array.add(item));
      json.put("orgMajors", array);
    }
    if (obj.getOrgProperty() != null) {
      json.put("orgProperty", obj.getOrgProperty());
    }
    json.put("orgSequence", obj.getOrgSequence());
    if (obj.getOrgType() != null) {
      json.put("orgType", obj.getOrgType());
    }
    if (obj.getParentId() != null) {
      json.put("parentId", obj.getParentId());
    }
    if (obj.getParentIds() != null) {
      JsonArray array = new JsonArray();
      obj.getParentIds().forEach(item -> array.add(item));
      json.put("parentIds", array);
    }
    json.put("planSodierCount", obj.getPlanSodierCount());
    if (obj.getServiceType() != null) {
      json.put("serviceType", obj.getServiceType());
    }
    if (obj.getSpecialMission() != null) {
      json.put("specialMission", obj.getSpecialMission());
    }
    if (obj.getTemp() != null) {
      json.put("temp", obj.getTemp());
    }
  }
}