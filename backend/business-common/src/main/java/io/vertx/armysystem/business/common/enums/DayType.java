package io.vertx.armysystem.business.common.enums;

public enum DayType {
  Workday("工作日"),
  Weekend("休息日"),
  Holiday("节假日");

  private String value;
  DayType(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
