package io.vertx.armysystem.microservice.account;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Role data object
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class Role {
  private String id;
  private String roleName;
  private String displayName;
  private int level;
  private boolean buildIn;
  private String description;
  private Long createdTime;
  private Long updatedTime;

  private List<Permission> permissions = new ArrayList<>();

  public Role() {
    // Empty constructor
  }

  public Role(JsonObject json) { RoleConverter.fromJson(json, this);}

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    RoleConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public Role setId(String id) {
    this.id = id;
    return this;
  }

  public String getRoleName() {
    return roleName;
  }

  public Role setRoleName(String roleName) {
    this.roleName = roleName;
    return this;
  }

  public String getDisplayName() {
    return displayName;
  }

  public Role setDisplayName(String displayName) {
    this.displayName = displayName;
    return this;
  }

  public int getLevel() {
    return level;
  }

  public Role setLevel(int level) {
    this.level = level;
    return this;
  }

  public boolean isBuildIn() {
    return buildIn;
  }

  public Role setBuildIn(boolean buildIn) {
    this.buildIn = buildIn;
    return this;
  }

  public String getDescription() {
    return description;
  }

  public Role setDescription(String description) {
    this.description = description;
    return this;
  }

  public Long getCreatedTime() {
    return createdTime;
  }

  public Role setCreatedTime(Long createdTime) {
    this.createdTime = createdTime;
    return this;
  }

  public Long getUpdatedTime() {
    return updatedTime;
  }

  public Role setUpdatedTime(Long updatedTime) {
    this.updatedTime = updatedTime;
    return this;
  }

  public List<Permission> getPermissions() { return permissions; }

  public Role setPermissions(List<Permission> permissions) {
    this.permissions = permissions;
    return this;
  }

  @Override
  public String toString() { return toJson().encodePrettily(); }
}
