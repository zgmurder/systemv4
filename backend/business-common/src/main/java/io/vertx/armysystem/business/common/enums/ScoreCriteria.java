package io.vertx.armysystem.business.common.enums;

public enum ScoreCriteria {
  Level2("二级制"),
  Level4("四级制"),
  Level7("七级制"),
  NumberScore("百分制");

  private String name;

  ScoreCriteria(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
