package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 八落实单位训练质量要求
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class OrgScoreRequirement {
  private String id;
  private String standardId;
  private String orgCategory;   // 单位分类
  private int scoreReq;         // 最低成绩要求

  public OrgScoreRequirement() {
    // Empty constructor
  }

  public OrgScoreRequirement(JsonObject json) {
    OrgScoreRequirementConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    OrgScoreRequirementConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public OrgScoreRequirement setId(String id) {
    this.id = id;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public OrgScoreRequirement setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getOrgCategory() {
    return orgCategory;
  }

  public OrgScoreRequirement setOrgCategory(String orgCategory) {
    this.orgCategory = orgCategory;
    return this;
  }

  public int getScoreReq() {
    return scoreReq;
  }

  public OrgScoreRequirement setScoreReq(int scoreReq) {
    this.scoreReq = scoreReq;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
