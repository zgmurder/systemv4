package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

/**
 * 枪手类型
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class GunnerType {
  private String id;
  private String name;
  private List<String> gunTypes = new ArrayList<>();
  private int order;

  public GunnerType() {
    // Empty constructor
  }

  public GunnerType(JsonObject json) {
    GunnerTypeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    GunnerTypeConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public GunnerType setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public GunnerType setName(String name) {
    this.name = name;
    return this;
  }

  public List<String> getGunTypes() {
    return gunTypes;
  }

  public GunnerType setGunTypes(List<String> gunTypes) {
    this.gunTypes = gunTypes;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public GunnerType setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
