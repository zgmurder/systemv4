package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 首长机关组训方法
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class GroupTrainMethod {
  private String id;
  private String name;
  private int order;

  public GroupTrainMethod() {
    // Empty constructor
  }

  public GroupTrainMethod(JsonObject json) {
    GroupTrainMethodConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    GroupTrainMethodConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public GroupTrainMethod setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public GroupTrainMethod setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public GroupTrainMethod setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
