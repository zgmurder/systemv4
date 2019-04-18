package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 武警部队军兵种类型，比如地面人员/空勤人员/船艇人员
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TroopCategory {
  private String id;
  private String name;
  private int order;

  public TroopCategory() {
    // Empty constructor
  }

  public TroopCategory(JsonObject json) {
    TroopCategoryConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TroopCategoryConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public TroopCategory setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public TroopCategory setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public TroopCategory setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
