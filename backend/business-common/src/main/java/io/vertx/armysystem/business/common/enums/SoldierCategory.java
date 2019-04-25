package io.vertx.armysystem.business.common.enums;

public enum SoldierCategory {
  Officer("指挥警官"),
  TechOfficer("技术警官"),
  CivilServant("文职人员"),
  Sergeant("士官"),
  Soldier("义务兵");

  private String name;

  SoldierCategory(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
