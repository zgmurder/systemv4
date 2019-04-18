package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 军械类型定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class OrdnanceType {
  private String id;
  private String name;
  private String category;        // 军械分类，参考OrdnanceCategory, 分为武器、弹药、物资
  private String weaponUnit;      // 武器计量单位
  private String bulletUnit;      // 对应弹药/物资计量单位
  private int order;

  public OrdnanceType() {
    // Empty constructor
  }

  public OrdnanceType(JsonObject json) {
    OrdnanceTypeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    OrdnanceTypeConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public OrdnanceType setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public OrdnanceType setName(String name) {
    this.name = name;
    return this;
  }

  public String getCategory() {
    return category;
  }

  public OrdnanceType setCategory(String category) {
    this.category = category;
    return this;
  }

  public String getWeaponUnit() {
    return weaponUnit;
  }

  public OrdnanceType setWeaponUnit(String weaponUnit) {
    this.weaponUnit = weaponUnit;
    return this;
  }

  public String getBulletUnit() {
    return bulletUnit;
  }

  public OrdnanceType setBulletUnit(String bulletUnit) {
    this.bulletUnit = bulletUnit;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public OrdnanceType setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
