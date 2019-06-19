package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.armysystem.business.common.standard.rule.sss.Condition;
import io.vertx.armysystem.business.common.standard.rule.sss.ScorePair;
import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 个人军事体育训练成绩评定标准
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class SportScoreStandard {
  private String id;
  private String standardId;                // 大纲标准ID
  private String courseId;                  // 体育课目
  private List<String> physicalLevels;      // 体能训练等级列表
  private List<String> troopCategories;     // 军兵种类型列表
  private String gender;                    // 性别要求(男/女)
  private Boolean civilServant;             // 是否为文职人员
  private Boolean highland;                 // 是否为高原地区
  private int heightFrom;                   // 海拔范围
  private int heightTo;
  private String scoreCriteria;             // 成绩评定标准(多级制类型)
  private Boolean individualEnabled;        // 评分对象（true: 针对个人; false: 针对集体）
  private List<Condition> individuals;      // 个人成绩细则(评分对象为个人时有效)
  private List<ScorePair> groups;           // 集体成绩细则(评分对象为集体时有效)

  private Double highScoreCountStep;        // 超过100分后的成绩计算方式, 成绩计数增量或减量
  private Double highScoreScoreStep;        // 超过100分后的成绩计算方式, 得分增量
  private Double heightFactorStep;          // 海拔影响: 海拔增量
  private Double heightFactorCountStep;     // 海拔影响: 成绩计数增量

  public SportScoreStandard() {
    // Empty constructor
  }

  public SportScoreStandard(JsonObject json) {
    SportScoreStandardConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    SportScoreStandardConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public SportScoreStandard setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public SportScoreStandard setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getCourseId() {
    return courseId;
  }

  public SportScoreStandard setCourseId(String courseId) {
    this.courseId = courseId;
    return this;
  }

  public List<String> getPhysicalLevels() {
    return physicalLevels;
  }

  public SportScoreStandard setPhysicalLevels(List<String> physicalLevels) {
    this.physicalLevels = physicalLevels;
    return this;
  }

  public List<String> getTroopCategories() {
    return troopCategories;
  }

  public SportScoreStandard setTroopCategories(List<String> troopCategories) {
    this.troopCategories = troopCategories;
    return this;
  }

  public String getGender() {
    return gender;
  }

  public SportScoreStandard setGender(String gender) {
    this.gender = gender;
    return this;
  }

  public Boolean getCivilServant() {
    return civilServant;
  }

  public SportScoreStandard setCivilServant(Boolean civilServant) {
    this.civilServant = civilServant;
    return this;
  }

  public Boolean getHighland() {
    return highland;
  }

  public SportScoreStandard setHighland(Boolean highland) {
    this.highland = highland;
    return this;
  }

  public int getHeightFrom() {
    return heightFrom;
  }

  public SportScoreStandard setHeightFrom(int heightFrom) {
    this.heightFrom = heightFrom;
    return this;
  }

  public int getHeightTo() {
    return heightTo;
  }

  public SportScoreStandard setHeightTo(int heightTo) {
    this.heightTo = heightTo;
    return this;
  }

  public String getScoreCriteria() {
    return scoreCriteria;
  }

  public SportScoreStandard setScoreCriteria(String scoreCriteria) {
    this.scoreCriteria = scoreCriteria;
    return this;
  }

  public Boolean getIndividualEnabled() {
    return individualEnabled;
  }

  public SportScoreStandard setIndividualEnabled(Boolean individualEnabled) {
    this.individualEnabled = individualEnabled;
    return this;
  }

  public List<Condition> getIndividuals() {
    return individuals;
  }

  public SportScoreStandard setIndividuals(List<Condition> individuals) {
    this.individuals = individuals;
    return this;
  }

  public List<ScorePair> getGroups() {
    return groups;
  }

  public SportScoreStandard setGroups(List<ScorePair> groups) {
    this.groups = groups;
    return this;
  }

  public Double getHighScoreCountStep() {
    return highScoreCountStep;
  }

  public SportScoreStandard setHighScoreCountStep(Double highScoreCountStep) {
    this.highScoreCountStep = highScoreCountStep;
    return this;
  }

  public Double getHighScoreScoreStep() {
    return highScoreScoreStep;
  }

  public SportScoreStandard setHighScoreScoreStep(Double highScoreScoreStep) {
    this.highScoreScoreStep = highScoreScoreStep;
    return this;
  }

  public Double getHeightFactorStep() {
    return heightFactorStep;
  }

  public SportScoreStandard setHeightFactorStep(Double heightFactorStep) {
    this.heightFactorStep = heightFactorStep;
    return this;
  }

  public Double getHeightFactorCountStep() {
    return heightFactorCountStep;
  }

  public SportScoreStandard setHeightFactorCountStep(Double heightFactorCountStep) {
    this.heightFactorCountStep = heightFactorCountStep;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
