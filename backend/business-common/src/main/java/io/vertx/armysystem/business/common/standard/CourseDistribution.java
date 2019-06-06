package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 课目配当表定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class CourseDistribution {
  private String id;
  private String courseId;                  // 军事课目ID
  private String standardId;                // 大纲标准ID
  private String sectionId;                 // 大纲分册ID
  private List<String> orgCategories;       // 课目适用的单位分类列表
  private List<String> personProperties;    // 课目适用的人员属性列表
  private String serviceReq;                // 勤务类型(可选)
  private String task;                      // 训练任务
  private List<String> subjects;            // 训练课题列表

  public CourseDistribution() {
    // Empty constructor
  }

  public CourseDistribution(JsonObject json) {
//    CourseDistributionConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
//    CourseDistributionConverter.toJson(this, json);
    return json;
  }


  public String getId() {
    return id;
  }

  public CourseDistribution setId(String id) {
    this.id = id;
    return this;
  }

  public String getCourseId() {
    return courseId;
  }

  public CourseDistribution setCourseId(String courseId) {
    this.courseId = courseId;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public CourseDistribution setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getSectionId() {
    return sectionId;
  }

  public CourseDistribution setSectionId(String sectionId) {
    this.sectionId = sectionId;
    return this;
  }

  public List<String> getOrgCategories() {
    return orgCategories;
  }

  public CourseDistribution setOrgCategories(List<String> orgCategories) {
    this.orgCategories = orgCategories;
    return this;
  }

  public List<String> getPersonProperties() {
    return personProperties;
  }

  public CourseDistribution setPersonProperties(List<String> personProperties) {
    this.personProperties = personProperties;
    return this;
  }

  public String getServiceReq() {
    return serviceReq;
  }

  public CourseDistribution setServiceReq(String serviceReq) {
    this.serviceReq = serviceReq;
    return this;
  }

  public String getTask() {
    return task;
  }

  public CourseDistribution setTask(String task) {
    this.task = task;
    return this;
  }

  public List<String> getSubjects() {
    return subjects;
  }

  public CourseDistribution setSubjects(List<String> subjects) {
    this.subjects = subjects;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
