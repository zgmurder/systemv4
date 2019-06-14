package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 八落实人员参训率要求
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class PersonRequirement {
  private String id;
  private String standardId;
  private String orgCategory;
  private int trainRate;

  public PersonRequirement() {
    // Empty constructor
  }

  public PersonRequirement(JsonObject json) {
    PersonRequirementConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    PersonRequirementConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public PersonRequirement setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public PersonRequirement setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getOrgCategory() {
    return orgCategory;
  }

  public PersonRequirement setOrgCategory(String orgCategory) {
    this.orgCategory = orgCategory;
    return this;
  }

  public int getTrainRate() {
    return trainRate;
  }

  public PersonRequirement setTrainRate(int trainRate) {
    this.trainRate = trainRate;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
