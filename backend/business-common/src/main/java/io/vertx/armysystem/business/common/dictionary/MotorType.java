package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 摩托类型
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class MotorType {
  private String id;
  private String name;
  private String unit;
  private int order;

  public MotorType() {
    // Empty constructor
  }

  public MotorType(JsonObject json) {
    MotorTypeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    MotorTypeConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public MotorType setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public MotorType setName(String name) {
    this.name = name;
    return this;
  }

  public String getUnit() {
    return unit;
  }

  public MotorType setUnit(String unit) {
    this.unit = unit;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public MotorType setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
