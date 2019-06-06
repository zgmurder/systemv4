package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 考核内容定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TestContent {
  private String name;        // 考核内容名称
  private String testReq;     // 考核要求, 必考或选考

  public TestContent() {
    // Empty constructor
  }

  public TestContent(JsonObject json) {
    TestContentConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TestContentConverter.toJson(this, json);
    return json;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getTestReq() {
    return testReq;
  }

  public void setTestReq(String testReq) {
    this.testReq = testReq;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
