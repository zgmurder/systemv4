package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 一级子课目定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class SubCourseL1 {
  private int seq;              // 子课目序号
  private String name;          // 子课目名称
  private String require;       // 训练要求, 必训/选训/自训
  private List<SubCourseL2> subcourses;   // 二级子课目列表

  public SubCourseL1() {
    // Empty constructor
  }

  public SubCourseL1(JsonObject json) {
    SubCourseL1Converter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    SubCourseL1Converter.toJson(this, json);
    return json;
  }

  public int getSeq() {
    return seq;
  }

  public SubCourseL1 setSeq(int seq) {
    this.seq = seq;
    return this;
  }

  public String getName() {
    return name;
  }

  public SubCourseL1 setName(String name) {
    this.name = name;
    return this;
  }

  public String getRequire() {
    return require;
  }

  public SubCourseL1 setRequire(String require) {
    this.require = require;
    return this;
  }

  public List<SubCourseL2> getSubcourses() {
    return subcourses;
  }

  public SubCourseL1 setSubcourses(List<SubCourseL2> subcourses) {
    this.subcourses = subcourses;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
