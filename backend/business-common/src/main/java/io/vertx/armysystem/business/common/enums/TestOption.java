package io.vertx.armysystem.business.common.enums;

public enum TestOption {
  Require("必考"),
  Optional("选考");

  private String value;
  TestOption(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
