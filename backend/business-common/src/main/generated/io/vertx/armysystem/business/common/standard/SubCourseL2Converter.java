package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.SubCourseL2}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.SubCourseL2} original class using Vert.x codegen.
 */
public class SubCourseL2Converter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, SubCourseL2 obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "name":
          if (member.getValue() instanceof String) {
            obj.setName((String)member.getValue());
          }
          break;
        case "require":
          if (member.getValue() instanceof String) {
            obj.setRequire((String)member.getValue());
          }
          break;
        case "seq":
          if (member.getValue() instanceof Number) {
            obj.setSeq(((Number)member.getValue()).intValue());
          }
          break;
      }
    }
  }

  public static void toJson(SubCourseL2 obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(SubCourseL2 obj, java.util.Map<String, Object> json) {
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getRequire() != null) {
      json.put("require", obj.getRequire());
    }
    json.put("seq", obj.getSeq());
  }
}
