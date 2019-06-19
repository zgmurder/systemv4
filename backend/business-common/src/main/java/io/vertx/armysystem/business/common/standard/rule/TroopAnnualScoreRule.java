package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.armysystem.business.common.standard.rule.loasr.Condition;
import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 部队年度训练成绩评定标准
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TroopAnnualScoreRule {
  private String id;
  private String standardId;                // 大纲标准ID
  private String scoreCriteria;             // 成绩评定标准(多级制类型)
  private int score;                        // 评定成绩
  private Boolean withTactics;              // 是否有战术作业成绩
  private List<Condition> conditions;       // 成绩评定条件(对象为个人单课目成绩)

  public TroopAnnualScoreRule() {
    // Empty constructor
  }

  public TroopAnnualScoreRule(JsonObject json) {
    TroopAnnualScoreRuleConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TroopAnnualScoreRuleConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public TroopAnnualScoreRule setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public TroopAnnualScoreRule setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getScoreCriteria() {
    return scoreCriteria;
  }

  public TroopAnnualScoreRule setScoreCriteria(String scoreCriteria) {
    this.scoreCriteria = scoreCriteria;
    return this;
  }

  public int getScore() {
    return score;
  }

  public TroopAnnualScoreRule setScore(int score) {
    this.score = score;
    return this;
  }

  public Boolean getWithTactics() {
    return withTactics;
  }

  public TroopAnnualScoreRule setWithTactics(Boolean withTactics) {
    this.withTactics = withTactics;
    return this;
  }

  public List<Condition> getConditions() {
    return conditions;
  }

  public TroopAnnualScoreRule setConditions(List<Condition> conditions) {
    this.conditions = conditions;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}