package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 个人军事体育训练成绩评定标准
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class PersonSportScoreStandard {
  private String id;
  private String standardId;                // 大纲标准ID
  private String scoreCriteria;             // 成绩评定标准(多级制类型)
  private String physicalLevel;             // 体能训练等级
  private Boolean totalEnabled;             // true: 总分; false:单项
  private int evaluatedScore;               // 评定成绩
  private int scoreCondtion;                // 得分条件

  public PersonSportScoreStandard() {
    // Empty constructor
  }

  public PersonSportScoreStandard(JsonObject json) {
    PersonSportScoreStandardConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    PersonSportScoreStandardConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public PersonSportScoreStandard setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public PersonSportScoreStandard setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getScoreCriteria() {
    return scoreCriteria;
  }

  public PersonSportScoreStandard setScoreCriteria(String scoreCriteria) {
    this.scoreCriteria = scoreCriteria;
    return this;
  }

  public String getPhysicalLevel() {
    return physicalLevel;
  }

  public PersonSportScoreStandard setPhysicalLevel(String physicalLevel) {
    this.physicalLevel = physicalLevel;
    return this;
  }

  public Boolean getTotalEnabled() {
    return totalEnabled;
  }

  public PersonSportScoreStandard setTotalEnabled(Boolean totalEnabled) {
    this.totalEnabled = totalEnabled;
    return this;
  }

  public int getEvaluatedScore() {
    return evaluatedScore;
  }

  public PersonSportScoreStandard setEvaluatedScore(int evaluatedScore) {
    this.evaluatedScore = evaluatedScore;
    return this;
  }

  public int getScoreCondtion() {
    return scoreCondtion;
  }

  public PersonSportScoreStandard setScoreCondtion(int scoreCondtion) {
    this.scoreCondtion = scoreCondtion;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
