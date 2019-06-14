package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 八落实人员训练质量要求
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class PersonScoreRequirement {
  private String id;
  private String standardId;
  private String personProperty;    // 训练大纲
  private List<String> ranks;       // 军衔等级列表
  private int startYear;            // 任职年限范围,比如0-2年, 2年以上等
  private int endYear;
  private int scoreReq;             // 成绩要求

  public PersonScoreRequirement() {
    // Empty constructor
  }

  public PersonScoreRequirement(JsonObject json) {
    PersonScoreRequirementConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    PersonScoreRequirementConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public PersonScoreRequirement setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public PersonScoreRequirement setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getPersonProperty() {
    return personProperty;
  }

  public PersonScoreRequirement setPersonProperty(String personProperty) {
    this.personProperty = personProperty;
    return this;
  }

  public List<String> getRanks() {
    return ranks;
  }

  public PersonScoreRequirement setRanks(List<String> ranks) {
    this.ranks = ranks;
    return this;
  }

  public int getStartYear() {
    return startYear;
  }

  public PersonScoreRequirement setStartYear(int startYear) {
    this.startYear = startYear;
    return this;
  }

  public int getEndYear() {
    return endYear;
  }

  public PersonScoreRequirement setEndYear(int endYear) {
    this.endYear = endYear;
    return this;
  }

  public int getScoreReq() {
    return scoreReq;
  }

  public PersonScoreRequirement setScoreReq(int scoreReq) {
    this.scoreReq = scoreReq;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
