package io.vertx.armysystem.business.common.enums;

public enum ScoreLevel {
  NoScore(0),       // 未参考
  Unpass(1),        // 不合格或不及格
  Pass(2),          // 合格或及格
  Good(3),          // 良好
  Excellent(4),     // 优秀
  ExtraL3(5),       // 特三级
  ExtraL2(6),       // 特二级
  ExtraL1(7);       // 特一级

  private int value;

  ScoreLevel(int value) {
    this.value = value;
  }

  public int getValue() {
    return value;
  }
}
