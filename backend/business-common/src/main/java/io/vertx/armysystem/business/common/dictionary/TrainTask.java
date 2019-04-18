package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

/**
 * 武警部队军事训练任务与课题，比如执勤/处突/抢险救援等
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TrainTask {
  private String name;
  private List<String> optionalSubjects = new ArrayList<>();

  public TrainTask() {
    // Empty constructor
  }

  public TrainTask(JsonObject json) {
    TrainTaskConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TrainTaskConverter.toJson(this, json);
    return json;
  }

  public String getName() {
    return name;
  }

  public TrainTask setName(String name) {
    this.name = name;
    return this;
  }

  public List<String> getOptionalSubjects() {
    return optionalSubjects;
  }

  public TrainTask setOptionalSubjects(List<String> optionalSubjects) {
    this.optionalSubjects = optionalSubjects;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
