package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 训练大纲标准分册
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TrainSection {
  private String id;
  private String name;
  private String code;
  private String standardId;
  private List<String> orgTypes;
  private List<String> orgCategories;
  private List<String> personProperties;

  public TrainSection() {
    // Empty constructor
  }

  public TrainSection(JsonObject json) {
    TrainSectionConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TrainSectionConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public TrainSection setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public TrainSection setName(String name) {
    this.name = name;
    return this;
  }

  public String getCode() {
    return code;
  }

  public TrainSection setCode(String code) {
    this.code = code;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public TrainSection setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public List<String> getOrgTypes() {
    return orgTypes;
  }

  public TrainSection setOrgTypes(List<String> orgTypes) {
    this.orgTypes = orgTypes;
    return this;
  }

  public List<String> getOrgCategories() {
    return orgCategories;
  }

  public TrainSection setOrgCategories(List<String> orgCategories) {
    this.orgCategories = orgCategories;
    return this;
  }

  public List<String> getPersonProperties() {
    return personProperties;
  }

  public TrainSection setPersonProperties(List<String> personProperties) {
    this.personProperties = personProperties;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
