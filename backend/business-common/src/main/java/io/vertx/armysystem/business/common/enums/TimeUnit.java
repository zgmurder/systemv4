package io.vertx.armysystem.business.common.enums;

public enum TimeUnit {
  Daily("每日"),
  Weekly("每周"),
  Monthly("每月"),
  Quarterly("每季度"),
  Yearly("每年");

  private String value;
  TimeUnit(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
