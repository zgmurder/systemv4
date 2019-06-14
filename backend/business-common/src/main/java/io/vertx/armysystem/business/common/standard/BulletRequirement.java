package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 八落实弹药消耗要求
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class BulletRequirement {
  private String id;
  private String standardId;
  private String orgCategory;     // 单位分类
  private String majorType;       // 专业类型
  private String ordnanceType;    // 军械类型
  private String rankL1;          // 军衔一级分类(义务兵/士官/军官)
  private int quota;              // 数量配额
  private String unitType;        // 计量单位
  private String numType;         // 数量类型(单人/单炮/总量)

  public BulletRequirement() {
    // Empty constructor
  }

  public BulletRequirement(JsonObject json) {
    BulletRequirementConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    BulletRequirementConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public BulletRequirement setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public BulletRequirement setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getOrgCategory() {
    return orgCategory;
  }

  public BulletRequirement setOrgCategory(String orgCategory) {
    this.orgCategory = orgCategory;
    return this;
  }

  public String getMajorType() {
    return majorType;
  }

  public BulletRequirement setMajorType(String majorType) {
    this.majorType = majorType;
    return this;
  }

  public String getOrdnanceType() {
    return ordnanceType;
  }

  public BulletRequirement setOrdnanceType(String ordnanceType) {
    this.ordnanceType = ordnanceType;
    return this;
  }

  public String getRankL1() {
    return rankL1;
  }

  public BulletRequirement setRankL1(String rankL1) {
    this.rankL1 = rankL1;
    return this;
  }

  public int getQuota() {
    return quota;
  }

  public BulletRequirement setQuota(int quota) {
    this.quota = quota;
    return this;
  }

  public String getUnitType() {
    return unitType;
  }

  public BulletRequirement setUnitType(String unitType) {
    this.unitType = unitType;
    return this;
  }

  public String getNumType() {
    return numType;
  }

  public BulletRequirement setNumType(String numType) {
    this.numType = numType;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
