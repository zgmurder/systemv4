package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 一个训练阶段时长定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class StageTime {
  private String task;
  private Double months;

  public StageTime() {
    // Empty constructor
  }

  public StageTime(JsonObject json) {
    StageTimeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    StageTimeConverter.toJson(this, json);
    return json;
  }

  public String getTask() {
    return task;
  }

  public StageTime setTask(String task) {
    this.task = task;
    return this;
  }

  public Double getMonths() {
    return months;
  }

  public StageTime setMonths(Double months) {
    this.months = months;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
