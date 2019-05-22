package io.vertx.armysystem.business.common.enums;

public enum InserviceStatus {
  InService(0, "服役中"),
  Retired(1, "已退役"),
  Transferred(2, "已调离"),
  TmpRemoved(3, "暂离深造");

  private int value;
  private String name;

  InserviceStatus(int value, String name) {
    this.value = value;
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public int getValue() {
    return value;
  }
}
