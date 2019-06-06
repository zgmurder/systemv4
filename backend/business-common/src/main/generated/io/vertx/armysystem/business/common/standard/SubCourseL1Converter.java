package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.SubCourseL1}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.SubCourseL1} original class using Vert.x codegen.
 */
public class SubCourseL1Converter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, SubCourseL1 obj) {
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
        case "subcourses":
          if (member.getValue() instanceof JsonArray) {
            java.util.ArrayList<io.vertx.armysystem.business.common.standard.SubCourseL2> list =  new java.util.ArrayList<>();
            ((Iterable<Object>)member.getValue()).forEach( item -> {
              if (item instanceof JsonObject)
                list.add(new io.vertx.armysystem.business.common.standard.SubCourseL2((JsonObject)item));
            });
            obj.setSubcourses(list);
          }
          break;
      }
    }
  }

  public static void toJson(SubCourseL1 obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(SubCourseL1 obj, java.util.Map<String, Object> json) {
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getRequire() != null) {
      json.put("require", obj.getRequire());
    }
    json.put("seq", obj.getSeq());
    if (obj.getSubcourses() != null) {
      JsonArray array = new JsonArray();
      obj.getSubcourses().forEach(item -> array.add(item.toJson()));
      json.put("subcourses", array);
    }
  }
}
