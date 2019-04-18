package io.vertx.armysystem.business.common.dictionary;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 武警部队军衔等级定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class MilitaryRank {
  private String id;
  private String name;            // 军衔名称
  private String rankLevel1;      // 军衔1级分类：区分义务兵、士官、军官
  private String rankLevel2;      // 军衔2级分类：比如尉官、校官、将官等
  private int levelCode;          // 军衔等级排序码

  public MilitaryRank() {
    // Empty constructor
  }

  public MilitaryRank(JsonObject json) {
    MilitaryRankConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    MilitaryRankConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public MilitaryRank setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public MilitaryRank setName(String name) {
    this.name = name;
    return this;
  }

  public String getRankLevel1() {
    return rankLevel1;
  }

  public MilitaryRank setRankLevel1(String rankLevel1) {
    this.rankLevel1 = rankLevel1;
    return this;
  }

  public String getRankLevel2() {
    return rankLevel2;
  }

  public MilitaryRank setRankLevel2(String rankLevel2) {
    this.rankLevel2 = rankLevel2;
    return this;
  }

  public int getLevelCode() {
    return levelCode;
  }

  public MilitaryRank setLevelCode(int levelCode) {
    this.levelCode = levelCode;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
