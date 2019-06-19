package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 会操课目规则
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class CompetitionRule {
  private String id;
  private String standardId;                // 大纲标准ID
  private String sectionId;                 // 大纲分册ID
  private String courseId;                  // 课目对象ID
  private List<String> orgCategories;       // 适用的单位分类列表
  private int times;                        // 安排次数
  private Boolean hoursEnabled;                 // 课时间隔数
  private int hours;                        // hoursEnabled=true时有效

  public CompetitionRule() {
    // Empty constructor
  }

  public CompetitionRule(JsonObject json) {
    CompetitionRuleConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    CompetitionRuleConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public CompetitionRule setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public CompetitionRule setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getSectionId() {
    return sectionId;
  }

  public CompetitionRule setSectionId(String sectionId) {
    this.sectionId = sectionId;
    return this;
  }

  public String getCourseId() {
    return courseId;
  }

  public CompetitionRule setCourseId(String courseId) {
    this.courseId = courseId;
    return this;
  }

  public List<String> getOrgCategories() {
    return orgCategories;
  }

  public CompetitionRule setOrgCategories(List<String> orgCategories) {
    this.orgCategories = orgCategories;
    return this;
  }

  public int getTimes() {
    return times;
  }

  public CompetitionRule setTimes(int times) {
    this.times = times;
    return this;
  }

  public Boolean getHoursEnabled() {
    return hoursEnabled;
  }

  public CompetitionRule setHoursEnabled(Boolean hoursEnabled) {
    this.hoursEnabled = hoursEnabled;
    return this;
  }

  public int getHours() {
    return hours;
  }

  public CompetitionRule setHours(int hours) {
    this.hours = hours;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
