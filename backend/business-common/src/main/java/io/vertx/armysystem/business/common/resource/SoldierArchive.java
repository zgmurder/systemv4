package io.vertx.armysystem.business.common.resource;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * SoldierArchive data object
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class SoldierArchive {
  private String id;
  private String name;
  private String cardId;
  private String action;          // 具体参考SoldierAction
  private String organizationId;
  private String position;
  private String rank;
  private String description;
  private Long createdTime;

  public SoldierArchive() {
    // Empty constructor
  }

  public SoldierArchive(JsonObject json) {
    SoldierArchiveConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    SoldierArchiveConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public SoldierArchive setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public SoldierArchive setName(String name) {
    this.name = name;
    return this;
  }

  public String getCardId() {
    return cardId;
  }

  public SoldierArchive setCardId(String cardId) {
    this.cardId = cardId;
    return this;
  }

  public String getAction() {
    return action;
  }

  public SoldierArchive setAction(String action) {
    this.action = action;
    return this;
  }

  public String getOrganizationId() {
    return organizationId;
  }

  public SoldierArchive setOrganizationId(String organizationId) {
    this.organizationId = organizationId;
    return this;
  }

  public String getPosition() {
    return position;
  }

  public SoldierArchive setPosition(String position) {
    this.position = position;
    return this;
  }

  public String getRank() {
    return rank;
  }

  public SoldierArchive setRank(String rank) {
    this.rank = rank;
    return this;
  }

  public String getDescription() {
    return description;
  }

  public SoldierArchive setDescription(String description) {
    this.description = description;
    return this;
  }

  public Long getCreatedTime() {
    return createdTime;
  }

  public SoldierArchive setCreatedTime(Long createdTime) {
    this.createdTime = createdTime;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
