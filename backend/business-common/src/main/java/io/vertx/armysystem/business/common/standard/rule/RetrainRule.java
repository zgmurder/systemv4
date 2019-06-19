package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 复训课目规则
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class RetrainRule {
  private String id;
  private String standardId;                // 大纲标准ID
  private String sectionId;                 // 大纲分册ID
  private String courseId;                  // 课目对象ID
  private List<String> orgCategories;       // 适用的单位分类列表
  private int sequence;                   // 复训安排顺序
  private int hours;                      // 每次安排的课时数
  private int weight;                     // 安排课时权重

  public RetrainRule() {
    // Empty constructor
  }

  public RetrainRule(JsonObject json) {
    RetrainRuleConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    RetrainRuleConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public RetrainRule setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public RetrainRule setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getSectionId() {
    return sectionId;
  }

  public RetrainRule setSectionId(String sectionId) {
    this.sectionId = sectionId;
    return this;
  }

  public String getCourseId() {
    return courseId;
  }

  public RetrainRule setCourseId(String courseId) {
    this.courseId = courseId;
    return this;
  }

  public List<String> getOrgCategories() {
    return orgCategories;
  }

  public RetrainRule setOrgCategories(List<String> orgCategories) {
    this.orgCategories = orgCategories;
    return this;
  }

  public int getSequence() {
    return sequence;
  }

  public RetrainRule setSequence(int sequence) {
    this.sequence = sequence;
    return this;
  }

  public int getHours() {
    return hours;
  }

  public RetrainRule setHours(int hours) {
    this.hours = hours;
    return this;
  }

  public int getWeight() {
    return weight;
  }

  public RetrainRule setWeight(int weight) {
    this.weight = weight;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
