package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 武警部队职务列表
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class Position {
  private String id;
  private String name;
  private int orgSequence;      // 根据编制序列区分职务
  private String orgCategory;   // 根据单位分类区分职务
  private boolean isCommander;  // 指挥员
  private boolean isMaster;     // 军政主官
  private int order;

  public Position() {
    // Empty constructor
  }

  public Position(JsonObject json) {
    PositionConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    PositionConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public Position setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public Position setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrgSequence() {
    return orgSequence;
  }

  public Position setOrgSequence(int orgSequence) {
    this.orgSequence = orgSequence;
    return this;
  }

  public String getOrgCategory() {
    return orgCategory;
  }

  public Position setOrgCategory(String orgCategory) {
    this.orgCategory = orgCategory;
    return this;
  }

  public boolean isCommander() {
    return isCommander;
  }

  public Position setCommander(boolean commander) {
    isCommander = commander;
    return this;
  }

  public boolean isMaster() {
    return isMaster;
  }

  public Position setMaster(boolean master) {
    isMaster = master;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public Position setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
