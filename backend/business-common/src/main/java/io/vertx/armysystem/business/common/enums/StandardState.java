package io.vertx.armysystem.business.common.enums;

/**
 * 训练大纲标准启用状态
 *
 * @author Derek Zheng
 */
public enum StandardState {
  Initial(0),
  Activated(1),
  Stopped(2);

  private int value;

  StandardState(int value) {
    this.value = value;
  }

  public int getValue() {
    return value;
  }
}
