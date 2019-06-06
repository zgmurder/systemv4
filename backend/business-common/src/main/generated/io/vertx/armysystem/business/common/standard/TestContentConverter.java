package io.vertx.armysystem.business.common.standard;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link io.vertx.armysystem.business.common.standard.TestContent}.
 * NOTE: This class has been automatically generated from the {@link io.vertx.armysystem.business.common.standard.TestContent} original class using Vert.x codegen.
 */
public class TestContentConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, TestContent obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "name":
          if (member.getValue() instanceof String) {
            obj.setName((String)member.getValue());
          }
          break;
        case "testReq":
          if (member.getValue() instanceof String) {
            obj.setTestReq((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(TestContent obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(TestContent obj, java.util.Map<String, Object> json) {
    if (obj.getName() != null) {
      json.put("name", obj.getName());
    }
    if (obj.getTestReq() != null) {
      json.put("testReq", obj.getTestReq());
    }
  }
}
