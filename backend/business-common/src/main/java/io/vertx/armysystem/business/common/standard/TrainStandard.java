package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 训练大纲标准
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TrainStandard {
  private String id;
  private String name;
  private int state;          // 大纲启用状态: 0: 未启用/ 1: 已启用/ 2: 已停用, 参考StandardState
  private Long startTime;     // 大纲启用日期
  private Long endTime;       // 大纲停用日期

  public TrainStandard() {
    // Empty constructor
  }

  public TrainStandard(JsonObject json) {
    TrainStandardConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TrainStandardConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public TrainStandard setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public TrainStandard setName(String name) {
    this.name = name;
    return this;
  }

  public int getState() {
    return state;
  }

  public TrainStandard setState(int state) {
    this.state = state;
    return this;
  }

  public Long getStartTime() {
    return startTime;
  }

  public TrainStandard setStartTime(Long startTime) {
    this.startTime = startTime;
    return this;
  }

  public Long getEndTime() {
    return endTime;
  }

  public TrainStandard setEndTime(Long endTime) {
    this.endTime = endTime;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
