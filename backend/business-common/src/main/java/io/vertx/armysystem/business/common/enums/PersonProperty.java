package io.vertx.armysystem.business.common.enums;

public enum PersonProperty {
  UnitForce("分队"),
  Officer("警官"),
  TechOfficer("技术警官"),
  Supporter("保障人员"),
  ReserveMember("预备队员"),
  Recruit("新兵"),
  RecruitOfficer("新训干部骨干");

  private String name;

  PersonProperty(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
