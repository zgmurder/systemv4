package io.vertx.armysystem.business.common.standard.rule.sss;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

@DataObject(generateConverter = true)
public class ScorePair {
  private Double count;           // 成绩计数
  private Double score;           // 得分

  public ScorePair() {
    // Empty constructor
  }

  public ScorePair(JsonObject json) {
    ScorePairConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    ScorePairConverter.toJson(this, json);
    return json;
  }

  public Double getCount() {
    return count;
  }

  public ScorePair setCount(Double count) {
    this.count = count;
    return this;
  }

  public Double getScore() {
    return score;
  }

  public ScorePair setScore(Double score) {
    this.score = score;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
