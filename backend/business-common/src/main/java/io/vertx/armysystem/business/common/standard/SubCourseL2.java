package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

/**
 * 二级子课目定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class SubCourseL2 {
  private int seq;              // 子课目序号
  private String name;          // 子课目名称
  private String require;       // 训练要求, 必训/选训/

  public SubCourseL2() {
    // Empty constructor
  }

  public SubCourseL2(JsonObject json) {
//    SubCourseL2Converter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
//    SubCourseL2Converter.toJson(this, json);
    return json;
  }

  public int getSeq() {
    return seq;
  }

  public SubCourseL2 setSeq(int seq) {
    this.seq = seq;
    return this;
  }

  public String getName() {
    return name;
  }

  public SubCourseL2 setName(String name) {
    this.name = name;
    return this;
  }

  public String getRequire() {
    return require;
  }

  public SubCourseL2 setRequire(String require) {
    this.require = require;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
