package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 训练阶段时长定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TrainStageTime {
  private String id;
  private String standardName;
  private List<String> orgCategories;
  private List<String> majors;
  private List<StageTime> stageTimes;

  public TrainStageTime() {
    // Empty constructor
  }

  public TrainStageTime(JsonObject json) {
    TrainStageTimeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TrainStageTimeConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public TrainStageTime setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardName() {
    return standardName;
  }

  public TrainStageTime setStandardName(String standardName) {
    this.standardName = standardName;
    return this;
  }

  public List<String> getOrgCategories() {
    return orgCategories;
  }

  public TrainStageTime setOrgCategories(List<String> orgCategories) {
    this.orgCategories = orgCategories;
    return this;
  }

  public List<String> getMajors() {
    return majors;
  }

  public TrainStageTime setMajors(List<String> majors) {
    this.majors = majors;
    return this;
  }

  public List<StageTime> getStageTimes() {
    return stageTimes;
  }

  public TrainStageTime setStageTimes(List<StageTime> stageTimes) {
    this.stageTimes = stageTimes;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
