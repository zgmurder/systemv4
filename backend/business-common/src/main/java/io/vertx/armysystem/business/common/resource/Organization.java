package io.vertx.armysystem.business.common.resource;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Organization data object
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class Organization {
  private String id;
  private String name;
  private String displayName;
  private int nodeCode;
  private String orgCode;
  private String parentId;
//  private String divisionId;
  private List<String> parentIds = new ArrayList<>();
//  private List<String> childrenIds = new ArrayList<>();
  private int childCount;
  private int orgSequence;
  private String orgType;
  private String orgCategory;
  private String orgProperty;
  private String serviceType;
  private List<String> orgMajors;
  private Boolean important;
  private String specialMission;
  private int planSodierCount;
  private String address;
  private Double longitude;   // 经度
  private Double latitude;    // 维度
  private Double altitude;    // 海拔高度

  private Boolean deactivated;  // 失效标志
  private Long deactivatedAt;   // 失效时间

  private Long createdTime;
  private Long updatedTime;

  public Organization() {
    // Empty constructor
  }

  public Organization(JsonObject json) {
    OrganizationConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    OrganizationConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public Organization setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public Organization setName(String name) {
    this.name = name;
    return this;
  }

  public String getDisplayName() {
    return displayName;
  }

  public Organization setDisplayName(String displayName) {
    this.displayName = displayName;
    return this;
  }

  public int getNodeCode() {
    return nodeCode;
  }

  public Organization setNodeCode(int nodeCode) {
    this.nodeCode = nodeCode;
    return this;
  }

  public String getOrgCode() {
    return orgCode;
  }

  public Organization setOrgCode(String orgCode) {
    this.orgCode = orgCode;
    return this;
  }

  public String getParentId() {
    return parentId;
  }

  public Organization setParentId(String parentId) {
    this.parentId = parentId;
    return this;
  }

//  public String getDivisionId() {
//    return divisionId;
//  }
//
//  public Organization setDivisionId(String divisionId) {
//    this.divisionId = divisionId;
//    return this;
//  }

  public List<String> getParentIds() {
    return parentIds;
  }

  public Organization setParentIds(List<String> parentIds) {
    this.parentIds = parentIds;
    return this;
  }

//  public List<String> getChildrenIds() {
//    return childrenIds;
//  }
//
//  public Organization setChildrenIds(List<String> childrenIds) {
//    this.childrenIds = childrenIds;
//    return this;
//  }

  public int getChildCount() {
    return childCount;
  }

  public Organization setChildCount(int childCount) {
    this.childCount = childCount;
    return this;
  }

  public int getOrgSequence() {
    return orgSequence;
  }

  public Organization setOrgSequence(int orgSequence) {
    this.orgSequence = orgSequence;
    return this;
  }

  public String getOrgType() {
    return orgType;
  }

  public Organization setOrgType(String orgType) {
    this.orgType = orgType;
    return this;
  }

  public String getOrgCategory() {
    return orgCategory;
  }

  public Organization setOrgCategory(String orgCategory) {
    this.orgCategory = orgCategory;
    return this;
  }

  public String getOrgProperty() {
    return orgProperty;
  }

  public Organization setOrgProperty(String orgProperty) {
    this.orgProperty = orgProperty;
    return this;
  }

  public String getServiceType() {
    return serviceType;
  }

  public Organization setServiceType(String serviceType) {
    this.serviceType = serviceType;
    return this;
  }

  public List<String> getOrgMajors() {
    return orgMajors;
  }

  public Organization setOrgMajors(List<String> orgMajor) {
    this.orgMajors = orgMajor;
    return this;
  }

  public Boolean getImportant() {
    return important;
  }

  public Organization setImportant(Boolean important) {
    this.important = important;
    return this;
  }

//  public Boolean getDeleted() {
//    return deleted;
//  }
//
//  public Organization setDeleted(Boolean deleted) {
//    this.deleted = deleted;
//    return this;
//  }

  public String getSpecialMission() {
    return specialMission;
  }

  public Organization setSpecialMission(String specialMission) {
    this.specialMission = specialMission;
    return this;
  }

  public String getAddress() {
    return address;
  }

  public Organization setAddress(String address) {
    this.address = address;
    return this;
  }

  public int getPlanSodierCount() {
    return planSodierCount;
  }

  public Organization setPlanSodierCount(int planSodierCount) {
    this.planSodierCount = planSodierCount;
    return this;
  }

  public Double getLongitude() {
    return longitude;
  }

  public Organization setLongitude(Double longitude) {
    this.longitude = longitude;
    return this;
  }

  public Double getLatitude() {
    return latitude;
  }

  public Organization setLatitude(Double latitude) {
    this.latitude = latitude;
    return this;
  }

  public Double getAltitude() {
    return altitude;
  }

  public Organization setAltitude(Double altitude) {
    this.altitude = altitude;
    return this;
  }

  public Boolean getDeactivated() {
    return deactivated;
  }

  public Organization setDeactivated(Boolean deactivated) {
    this.deactivated = deactivated;
    return this;
  }

    public Long getDeactivatedAt() {
    return deactivatedAt;
  }

  public Organization setDeactivatedAt(Long deactivatedAt) {
    this.deactivatedAt = deactivatedAt;
    return this;
  }

  public Long getCreatedTime() {
    return createdTime;
  }

  public Organization setCreatedTime(Long createdTime) {
    this.createdTime = createdTime;
    return this;
  }

  public Long getUpdatedTime() {
    return updatedTime;
  }

  public Organization setUpdatedTime(Long updatedTime) {
    this.updatedTime = updatedTime;
    return this;
  }

  @Override
  public String toString() { return toJson().encodePrettily(); }
}
