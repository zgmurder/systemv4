package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 八落实训练场地要求
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class PlaceRequirement {
  private String id;
  private String standardId;
  private String orgCategory;
  private List<String> requiredPlaces;
  private List<String> optionalPlaces;

  public PlaceRequirement() {
    // Empty constructor
  }

  public PlaceRequirement(JsonObject json) {
    PlaceRequirementConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    PlaceRequirementConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public PlaceRequirement setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public PlaceRequirement setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getOrgCategory() {
    return orgCategory;
  }

  public PlaceRequirement setOrgCategory(String orgCategory) {
    this.orgCategory = orgCategory;
    return this;
  }

  public List<String> getRequiredPlaces() {
    return requiredPlaces;
  }

  public PlaceRequirement setRequiredPlaces(List<String> requiredPlaces) {
    this.requiredPlaces = requiredPlaces;
    return this;
  }

  public List<String> getOptionalPlaces() {
    return optionalPlaces;
  }

  public PlaceRequirement setOptionalPlaces(List<String> optionalPlaces) {
    this.optionalPlaces = optionalPlaces;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
