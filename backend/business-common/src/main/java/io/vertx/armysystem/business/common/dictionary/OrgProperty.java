package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

/**
 * 武警部队单位属性，比如执勤、机动、工兵等
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class OrgProperty {
  private String id;
  private String name;
  private List<String> optionalMajors = new ArrayList<>();
  private int order;

  public OrgProperty() {
    // Empty constructor
  }

  public OrgProperty(JsonObject json) {
    OrgPropertyConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    OrgPropertyConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public OrgProperty setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public OrgProperty setName(String name) {
    this.name = name;
    return this;
  }

  public List<String> getOptionalMajors() {
    return optionalMajors;
  }

  public OrgProperty setOptionalMajors(List<String> optionalMajors) {
    this.optionalMajors = optionalMajors;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public OrgProperty setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
