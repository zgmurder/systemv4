package io.vertx.armysystem.business.common.standard.rule.mtsr;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

@DataObject(generateConverter = true)
public class Condition {
  private String scoreCriteria;           // 成绩评定标准(多级制类型)
  private int scoreReq;                   // 成绩要求
  private Double matchRate;               // 符合成绩要求的百分比, 数组中的每个条件之间是并且的关系

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

  public String getScoreCriteria() {
    return scoreCriteria;
  }

  public Condition setScoreCriteria(String scoreCriteria) {
    this.scoreCriteria = scoreCriteria;
    return this;
  }

  public int getScoreReq() {
    return scoreReq;
  }

  public Condition setScoreReq(int scoreReq) {
    this.scoreReq = scoreReq;
    return this;
  }

  public Double getMatchRate() {
    return matchRate;
  }

  public Condition setMatchRate(Double matchRate) {
    this.matchRate = matchRate;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
