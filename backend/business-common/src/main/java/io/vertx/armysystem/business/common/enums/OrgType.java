package io.vertx.armysystem.business.common.enums;

public enum OrgType {
  Troop("部队"),
  UnitForce("分队"),
  LeaderOffice("首长机关"),
  Department("部门");

  private String name;

  OrgType(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
