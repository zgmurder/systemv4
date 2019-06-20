package io.vertx.armysystem.business.common.resource;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 教练员表定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class Trainer {
  private String id;
  private String soldierId;               // 关联人员
  private String organizationId;          // 关联单位
  private String level;                   // 教练员等级
  private Long startedAt;                 // 提升为教练员的日期
  private List<String> availableCourses;  // 主教课目列表
  private List<String> assistCourses;     // 备教课目列表

  private Long createdTime;
  private Long updatedTime;

  public Trainer() {
    // Empty constructor
  }

  public Trainer(JsonObject json) {
    TrainerConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TrainerConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public Trainer setId(String id) {
    this.id = id;
    return this;
  }

  public String getSoldierId() {
    return soldierId;
  }

  public Trainer setSoldierId(String soldierId) {
    this.soldierId = soldierId;
    return this;
  }

  public String getOrganizationId() {
    return organizationId;
  }

  public Trainer setOrganizationId(String organizationId) {
    this.organizationId = organizationId;
    return this;
  }

  public String getLevel() {
    return level;
  }

  public Trainer setLevel(String level) {
    this.level = level;
    return this;
  }

  public Long getStartedAt() {
    return startedAt;
  }

  public Trainer setStartedAt(Long startedAt) {
    this.startedAt = startedAt;
    return this;
  }

  public List<String> getAvailableCourses() {
    return availableCourses;
  }

  public Trainer setAvailableCourses(List<String> availableCourses) {
    this.availableCourses = availableCourses;
    return this;
  }

  public List<String> getAssistCourses() {
    return assistCourses;
  }

  public Trainer setAssistCourses(List<String> assistCourses) {
    this.assistCourses = assistCourses;
    return this;
  }

  public Long getCreatedTime() {
    return createdTime;
  }

  public Trainer setCreatedTime(Long createdTime) {
    this.createdTime = createdTime;
    return this;
  }

  public Long getUpdatedTime() {
    return updatedTime;
  }

  public Trainer setUpdatedTime(Long updatedTime) {
    this.updatedTime = updatedTime;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
