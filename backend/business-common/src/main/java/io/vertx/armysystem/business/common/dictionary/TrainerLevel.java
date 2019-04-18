package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 教练员评定等级
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TrainerLevel {
  private String id;
  private String name;
  private int scoreReq;           // 该等级教练员所教授课目需要达到的成绩
  private int order;

  public TrainerLevel() {
    // Empty constructor
  }

  public TrainerLevel(JsonObject json) {
    TrainerLevelConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TrainerLevelConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public TrainerLevel setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public TrainerLevel setName(String name) {
    this.name = name;
    return this;
  }

  public int getOrder() {
    return order;
  }

  public TrainerLevel setOrder(int order) {
    this.order = order;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
