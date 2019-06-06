package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 课目时间参考表定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class CourseTime {
  private String id;
  private List<String> courseIds;           // 训练课目ID列表
  private String standardId;                // 大纲标准ID
  private String sectionId;                 // 大纲分册ID
  private List<String> orgCategories;       // 课目适用的单位分类列表
  private List<String> personProperties;    // 课目适用的人员属性列表
  private List<String> tasks;               // 对应任务列表
  private List<String> serviceReqs;         // 勤务类型列表
  private String major;                     // 专业类型
  private int hoursInDay;                   // 昼训时间要求
  private int hoursAtNight;                 // 夜训时间要求

  public CourseTime() {
    // Empty constructor
  }

  public CourseTime(JsonObject json) {
    CourseTimeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    CourseTimeConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public List<String> getCourseIds() {
    return courseIds;
  }

  public void setCourseIds(List<String> courseIds) {
    this.courseIds = courseIds;
  }

  public String getStandardId() {
    return standardId;
  }

  public void setStandardId(String standardId) {
    this.standardId = standardId;
  }

  public String getSectionId() {
    return sectionId;
  }

  public void setSectionId(String sectionId) {
    this.sectionId = sectionId;
  }

  public List<String> getOrgCategories() {
    return orgCategories;
  }

  public void setOrgCategories(List<String> orgCategories) {
    this.orgCategories = orgCategories;
  }

  public List<String> getPersonProperties() {
    return personProperties;
  }

  public void setPersonProperties(List<String> personProperties) {
    this.personProperties = personProperties;
  }

  public List<String> getTasks() {
    return tasks;
  }

  public void setTasks(List<String> tasks) {
    this.tasks = tasks;
  }

  public List<String> getServiceReqs() {
    return serviceReqs;
  }

  public void setServiceReqs(List<String> serviceReqs) {
    this.serviceReqs = serviceReqs;
  }

  public String getMajor() {
    return major;
  }

  public void setMajor(String major) {
    this.major = major;
  }

  public int getHoursInDay() {
    return hoursInDay;
  }

  public void setHoursInDay(int hoursInDay) {
    this.hoursInDay = hoursInDay;
  }

  public int getHoursAtNight() {
    return hoursAtNight;
  }

  public void setHoursAtNight(int hoursAtNight) {
    this.hoursAtNight = hoursAtNight;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
