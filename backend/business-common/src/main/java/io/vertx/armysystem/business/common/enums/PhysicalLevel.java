package io.vertx.armysystem.business.common.enums;

public enum PhysicalLevel {
  Level1("一类人员"),
  Level2("二类人员"),
  Level3("三类人员"),
  Recruit("新兵"),
  CivilServant("文职人员");

  private String name;

  PhysicalLevel(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
