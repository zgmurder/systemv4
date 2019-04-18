package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

/**
 * 武警军事训练步骤
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TrainStep {
  private String id;
  private String name;
  private String orgType;
  private List<Integer> trainUnits = new ArrayList<>();
  private int priority;
  private int order;

  public TrainStep() {
    // Empty constructor
  }

  public TrainStep(JsonObject json) {
    TrainStepConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TrainStepConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public TrainStep setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public TrainStep setName(String name) {
    this.name = name;
    return this;
  }

  public String getOrgType() {
    return orgType;
  }

  public TrainStep setOrgType(String orgType) {
    this.orgType = orgType;
    return this;
  }

  public List<Integer> getTrainUnits() {
    return trainUnits;
  }

  public TrainStep setTrainUnits(List<Integer> trainUnits) {
    this.trainUnits = trainUnits;
    return this;
  }

  public int getPriority() {
    return priority;
  }

  public TrainStep setPriority(int priority) {
    this.priority = priority;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public TrainStep setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
