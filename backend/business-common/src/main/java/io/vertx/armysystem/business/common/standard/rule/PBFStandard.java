package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 体脂合格标准
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class PBFStandard {
  private String id;
  private String standardId;          // 训练大纲Id
  private String gender;              // 性别
  private int ageFrom;                // 年龄范围
  private int ageTo;
  private Double pbfFrom;             // 体脂范围,单位百分比
  private Double pbfTo;

  public PBFStandard() {
    // Empty constructor
  }

  public PBFStandard(JsonObject json) {
    PBFStandardConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    PBFStandardConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getStandardId() {
    return standardId;
  }

  public void setStandardId(String standardId) {
    this.standardId = standardId;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public int getAgeFrom() {
    return ageFrom;
  }

  public void setAgeFrom(int ageFrom) {
    this.ageFrom = ageFrom;
  }

  public int getAgeTo() {
    return ageTo;
  }

  public void setAgeTo(int ageTo) {
    this.ageTo = ageTo;
  }

  public Double getPbfFrom() {
    return pbfFrom;
  }

  public void setPbfFrom(Double pbfFrom) {
    this.pbfFrom = pbfFrom;
  }

  public Double getPbfTo() {
    return pbfTo;
  }

  public void setPbfTo(Double pbfTo) {
    this.pbfTo = pbfTo;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
