package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 全局课目规则(针对非军事课目)
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class CourseRule {
  private String id;
  private String standardId;                // 大纲标准ID
  private String courseId;                  // 课目对象ID
  private List<String> orgCategories;       // 适用的单位分类列表
  private List<String> forbiddenWeathers;   // 禁训天气
  private Boolean rateEnabled;              // 频率设置是否有效
  private String rateUnit;                  // 每周/每月，参考TimeUnit
  private int times;                        // 次数
  private Boolean totalEnabled;             // 总次数有效
  private int totalTimes;                   // 总次数
  private String preRuleId;                 // 前置课目规则ID
  private List<ChildRule> childRules;       // 子训练规则设置

  public CourseRule() {
    // Empty constructor
  }

  public CourseRule(JsonObject json) {
    CourseRuleConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    CourseRuleConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public CourseRule setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public CourseRule setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getCourseId() {
    return courseId;
  }

  public CourseRule setCourseId(String courseId) {
    this.courseId = courseId;
    return this;
  }

  public List<String> getOrgCategories() {
    return orgCategories;
  }

  public CourseRule setOrgCategories(List<String> orgCategories) {
    this.orgCategories = orgCategories;
    return this;
  }

  public List<String> getForbiddenWeathers() {
    return forbiddenWeathers;
  }

  public CourseRule setForbiddenWeathers(List<String> forbiddenWeathers) {
    this.forbiddenWeathers = forbiddenWeathers;
    return this;
  }

  public Boolean getRateEnabled() {
    return rateEnabled;
  }

  public CourseRule setRateEnabled(Boolean rateEnabled) {
    this.rateEnabled = rateEnabled;
    return this;
  }

  public String getRateUnit() {
    return rateUnit;
  }

  public CourseRule setRateUnit(String rateUnit) {
    this.rateUnit = rateUnit;
    return this;
  }

  public int getTimes() {
    return times;
  }

  public CourseRule setTimes(int times) {
    this.times = times;
    return this;
  }

  public Boolean getTotalEnabled() {
    return totalEnabled;
  }

  public CourseRule setTotalEnabled(Boolean totalEnabled) {
    this.totalEnabled = totalEnabled;
    return this;
  }

  public int getTotalTimes() {
    return totalTimes;
  }

  public CourseRule setTotalTimes(int totalTimes) {
    this.totalTimes = totalTimes;
    return this;
  }

  public String getPreRuleId() {
    return preRuleId;
  }

  public CourseRule setPreRuleId(String preRuleId) {
    this.preRuleId = preRuleId;
    return this;
  }

  public List<ChildRule> getChildRules() {
    return childRules;
  }

  public CourseRule setChildRules(List<ChildRule> childRules) {
    this.childRules = childRules;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
