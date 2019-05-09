package io.vertx.armysystem.business.common.enums;

/**
 * 军械类型: 武器, 弹药, 物资
 *
 * @author Derek Zheng
 */
public enum OrdnanceCategory {
  Weapon("武器"),
  Bullet("弹药"),
  Material("物资");

  private String name;

  OrdnanceCategory(String name) {
    this.name = name;
  }


  public String getName() {
    return name;
  }
}
