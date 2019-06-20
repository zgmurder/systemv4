package io.vertx.armysystem.business.common.resource;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.resource.TrainPlace}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.resource.TrainPlace} original class using Vert.x codegen.
 */
public class TrainPlaceConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, TrainPlace obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "address":
          if (member.getValue() instanceof String) {
            obj.setAddress((String)member.getValue());
          }
          break;
        case "area":
          if (member.getValue() instanceof String) {
            obj.setArea((String)member.getValue());
          }
          break;
        case "builtAt":
          if (member.getValue() instanceof Number) {
            obj.setBuiltAt(((Number)member.getValue()).longValue());
          }
          break;
        case "builtStatus":
          if (member.getValue() instanceof Number) {
            obj.setBuiltStatus(((Number)member.getValue()).intValue());
          }
          break;
        case "capacity":
          if (member.getValue() instanceof Number) {
            obj.setCapacity(((Number)member.getValue()).intValue());
          }
          break;
        case "createdTime":
          if (member.getValue() instanceof Number) {
            obj.setCreatedTime(((Number)member.getValue()).longValue());
          }
          break;
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "indoor":
          if (member.getValue() instanceof Boolean) {
            obj.setIndoor((Boolean)member.getValue());
          }
          break;
        case "internal":
          if (member.getValue() instanceof Boolean) {
            obj.setInternal((Boolean)member.getValue());
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
        case "photos":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setPhotos(list);
          }
          break;
        case "placeTypes":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setPlaceTypes(list);
          }
          break;
        case "startedAt":
          if (member.getValue() instanceof Number) {
            obj.setStartedAt(((Number)member.getValue()).longValue());
          }
          break;
        case "updatedTime":
          if (member.getValue() instanceof Number) {
            obj.setUpdatedTime(((Number)member.getValue()).longValue());
          }
          break;
        case "weathers":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<java.lang.String> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof String)
                list.add((String)item);
            });
            obj.setWeathers(list);
          }
          break;
      }
    }
  }

  public static void toJson(TrainPlace obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(TrainPlace obj, java.util.Map<String, Object> json) {
    if (obj.getAddress() != null) {
      json.put("address", obj.getAddress());
    }
    if (obj.getArea() != null) {
      json.put("area", obj.getArea());
    }
    if (obj.getBuiltAt() != null) {
      json.put("builtAt", obj.getBuiltAt());
    }
    json.put("builtStatus", obj.getBuiltStatus());
    json.put("capacity", obj.getCapacity());
    if (obj.getCreatedTime() != null) {
      json.put("createdTime", obj.getCreatedTime());
    }
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getIndoor() != null) {
      json.put("indoor", obj.getIndoor());
    }
    if (obj.getInternal() != null) {
      json.put("internal", obj.getInternal());
    }
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getOrganizationId() != null) {
      json.put("organizationId", obj.getOrganizationId());
    }
    if (obj.getPhotos() != null) {
      JsonArray array = new JsonArray();
      obj.getPhotos().forEach(item -> array.add(item));
      json.put("photos", array);
    }
    if (obj.getPlaceTypes() != null) {
      JsonArray array = new JsonArray();
      obj.getPlaceTypes().forEach(item -> array.add(item));
      json.put("placeTypes", array);
    }
    if (obj.getStartedAt() != null) {
      json.put("startedAt", obj.getStartedAt());
    }
    if (obj.getUpdatedTime() != null) {
      json.put("updatedTime", obj.getUpdatedTime());
    }
    if (obj.getWeathers() != null) {
      JsonArray array = new JsonArray();
      obj.getWeathers().forEach(item -> array.add(item));
      json.put("weathers", array);
    }
  }
}
