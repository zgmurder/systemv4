package io.vertx.armysystem.business.common.resource;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * AdvancedPersonInfo data object
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class AdvancedPersonInfo {
  private String phoneNum;        // 联系电话
  private String bloodType;       // 血型
  private String nationality;     // 国籍，默认中国
  private String fromCity;        // 籍贯
  private String currentCity;     // 户口所在地
  private String highestDegree;   // 最高学历
  private String graduatedSchool; // 毕业院校
  private String graduatedMajor;  // 毕业专业
  private String graduatedAt;     // 毕业日期

  public AdvancedPersonInfo() {
    // Empty constructor
  }

  public AdvancedPersonInfo(JsonObject json) {
    AdvancedPersonInfoConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    AdvancedPersonInfoConverter.toJson(this, json);
    return json;
  }

  public String getPhoneNum() {
    return phoneNum;
  }

  public AdvancedPersonInfo setPhoneNum(String phoneNum) {
    this.phoneNum = phoneNum;
    return this;
  }

  public String getBloodType() {
    return bloodType;
  }

  public AdvancedPersonInfo setBloodType(String bloodType) {
    this.bloodType = bloodType;
    return this;
  }

  public String getNationality() {
    return nationality;
  }

  public AdvancedPersonInfo setNationality(String nationality) {
    this.nationality = nationality;
    return this;
  }

  public String getFromCity() {
    return fromCity;
  }

  public AdvancedPersonInfo setFromCity(String fromCity) {
    this.fromCity = fromCity;
    return this;
  }

  public String getCurrentCity() {
    return currentCity;
  }

  public AdvancedPersonInfo setCurrentCity(String currentCity) {
    this.currentCity = currentCity;
    return this;
  }

  public String getHighestDegree() {
    return highestDegree;
  }

  public AdvancedPersonInfo setHighestDegree(String highestDegree) {
    this.highestDegree = highestDegree;
    return this;
  }

  public String getGraduatedSchool() {
    return graduatedSchool;
  }

  public AdvancedPersonInfo setGraduatedSchool(String graduatedSchool) {
    this.graduatedSchool = graduatedSchool;
    return this;
  }

  public String getGraduatedMajor() {
    return graduatedMajor;
  }

  public AdvancedPersonInfo setGraduatedMajor(String graduatedMajor) {
    this.graduatedMajor = graduatedMajor;
    return this;
  }

  public String getGraduatedAt() {
    return graduatedAt;
  }

  public AdvancedPersonInfo setGraduatedAt(String graduatedAt) {
    this.graduatedAt = graduatedAt;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
