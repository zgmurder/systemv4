package io.vertx.armysystem.business.common.enums;

public enum TrainOption {
  Require("必训"),
  Optional("选训"),
  Self("自训");

  private String value;
  TrainOption(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
