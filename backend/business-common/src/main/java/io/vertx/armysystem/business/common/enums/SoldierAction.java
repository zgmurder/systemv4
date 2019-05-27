package io.vertx.armysystem.business.common.enums;

public enum SoldierAction {
  NewRecruit("新兵入伍"),
  InitialRegister("初始登记"),
  PositionChange("职务调整"),
  RankChange("军衔升级"),
  OrganizationChange("单位调动"),
  SoldierRetire("军人退役"),
  TemporaryStudy("暂离深造");

  private String name;

  SoldierAction(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
