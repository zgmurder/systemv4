package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.armysystem.business.common.standard.rule.mtsr.Condition;
import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 单位单课目训练成绩评定规则
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class OrgSingleCourseScoreRule {
  private String id;
  private String standardId;                // 大纲标准ID
  private String scoreCriteria;             // 成绩评定标准(多级制类型)
  private int score;                        // 评定成绩
  private List<Condition> conditions;       // 成绩评定条件(对象为个人单课目成绩)

  public OrgSingleCourseScoreRule() {
    // Empty constructor
  }

  public OrgSingleCourseScoreRule(JsonObject json) {
    OrgSingleCourseScoreRuleConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    OrgSingleCourseScoreRuleConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public OrgSingleCourseScoreRule setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public OrgSingleCourseScoreRule setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getScoreCriteria() {
    return scoreCriteria;
  }

  public OrgSingleCourseScoreRule setScoreCriteria(String scoreCriteria) {
    this.scoreCriteria = scoreCriteria;
    return this;
  }

  public int getScore() {
    return score;
  }

  public OrgSingleCourseScoreRule setScore(int score) {
    this.score = score;
    return this;
  }

  public List<Condition> getConditions() {
    return conditions;
  }

  public OrgSingleCourseScoreRule setConditions(List<Condition> conditions) {
    this.conditions = conditions;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}