package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.armysystem.business.common.standard.rule.mtsr.Condition;
import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 单位体育成绩评定标准
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class OrgSportScoreStandard {
  private String id;
  private String standardId;                // 大纲标准ID
  private String scoreCriteria;             // 成绩评定标准(多级制类型)
  private int score;                        // 评定成绩
  private Boolean newRecruit;               // 是否是新兵单位
  private int masterScore;                  // 军政主官成绩要求
  private List<Condition> conditions;       // 成绩评定条件(对象为个人单课目成绩)

  public OrgSportScoreStandard() {
    // Empty constructor
  }

  public OrgSportScoreStandard(JsonObject json) {
    OrgSportScoreStandardConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    OrgSportScoreStandardConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public OrgSportScoreStandard setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public OrgSportScoreStandard setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getScoreCriteria() {
    return scoreCriteria;
  }

  public OrgSportScoreStandard setScoreCriteria(String scoreCriteria) {
    this.scoreCriteria = scoreCriteria;
    return this;
  }

  public int getScore() {
    return score;
  }

  public OrgSportScoreStandard setScore(int score) {
    this.score = score;
    return this;
  }

  public Boolean getNewRecruit() {
    return newRecruit;
  }

  public OrgSportScoreStandard setNewRecruit(Boolean newRecruit) {
    this.newRecruit = newRecruit;
    return this;
  }

  public int getMasterScore() {
    return masterScore;
  }

  public OrgSportScoreStandard setMasterScore(int masterScore) {
    this.masterScore = masterScore;
    return this;
  }

  public List<Condition> getConditions() {
    return conditions;
  }

  public OrgSportScoreStandard setConditions(List<Condition> conditions) {
    this.conditions = conditions;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}