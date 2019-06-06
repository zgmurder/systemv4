package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 体育专项训练课目组
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class OptionalSportCourse {
  private String id;
  private String standardId;
  private List<String> courseIds;       // 体育课目列表，或者的关系
  private int groupId;                  // 课目组编号
  private int itemSeq;                  // 课目序号
  private String physicalLevel;         // 体能训练等级
  private String troopCategory;         // 军兵种类型
  private String gender;                // 性别要求

  public OptionalSportCourse() {
    // Empty constructor
  }

  public OptionalSportCourse(JsonObject json) {
//    OptionalSportCourseConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
//    OptionalSportCourseConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public OptionalSportCourse setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public OptionalSportCourse setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public List<String> getCourseIds() {
    return courseIds;
  }

  public OptionalSportCourse setCourseIds(List<String> courseIds) {
    this.courseIds = courseIds;
    return this;
  }

  public int getGroupId() {
    return groupId;
  }

  public OptionalSportCourse setGroupId(int groupId) {
    this.groupId = groupId;
    return this;
  }

  public int getItemSeq() {
    return itemSeq;
  }

  public OptionalSportCourse setItemSeq(int itemSeq) {
    this.itemSeq = itemSeq;
    return this;
  }

  public String getPhysicalLevel() {
    return physicalLevel;
  }

  public OptionalSportCourse setPhysicalLevel(String physicalLevel) {
    this.physicalLevel = physicalLevel;
    return this;
  }

  public String getTroopCategory() {
    return troopCategory;
  }

  public OptionalSportCourse setTroopCategory(String troopCategory) {
    this.troopCategory = troopCategory;
    return this;
  }

  public String getGender() {
    return gender;
  }

  public OptionalSportCourse setGender(String gender) {
    this.gender = gender;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
