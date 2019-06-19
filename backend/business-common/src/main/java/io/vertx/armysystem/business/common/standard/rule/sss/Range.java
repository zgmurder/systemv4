package io.vertx.armysystem.business.common.standard.rule.sss;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

@DataObject(generateConverter = true)
public class Range {
  private int from;
  private int to;

  public Range() {
    // Empty constructor
  }

  public Range(JsonObject json) {
    RangeConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    RangeConverter.toJson(this, json);
    return json;
  }

  public int getFrom() {
    return from;
  }

  public Range setFrom(int from) {
    this.from = from;
    return this;
  }

  public int getTo() {
    return to;
  }

  public Range setTo(int to) {
    this.to = to;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
