package io.vertx.armysystem.business.common.enums;

public enum TroopCategory {
  LandForce("地面人员"),
  AirForce("空勤人员"),
  BoatForce("船艇人员");

  private String name;

  TroopCategory(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
