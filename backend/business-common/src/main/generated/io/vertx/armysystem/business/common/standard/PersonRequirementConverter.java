package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.PersonRequirement}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.PersonRequirement} original class using Vert.x codegen.
 */
public class PersonRequirementConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, PersonRequirement obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "id":
          if (member.getValue() instanceof String) {
            obj.setId((String)member.getValue());
          }
          break;
        case "orgCategory":
          if (member.getValue() instanceof String) {
            obj.setOrgCategory((String)member.getValue());
          }
          break;
        case "standardId":
          if (member.getValue() instanceof String) {
            obj.setStandardId((String)member.getValue());
          }
          break;
        case "trainRate":
          if (member.getValue() instanceof Number) {
            obj.setTrainRate(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(PersonRequirement obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(PersonRequirement obj, java.util.Map<String, Object> json) {
    if (obj.getId() != null) {
      json.put("id", obj.getId());
    }
    if (obj.getOrgCategory() != null) {
      json.put("orgCategory", obj.getOrgCategory());
    }
    if (obj.getStandardId() != null) {
      json.put("standardId", obj.getStandardId());
    }
    json.put("trainRate", obj.getTrainRate());
  }
}
