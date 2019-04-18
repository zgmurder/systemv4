package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 特殊部队类型
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class SpecialMission {
  private String id;
  private String name;
  private int order;

  public SpecialMission() {
    // Empty constructor
  }

  public SpecialMission(JsonObject json) {
    SpecialMissionConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    SpecialMissionConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public SpecialMission setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public SpecialMission setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public SpecialMission setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
