package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 武警部队训练场地类型
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class PlaceType {
  private String id;
  private String name;
  private int order;

  public PlaceType() {
    // Empty constructor
  }

  public PlaceType(JsonObject json) {
    PlaceTypeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    PlaceTypeConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public PlaceType setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public PlaceType setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public PlaceType setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
