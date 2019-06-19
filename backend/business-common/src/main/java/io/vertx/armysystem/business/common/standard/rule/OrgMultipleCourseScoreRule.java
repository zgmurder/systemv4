package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.armysystem.business.common.standard.rule.mtsr.Condition;
import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 单位多课目训练成绩评定规则
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class OrgMultipleCourseScoreRule {
  private String id;
  private String standardId;                // 大纲标准ID
  private String scoreCriteria;             // 成绩评定标准(多级制类型)
  private int score;                        // 评定成绩
  private List<Condition> conditions;       // 成绩评定条件(对象为个人单课目成绩)

  public OrgMultipleCourseScoreRule() {
    // Empty constructor
  }

  public OrgMultipleCourseScoreRule(JsonObject json) {
    OrgMultipleCourseScoreRuleConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    OrgMultipleCourseScoreRuleConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public OrgMultipleCourseScoreRule setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public OrgMultipleCourseScoreRule setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getScoreCriteria() {
    return scoreCriteria;
  }

  public OrgMultipleCourseScoreRule setScoreCriteria(String scoreCriteria) {
    this.scoreCriteria = scoreCriteria;
    return this;
  }

  public int getScore() {
    return score;
  }

  public OrgMultipleCourseScoreRule setScore(int score) {
    this.score = score;
    return this;
  }

  public List<Condition> getConditions() {
    return conditions;
  }

  public OrgMultipleCourseScoreRule setConditions(List<Condition> conditions) {
    this.conditions = conditions;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}