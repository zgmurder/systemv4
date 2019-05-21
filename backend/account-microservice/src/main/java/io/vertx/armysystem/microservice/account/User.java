package io.vertx.armysystem.microservice.account;

import io.vertx.armysystem.business.common.resource.Organization;
import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * User data object
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class User {
  private String id;
  private String username;
  private String password;
  private boolean buildIn;
  private String roleName;
  private int roleLevel;
  private String organizationId;

  private String phone;
  private String email;
  private String firstName;
  private String lastName;
  private String description;

  private Long createdTime;
  private Long updatedTime;

  public User() {
    // Empty constructor
  }

  public User(JsonObject json) { UserConverter.fromJson(json, this); }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    UserConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public User setId(String id) {
    this.id = id;
    return this;
  }

  public String getUsername() { return username; }

  public User setUsername(String username) {
    this.username = username;
    return this;
  }

  public String getPassword() { return password; }

  public User setPassword(String password) {
    this.password = password;
    return this;
  }

  public boolean isBuildIn() { return buildIn; }

  public User setBuildIn(boolean buildIn) {
    this.buildIn = buildIn;
    return this;
  }

  public String getRoleName() {
    return roleName;
  }

  public User setRoleName(String roleName) {
    this.roleName = roleName;
    return this;
  }

  public int getRoleLevel() {
    return roleLevel;
  }

  public User setRoleLevel(int roleLevel) {
    this.roleLevel = roleLevel;
    return this;
  }

  public String getOrganizationId() {
    return organizationId;
  }

  public User setOrganizationId(String organizationId) {
    this.organizationId = organizationId;
    return this;
  }

  public String getPhone() { return phone; }

  public User setPhone(String phone) {
    this.phone = phone;
    return this;
  }

  public String getEmail() { return email; }

  public User setEmail(String email) {
    this.email = email;
    return this;
  }

  public String getFirstName() { return firstName; }

  public User setFirstName(String firstName) {
    this.firstName = firstName;
    return this;
  }

  public String getLastName() {  return lastName; }

  public User setLastName(String lastName) {
    this.lastName = lastName;
    return this;
  }

  public String getFullName() {
    if (firstName != null && lastName != null)
      return firstName + lastName;
    else
      return null;
  }

  public String getDescription() { return description; }

  public User setDescription(String description) {
    this.description = description;
    return this;
  }

  public Long getCreatedTime() { return createdTime; }

  public User setCreatedTime(Long createdTime) {
    this.createdTime = createdTime;
    return this;
  }

  public Long getUpdatedTime() { return updatedTime; }

  public User setUpdatedTime(Long updatedTime) {
    this.updatedTime = updatedTime;
    return this;
  }

  @Override
  public String toString() { return toJson().encodePrettily(); }
}
