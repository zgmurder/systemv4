package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

/**
 * 武警部队单位分类，比如内卫总队执勤分队等
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class OrgCategory {
  private String id;
  private String name;
  private String orgType;                                         // 单位类型: 部队/分队/首长机关/部门

  private String orgProperty;                                     // 单位属性
  private List<String> optionalServices = new ArrayList<>();      // 单位勤务类型
  private List<TrainTask> optionalTasks = new ArrayList<>();      // 单位训练任务列表

  private List<String> optionalMajors = new ArrayList<>();        // 单位可选专业
  private String physicalLevel;                                   // 战士体能等级
  private String troopCategory;                                   // 军兵种类型，比如地面人员/空勤人员/船艇人员
  private int order;

  public OrgCategory() {
    // Empty constructor
  }

  public OrgCategory(JsonObject json) {
    OrgCategoryConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    OrgCategoryConverter.toJson(this, json);
    return json;
  }


  public String getId() {
    return id;
  }

  public OrgCategory setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public OrgCategory setName(String name) {
    this.name = name;
    return this;
  }

  public String getOrgType() {
    return orgType;
  }

  public OrgCategory setOrgType(String orgType) {
    this.orgType = orgType;
    return this;
  }

  public String getOrgProperty() {
    return orgProperty;
  }

  public OrgCategory setOrgProperty(String orgProperty) {
    this.orgProperty = orgProperty;
    return this;
  }

  public List<String> getOptionalServices() {
    return optionalServices;
  }

  public OrgCategory setOptionalServices(List<String> optionalServices) {
    this.optionalServices = optionalServices;
    return this;
  }

  public List<TrainTask> getOptionalTasks() {
    return optionalTasks;
  }

  public OrgCategory setOptionalTasks(List<TrainTask> optionalTasks) {
    this.optionalTasks = optionalTasks;
    return this;
  }

  public List<String> getOptionalMajors() {
    return optionalMajors;
  }

  public OrgCategory setOptionalMajors(List<String> optionalMajors) {
    this.optionalMajors = optionalMajors;
    return this;
  }

  public String getPhysicalLevel() {
    return physicalLevel;
  }

  public OrgCategory setPhysicalLevel(String physicalLevel) {
    this.physicalLevel = physicalLevel;
    return this;
  }

  public String getTroopCategory() {
    return troopCategory;
  }

  public OrgCategory setTroopCategory(String troopCategory) {
    this.troopCategory = troopCategory;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public OrgCategory setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
