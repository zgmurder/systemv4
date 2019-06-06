package io.vertx.armysystem.business.common.enums;

public enum CourseCategory {
  Train(0, "军事课目"),
  Sport(1, "体育课目"),
  Politics(2, "政治教育"),
  Activity(3, "党团活动"),
  Others(4, "其它工作"),
  Custom(5, "自定义课目");

  private int value;
  private String name;

  CourseCategory(int value, String name) {
    this.value = value;
    this.name = name;
  }

  public int getValue() {
    return value;
  }

  public String getName() {
    return name;
  }
}
