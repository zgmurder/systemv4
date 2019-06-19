package io.vertx.armysystem.business.common.standard.rule;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 全局课目规则中的子项
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class ChildRule {
  private int priority;           // 优先级: 0-10可选, 值越大优先级越高
  private List<Integer> months;   // 月份选择
  private List<Integer> weekSeqs; // 1-5, 表示每个月第几周, 5表示最后一周
  private String dayType;         // 工作日; 休息日; 节假日,参考DayType
  private List<Integer> weekdays;  // 星期一...星期日(0-6)，参考WeekDays
  private List<Integer> holidays; // 1-10表示节假日第几天, 255表示最后1天
  private String section;         // 时间段: 早操; 上午; 下午; 夜间; 不设置为无限制;参考DailySection
  private int fromHour;           // 开始课时
  private int hours;              // 持续课时

  public ChildRule() {
    // Empty constructor
  }

  public ChildRule(JsonObject json) {
    ChildRuleConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    ChildRuleConverter.toJson(this, json);
    return json;
  }

  public int getPriority() {
    return priority;
  }

  public ChildRule setPriority(int priority) {
    this.priority = priority;
    return this;
  }

  public List<Integer> getMonths() {
    return months;
  }

  public ChildRule setMonths(List<Integer> months) {
    this.months = months;
    return this;
  }

  public List<Integer> getWeekSeqs() {
    return weekSeqs;
  }

  public ChildRule setWeekSeqs(List<Integer> weekSeqs) {
    this.weekSeqs = weekSeqs;
    return this;
  }

  public String getDayType() {
    return dayType;
  }

  public ChildRule setDayType(String dayType) {
    this.dayType = dayType;
    return this;
  }

  public List<Integer> getWeekdays() {
    return weekdays;
  }

  public ChildRule setWeekdays(List<Integer> weekdays) {
    this.weekdays = weekdays;
    return this;
  }

  public List<Integer> getHolidays() {
    return holidays;
  }

  public ChildRule setHolidays(List<Integer> holidays) {
    this.holidays = holidays;
    return this;
  }

  public String getSection() {
    return section;
  }

  public ChildRule setSection(String section) {
    this.section = section;
    return this;
  }

  public int getFromHour() {
    return fromHour;
  }

  public ChildRule setFromHour(int fromHour) {
    this.fromHour = fromHour;
    return this;
  }

  public int getHours() {
    return hours;
  }

  public ChildRule setHours(int hours) {
    this.hours = hours;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
