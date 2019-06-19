package io.vertx.armysystem.business.common.standard.rule.loasr;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

@DataObject(generateConverter = true)
public class Condition {
  private String scoreCriteria;           // 成绩评定标准(多级制类型)
  private int exerciseSocre;              // 指挥所演习成绩要求(0:表示无要求)
  private int scoreReq;                   // 成绩要求
  private int courseNum;                  // 符合成绩要求的课目数, 数组中的每个条件之间是并且的关系

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

  public int getExerciseSocre() {
    return exerciseSocre;
  }

  public Condition setExerciseSocre(int exerciseSocre) {
    this.exerciseSocre = exerciseSocre;
    return this;
  }

  public int getScoreReq() {
    return scoreReq;
  }

  public Condition setScoreReq(int scoreReq) {
    this.scoreReq = scoreReq;
    return this;
  }

  public int getCourseNum() {
    return courseNum;
  }

  public Condition setCourseNum(int courseNum) {
    this.courseNum = courseNum;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
