package io.vertx.armysystem.business.common.enums;

public enum DailySection {
  EarlyMoring("早操"),
  Morning("上午"),
  Afternoon("下午"),
  Night("夜间"),
  Sport("体能");

  private String value;
  DailySection(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
