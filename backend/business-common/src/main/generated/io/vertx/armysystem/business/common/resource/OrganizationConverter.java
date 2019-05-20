package io.vertx.armysystem.business.common.resource;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.resource.Organization}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.resource.Organization} original class using Vert.x codegen.
 */
public class OrganizationConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Organization obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "address":
          if (member.getValue() instanceof String) {
            obj.setAddress((String)member.getValue());
          }
          break;
        case "altitude":
          if (member.getValue() instanceof Number) {
            obj.setAltitude(((Number)member.getValue()).doubleValue());
          }
          break;
        case "childCount":
          if (member.getValue() instanceof Number) {
            obj.setChildCount(((Number)member.getValue()).intValue());
          }
          break;
        case "deactivated":
          if (member.getValue() instanceof Boolean) {
            obj.setDeactivated((Boolean)member.getValue());
          }
          break;
        case "deactivatedAt":
          if (member.getValue() instanceof Number) {
            obj.setDeactivatedAt(((Number)member.getValue()).longValue());
          }
          break;
        case "displayName":
          if (member.getValue() instanceof String) {
            obj.setDisplayName((String)member.getValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "important":
          if (member.getValue() instanceof Boolean) {
            obj.setImportant((Boolean)member.getValue());
          }
          break;
        case "latitude":
          if (member.getValue() instanceof Number) {
            obj.setLatitude(((Number)member.getValue()).doubleValue());
          }
          break;
        case "longitude":
          if (member.getValue() instanceof Number) {
            obj.setLongitude(((Number)member.getValue()).doubleValue());
          }
          break;
        case "name":
          if (member.getValue() instanceof String) {
            obj.setName((String)member.getValue());
          }
          break;
        case "nodeCode":
          if (member.getValue() instanceof Number) {
            obj.setNodeCode(((Number)member.getValue()).intValue());
          }
          break;
        case "orgCategory":
          if (member.getValue() instanceof String) {
            obj.setOrgCategory((String)member.getValue());
          }
          break;
        case "orgCode":
          if (member.getValue() instanceof String) {
            obj.setOrgCode((String)member.getValue());
          }
          break;
        case "orgMajors":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setOrgMajors(list);
          }
          break;
        case "orgProperty":
          if (member.getValue() instanceof String) {
            obj.setOrgProperty((String)member.getValue());
          }
          break;
        case "orgSequence":
          if (member.getValue() instanceof Number) {
            obj.setOrgSequence(((Number)member.getValue()).intValue());
          }
          break;
        case "orgType":
          if (member.getValue() instanceof String) {
            obj.setOrgType((String)member.getValue());
          }
          break;
        case "parentId":
          if (member.getValue() instanceof String) {
            obj.setParentId((String)member.getValue());
          }
          break;
        case "parentIds":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setParentIds(list);
          }
          break;
        case "planSodierCount":
          if (member.getValue() instanceof Number) {
            obj.setPlanSodierCount(((Number)member.getValue()).intValue());
          }
          break;
        case "serviceType":
          if (member.getValue() instanceof String) {
            obj.setServiceType((String)member.getValue());
          }
          break;
        case "specialMission":
          if (member.getValue() instanceof String) {
            obj.setSpecialMission((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(Organization obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Organization obj, java.util.Map<String, Object> json) {
    if (obj.getAddress() != null) {
      json.put("address", obj.getAddress());
    }
    if (obj.getAltitude() != null) {
      json.put("altitude", obj.getAltitude());
    }
    json.put("childCount", obj.getChildCount());
    if (obj.getDeactivated() != null) {
      json.put("deactivated", obj.getDeactivated());
    }
    if (obj.getDeactivatedAt() != null) {
      json.put("deactivatedAt", obj.getDeactivatedAt());
    }
    if (obj.getDisplayName() != null) {
      json.put("displayName", obj.getDisplayName());
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
    json.put("nodeCode", obj.getNodeCode());
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
  }
}
