package io.vertx.armysystem.microservice.account;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Permission data object
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class Permission {
  private String schemaName;
  private List<Action> actions = new ArrayList<>();

  public Permission() {
    // Empty constructor
  }

  public Permission(JsonObject json) { PermissionConverter.fromJson(json, this); }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    PermissionConverter.toJson(this, json);
    return json;
  }

  public String getSchemaName() { return schemaName; }

  public Permission setSchemaName(String schemaName) {
    this.schemaName = schemaName;
    return this;
  }

  public List<Action> getActions() { return actions; }

  public Permission setActions(List<Action> actions) {
    this.actions = actions;
    return this;
  }

  @Override
  public String toString() { return toJson().encodePrettily(); }
}
