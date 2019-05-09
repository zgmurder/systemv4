package io.vertx.armysystem.business.common.enums;

/**
 * 武警部队编制序列
 *
 * @author Derek Zheng
 */
public enum OrgSequence {
  Army(1, "总部", "部队"),
  Division(2, "总队", "部队"),
  Brigade(3, "旅级支队", "部队"),
  Regiment(4, "团级支队", "部队"),
  Battalion(5, "大队", "分队"),
  Company(6, "中队", "分队"),
  Platoon(7, "排", "分队"),
  Class(8, "班", "分队"),
  Team(9, "小队", "分队"),
  Soldier(10, "单兵", "人员");


  private int value;
  private String name;
  private String description;

  OrgSequence(int value, String name, String description) {
    this.value = value;
    this.name = name;
    this.description = description;
  }

  public int getValue() {
    return value;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }
}
