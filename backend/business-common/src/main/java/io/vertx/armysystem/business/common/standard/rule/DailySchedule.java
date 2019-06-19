package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 每日作息时间
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class DailySchedule {
  private String id;
  private String orgCategory;       // 单位分类
  private Double eMorning;          // 早操课时数
  private Double morning;           // 上午课时数
  private Double afternoon;         // 下午课时数(包含体能训练时间)
  private Double night;             // 夜训课时数
  private Double sport;             // 下午体能训练课时数

  public DailySchedule() {
    // Empty constructor
  }

  public DailySchedule(JsonObject json) {
    DailyScheduleConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    DailyScheduleConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public DailySchedule setId(String id) {
    this.id = id;
    return this;
  }

  public String getOrgCategory() {
    return orgCategory;
  }

  public DailySchedule setOrgCategory(String orgCategory) {
    this.orgCategory = orgCategory;
    return this;
  }

  public Double geteMorning() {
    return eMorning;
  }

  public DailySchedule seteMorning(Double eMorning) {
    this.eMorning = eMorning;
    return this;
  }

  public Double getMorning() {
    return morning;
  }

  public DailySchedule setMorning(Double morning) {
    this.morning = morning;
    return this;
  }

  public Double getAfternoon() {
    return afternoon;
  }

  public DailySchedule setAfternoon(Double afternoon) {
    this.afternoon = afternoon;
    return this;
  }

  public Double getNight() {
    return night;
  }

  public DailySchedule setNight(Double night) {
    this.night = night;
    return this;
  }

  public Double getSport() {
    return sport;
  }

  public DailySchedule setSport(Double sport) {
    this.sport = sport;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
