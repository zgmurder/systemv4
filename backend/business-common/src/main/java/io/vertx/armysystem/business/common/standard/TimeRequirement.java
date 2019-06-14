package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 八落实训练时间要求
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TimeRequirement {
  private String id;
  private String standardId;
  private String orgCategory;       // 单位分类
  private String personProperty;    // 人员属性分类
  private Double months;               // 年度训练月数
  private Double days;                 // 年度训练天数
  private Double hours;                // 年度训练小时数
  private Double daysPerMonth;          // 月度训练天数
  private Double daysPerWeek;           // 每周训练天数
  private Double hoursPerDay;           // 每天训练小时数
  private Double hoursAtNight;          // 年度夜训小时数
  private Double rateAtNight;           // 年度夜巡比率
  private Double flexibleDays;          // 机动天数

  public TimeRequirement() {
    // Empty constructor
  }

  public TimeRequirement(JsonObject json) {
    TimeRequirementConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TimeRequirementConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public TimeRequirement setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public TimeRequirement setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getOrgCategory() {
    return orgCategory;
  }

  public TimeRequirement setOrgCategory(String orgCategory) {
    this.orgCategory = orgCategory;
    return this;
  }

  public String getPersonProperty() {
    return personProperty;
  }

  public TimeRequirement setPersonProperty(String personProperty) {
    this.personProperty = personProperty;
    return this;
  }

  public Double getMonths() {
    return months;
  }

  public TimeRequirement setMonths(Double months) {
    this.months = months;
    return this;
  }

  public Double getDays() {
    return days;
  }

  public TimeRequirement setDays(Double days) {
    this.days = days;
    return this;
  }

  public Double getHours() {
    return hours;
  }

  public TimeRequirement setHours(Double hours) {
    this.hours = hours;
    return this;
  }

  public Double getDaysPerMonth() {
    return daysPerMonth;
  }

  public TimeRequirement setDaysPerMonth(Double daysPerMonth) {
    this.daysPerMonth = daysPerMonth;
    return this;
  }

  public Double getDaysPerWeek() {
    return daysPerWeek;
  }

  public TimeRequirement setDaysPerWeek(Double daysPerWeek) {
    this.daysPerWeek = daysPerWeek;
    return this;
  }

  public Double getHoursPerDay() {
    return hoursPerDay;
  }

  public TimeRequirement setHoursPerDay(Double hoursPerDay) {
    this.hoursPerDay = hoursPerDay;
    return this;
  }

  public Double getHoursAtNight() {
    return hoursAtNight;
  }

  public TimeRequirement setHoursAtNight(Double hoursAtNight) {
    this.hoursAtNight = hoursAtNight;
    return this;
  }

  public Double getRateAtNight() {
    return rateAtNight;
  }

  public TimeRequirement setRateAtNight(Double rateAtNight) {
    this.rateAtNight = rateAtNight;
    return this;
  }

  public Double getFlexibleDays() {
    return flexibleDays;
  }

  public TimeRequirement setFlexibleDays(Double flexibleDays) {
    this.flexibleDays = flexibleDays;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
