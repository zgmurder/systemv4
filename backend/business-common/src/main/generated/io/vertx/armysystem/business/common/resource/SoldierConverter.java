package io.vertx.armysystem.business.common.resource;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.resource.Soldier}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.resource.Soldier} original class using Vert.x codegen.
 */
public class SoldierConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, Soldier obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "advanced":
          if (member.getValue() instanceof JsonObject) {
            obj.setAdvanced(new io.vertx.armysystem.business.common.resource.AdvancedPersonInfo((JsonObject)member.getValue()));
          }
          break;
        case "birthday":
          if (member.getValue() instanceof Number) {
            obj.setBirthday(((Number)member.getValue()).longValue());
          }
          break;
        case "cardId":
          if (member.getValue() instanceof String) {
            obj.setCardId((String)member.getValue());
          }
          break;
        case "civilServant":
          if (member.getValue() instanceof Boolean) {
            obj.setCivilServant((Boolean)member.getValue());
          }
          break;
        case "createdTime":
          if (member.getValue() instanceof Number) {
            obj.setCreatedTime(((Number)member.getValue()).longValue());
          }
          break;
        case "dischargedAt":
          if (member.getValue() instanceof Number) {
            obj.setDischargedAt(((Number)member.getValue()).longValue());
          }
          break;
        case "enlistedAt":
          if (member.getValue() instanceof Number) {
            obj.setEnlistedAt(((Number)member.getValue()).longValue());
          }
          break;
        case "gender":
          if (member.getValue() instanceof String) {
            obj.setGender((String)member.getValue());
          }
          break;
        case "gunnerType":
          if (member.getValue() instanceof String) {
            obj.setGunnerType((String)member.getValue());
          }
          break;
        case "headUrl":
          if (member.getValue() instanceof String) {
            obj.setHeadUrl((String)member.getValue());
          }
          break;
        case "height":
          if (member.getValue() instanceof Number) {
            obj.setHeight(((Number)member.getValue()).doubleValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "inserviceStatus":
          if (member.getValue() instanceof Number) {
            obj.setInserviceStatus(((Number)member.getValue()).intValue());
          }
          break;
        case "joinedAt":
          if (member.getValue() instanceof Number) {
            obj.setJoinedAt(((Number)member.getValue()).longValue());
          }
          break;
        case "leftAt":
          if (member.getValue() instanceof Number) {
            obj.setLeftAt(((Number)member.getValue()).longValue());
          }
          break;
        case "majorType":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setMajorType(list);
          }
          break;
        case "name":
          if (member.getValue() instanceof String) {
            obj.setName((String)member.getValue());
          }
          break;
        case "organizationId":
          if (member.getValue() instanceof String) {
            obj.setOrganizationId((String)member.getValue());
          }
          break;
        case "personProperty":
          if (member.getValue() instanceof String) {
            obj.setPersonProperty((String)member.getValue());
          }
          break;
        case "physicalLevel":
          if (member.getValue() instanceof String) {
            obj.setPhysicalLevel((String)member.getValue());
          }
          break;
        case "politicalStatus":
          if (member.getValue() instanceof String) {
            obj.setPoliticalStatus((String)member.getValue());
          }
          break;
        case "positionId":
          if (member.getValue() instanceof String) {
            obj.setPositionId((String)member.getValue());
          }
          break;
        case "rankId":
          if (member.getValue() instanceof String) {
            obj.setRankId((String)member.getValue());
          }
          break;
        case "soldierCategory":
          if (member.getValue() instanceof String) {
            obj.setSoldierCategory((String)member.getValue());
          }
          break;
        case "specialForce":
          if (member.getValue() instanceof Boolean) {
            obj.setSpecialForce((Boolean)member.getValue());
          }
          break;
        case "specialForceType":
          if (member.getValue() instanceof String) {
            obj.setSpecialForceType((String)member.getValue());
          }
          break;
        case "supporter":
          if (member.getValue() instanceof Boolean) {
            obj.setSupporter((Boolean)member.getValue());
          }
          break;
        case "troopCategory":
          if (member.getValue() instanceof String) {
            obj.setTroopCategory((String)member.getValue());
          }
          break;
        case "updatedTime":
          if (member.getValue() instanceof Number) {
            obj.setUpdatedTime(((Number)member.getValue()).longValue());
          }
          break;
        case "weight":
          if (member.getValue() instanceof Number) {
            obj.setWeight(((Number)member.getValue()).doubleValue());
          }
          break;
      }
    }
  }

  public static void toJson(Soldier obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(Soldier obj, java.util.Map<String, Object> json) {
    if (obj.getAdvanced() != null) {
      json.put("advanced", obj.getAdvanced().toJson());
    }
    if (obj.getBirthday() != null) {
      json.put("birthday", obj.getBirthday());
    }
    if (obj.getCardId() != null) {
      json.put("cardId", obj.getCardId());
    }
    if (obj.getCivilServant() != null) {
      json.put("civilServant", obj.getCivilServant());
    }
    if (obj.getCreatedTime() != null) {
      json.put("createdTime", obj.getCreatedTime());
    }
    if (obj.getDischargedAt() != null) {
      json.put("dischargedAt", obj.getDischargedAt());
    }
    if (obj.getEnlistedAt() != null) {
      json.put("enlistedAt", obj.getEnlistedAt());
    }
    if (obj.getGender() != null) {
      json.put("gender", obj.getGender());
    }
    if (obj.getGunnerType() != null) {
      json.put("gunnerType", obj.getGunnerType());
    }
    if (obj.getHeadUrl() != null) {
      json.put("headUrl", obj.getHeadUrl());
    }
    if (obj.getHeight() != null) {
      json.put("height", obj.getHeight());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    json.put("inserviceStatus", obj.getInserviceStatus());
    if (obj.getJoinedAt() != null) {
      json.put("joinedAt", obj.getJoinedAt());
    }
    if (obj.getLeftAt() != null) {
      json.put("leftAt", obj.getLeftAt());
    }
    if (obj.getMajorType() != null) {
      JsonArray array = new JsonArray();
      obj.getMajorType().forEach(item -> array.add(item));
      json.put("majorType", array);
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOrganizationId() != null) {
      json.put("organizationId", obj.getOrganizationId());
    }
    if (obj.getPersonProperty() != null) {
      json.put("personProperty", obj.getPersonProperty());
    }
    if (obj.getPhysicalLevel() != null) {
      json.put("physicalLevel", obj.getPhysicalLevel());
    }
    if (obj.getPoliticalStatus() != null) {
      json.put("politicalStatus", obj.getPoliticalStatus());
    }
    if (obj.getPositionId() != null) {
      json.put("positionId", obj.getPositionId());
    }
    if (obj.getRankId() != null) {
      json.put("rankId", obj.getRankId());
    }
    if (obj.getSoldierCategory() != null) {
      json.put("soldierCategory", obj.getSoldierCategory());
    }
    if (obj.getSpecialForce() != null) {
      json.put("specialForce", obj.getSpecialForce());
    }
    if (obj.getSpecialForceType() != null) {
      json.put("specialForceType", obj.getSpecialForceType());
    }
    if (obj.getSupporter() != null) {
      json.put("supporter", obj.getSupporter());
    }
    if (obj.getTroopCategory() != null) {
      json.put("troopCategory", obj.getTroopCategory());
    }
    if (obj.getUpdatedTime() != null) {
      json.put("updatedTime", obj.getUpdatedTime());
    }
    if (obj.getWeight() != null) {
      json.put("weight", obj.getWeight());
    }
  }
}
