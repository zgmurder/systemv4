package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 体育课目分类
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class SportCategory {
  private String id;
  private String name;
  private int order;

  public SportCategory() {
    // Empty constructor
  }

  public SportCategory(JsonObject json) {
    SportCategoryConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    SportCategoryConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public SportCategory setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public SportCategory setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public SportCategory setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
