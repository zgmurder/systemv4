package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 体育通用训练课目考核要求表
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class RequiredSportCourse {
  private String id;
  private String courseId;
  private String standardId;
  private List<String> physicalLevels;    // 体能训练等级列表
  private List<String> troopCategories;   // 军兵种类型列表
  private List<String> genders;           // 性别要求列表(男/女)
  private Boolean isCivilServant;         // 是否适用于文职人员
  private Boolean isAgeEnabled;           // 是否启用年龄条件
  private int fromAge;                    // 年龄条件
  private int toAge;

  public RequiredSportCourse() {
    // Empty constructor
  }

  public RequiredSportCourse(JsonObject json) {
    RequiredSportCourseConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    RequiredSportCourseConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public RequiredSportCourse setId(String id) {
    this.id = id;
    return this;
  }

  public String getCourseId() {
    return courseId;
  }

  public RequiredSportCourse setCourseId(String courseId) {
    this.courseId = courseId;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public RequiredSportCourse setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public List<String> getPhysicalLevels() {
    return physicalLevels;
  }

  public RequiredSportCourse setPhysicalLevels(List<String> physicalLevels) {
    this.physicalLevels = physicalLevels;
    return this;
  }

  public List<String> getTroopCategories() {
    return troopCategories;
  }

  public RequiredSportCourse setTroopCategories(List<String> troopCategories) {
    this.troopCategories = troopCategories;
    return this;
  }

  public List<String> getGenders() {
    return genders;
  }

  public RequiredSportCourse setGenders(List<String> genders) {
    this.genders = genders;
    return this;
  }

  public Boolean getCivilServant() {
    return isCivilServant;
  }

  public RequiredSportCourse setCivilServant(Boolean civilServant) {
    isCivilServant = civilServant;
    return this;
  }

  public Boolean getAgeEnabled() {
    return isAgeEnabled;
  }

  public RequiredSportCourse setAgeEnabled(Boolean ageEnabled) {
    isAgeEnabled = ageEnabled;
    return this;
  }

  public int getFromAge() {
    return fromAge;
  }

  public RequiredSportCourse setFromAge(int fromAge) {
    this.fromAge = fromAge;
    return this;
  }

  public int getToAge() {
    return toAge;
  }

  public RequiredSportCourse setToAge(int toAge) {
    this.toAge = toAge;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
