package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 摩托飞行小时消耗要求
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class MotorRequirement {
  private String id;
  private String standardId;
  private String orgCategory;     // 单位分类
  private String motorType;       // 专业类型
  private int quota;              // 数量配额: 训练小时数要求或行车里程数
  private String unitType;        // 计量单位

  public MotorRequirement() {
    // Empty constructor
  }

  public MotorRequirement(JsonObject json) {
    MotorRequirementConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    MotorRequirementConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public MotorRequirement setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public MotorRequirement setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getOrgCategory() {
    return orgCategory;
  }

  public MotorRequirement setOrgCategory(String orgCategory) {
    this.orgCategory = orgCategory;
    return this;
  }

  public String getMotorType() {
    return motorType;
  }

  public MotorRequirement setMotorType(String motorType) {
    this.motorType = motorType;
    return this;
  }

  public int getQuota() {
    return quota;
  }

  public MotorRequirement setQuota(int quota) {
    this.quota = quota;
    return this;
  }

  public String getUnitType() {
    return unitType;
  }

  public MotorRequirement setUnitType(String unitType) {
    this.unitType = unitType;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
