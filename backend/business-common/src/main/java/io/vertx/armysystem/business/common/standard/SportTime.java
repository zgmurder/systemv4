package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 体育课目训练时间参考表
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class SportTime {
  private String id;
  private String standardId;      // 大纲标准ID
  private String sportCategory;   // 体育科目分类
  private String physicalLevel;   // 体能训练等级
  private int hours;              // 时间要求

  public SportTime() {
    // Empty constructor
  }

  public SportTime(JsonObject json) {
//    CourseTimeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
//    CourseTimeConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public SportTime setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public SportTime setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getSportCategory() {
    return sportCategory;
  }

  public SportTime setSportCategory(String sportCategory) {
    this.sportCategory = sportCategory;
    return this;
  }

  public String getPhysicalLevel() {
    return physicalLevel;
  }

  public SportTime setPhysicalLevel(String physicalLevel) {
    this.physicalLevel = physicalLevel;
    return this;
  }

  public int getHours() {
    return hours;
  }

  public SportTime setHours(int hours) {
    this.hours = hours;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
