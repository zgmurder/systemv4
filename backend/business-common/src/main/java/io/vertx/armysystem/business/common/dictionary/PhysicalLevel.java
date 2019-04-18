package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 武警部队体能训练等级，(比如一类人员/二类人员/三类人员/新兵)
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class PhysicalLevel {
  private String id;
  private String name;
  private int order;

  public PhysicalLevel() {
    // Empty constructor
  }

  public PhysicalLevel(JsonObject json) {
    PhysicalLevelConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    PhysicalLevelConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public PhysicalLevel setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public PhysicalLevel setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public PhysicalLevel setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
