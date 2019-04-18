package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 后勤保障人员专业类型
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class SupporterMajor {
  private String id;
  private String name;
  private int order;

  public SupporterMajor() {
    // Empty constructor
  }

  public SupporterMajor(JsonObject json) {
    SupporterMajorConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    SupporterMajorConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public SupporterMajor setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public SupporterMajor setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public SupporterMajor setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
