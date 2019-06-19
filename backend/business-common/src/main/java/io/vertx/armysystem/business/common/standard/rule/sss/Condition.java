package io.vertx.armysystem.business.common.standard.rule.sss;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

@DataObject(generateConverter = true)
public class Condition {
  private int ageFrom;           // 年龄范围
  private int ageTo;
  private Double count;           // 成绩计数
  private Double score;           // 得分

  public Condition() {
    // Empty constructor
  }

  public Condition(JsonObject json) {
    ConditionConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    ConditionConverter.toJson(this, json);
    return json;
  }

  public int getAgeFrom() {
    return ageFrom;
  }

  public void setAgeFrom(int ageFrom) {
    this.ageFrom = ageFrom;
  }

  public int getAgeTo() {
    return ageTo;
  }

  public void setAgeTo(int ageTo) {
    this.ageTo = ageTo;
  }

  public Double getCount() {
    return count;
  }

  public void setCount(Double count) {
    this.count = count;
  }

  public Double getScore() {
    return score;
  }

  public void setScore(Double score) {
    this.score = score;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
