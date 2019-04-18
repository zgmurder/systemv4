package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 天气类型
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class WeatherType {
  private String id;
  private String name;
  private int order;

  public WeatherType() {
    // Empty constructor
  }

  public WeatherType(JsonObject json) {
    WeatherTypeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    WeatherTypeConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public WeatherType setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public WeatherType setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public WeatherType setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
