package io.vertx.armysystem.business.common.standard;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 训练课目定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class Course {
  private String id;
  private String name;    // 课目名称
  private int seq;     // 课目序号
  private int courseCategory;   // 课目分类，参考CourseCategory
  private String standardId;  // 大纲标准ID
  private String sectionId;   // 大纲分册ID
  private Boolean manual;     // 子课目是否自定义
  private String require;     // 训练要求, 必训/选训/自训
  private String scoreCriteria; // 评分标准, 二级制/四机制/七级制/百分制
  private List<String> placeTypes;        // 训练场地要求, 参考PlaceType表

  // 军事课目特有字段
  private String trainStepName; // 训练步骤, 参考TrainStep表, trainStep返回完整的TrainStep对象
  private List<Integer> trainUnits; // 训练单元(编制序列), 单兵/班/排/中队/大队.
  private String orgType;       // 课目适用的单位类型

  private List<String> orgCategories;   // 课目适用的单位分类列表
  private List<String> personProperties;  // 课目适用的人员属性列表
  private List<String> tasks;             // 课目对应任务(可多选)
  private List<String> serviceReqs;       // 勤务类型要求(可多选)
  private List<String> majorReqs;         // 专业类型要求(可多选)
  private List<String> rankReqs;          // 军衔要求(可多选)
  private List<String> ordnanceTypes;     // 配套军械类型, 参考OrdnanceType表
  private String gunnerType;              // 要求枪手类型


  // 体育课目特有字段
  private String sportCategory;           // 体育课目分类, 参考SportCategory表
  private String countType;               // 课目成绩按 时间或数量 计数
  private Boolean ascending;              // true: 递增评分，false: 递减评分
  private String unitType;                // 计量单位, (手动输入)（次/转/米/阶/圈等）

  // 军事课目和体育课目特有字段
  private List<SubCourseL1> subcourses;  // 子课目列表
  // 军事课目特有字段
  private List<TestContent> testContents; // 考核内容

  // 军事课目和体育课目特有字段
  private String textCondition;           // 课目条件
  private String textStandard;            // 课目标准
  private String textEvaluation;          // 考核要求

  public Course() {
    // Empty constructor
  }

  public Course(JsonObject json) {
    CourseConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    CourseConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public Course setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public Course setName(String name) {
    this.name = name;
    return this;
  }

  public int getSeq() {
    return seq;
  }

  public Course setSeq(int seq) {
    this.seq = seq;
    return this;
  }

  public int getCourseCategory() {
    return courseCategory;
  }

  public Course setCourseCategory(int courseCategory) {
    this.courseCategory = courseCategory;
    return this;
  }

  public String getStandardId() {
    return standardId;
  }

  public Course setStandardId(String standardId) {
    this.standardId = standardId;
    return this;
  }

  public String getSectionId() {
    return sectionId;
  }

  public Course setSectionId(String sectionId) {
    this.sectionId = sectionId;
    return this;
  }

  public Boolean getManual() {
    return manual;
  }

  public Course setManual(Boolean manual) {
    this.manual = manual;
    return this;
  }

  public String getRequire() {
    return require;
  }

  public Course setRequire(String require) {
    this.require = require;
    return this;
  }

  public String getScoreCriteria() {
    return scoreCriteria;
  }

  public Course setScoreCriteria(String scoreCriteria) {
    this.scoreCriteria = scoreCriteria;
    return this;
  }

  public List<String> getPlaceTypes() {
    return placeTypes;
  }

  public Course setPlaceTypes(List<String> placeTypes) {
    this.placeTypes = placeTypes;
    return this;
  }

  public String getTrainStepName() {
    return trainStepName;
  }

  public Course setTrainStepName(String trainStepName) {
    this.trainStepName = trainStepName;
    return this;
  }

  public List<Integer> getTrainUnits() {
    return trainUnits;
  }

  public Course setTrainUnits(List<Integer> trainUnits) {
    this.trainUnits = trainUnits;
    return this;
  }

  public String getOrgType() {
    return orgType;
  }

  public Course setOrgType(String orgType) {
    this.orgType = orgType;
    return this;
  }

  public List<String> getOrgCategories() {
    return orgCategories;
  }

  public Course setOrgCategories(List<String> orgCategories) {
    this.orgCategories = orgCategories;
    return this;
  }

  public List<String> getPersonProperties() {
    return personProperties;
  }

  public Course setPersonProperties(List<String> personProperties) {
    this.personProperties = personProperties;
    return this;
  }

  public List<String> getTasks() {
    return tasks;
  }

  public Course setTasks(List<String> tasks) {
    this.tasks = tasks;
    return this;
  }

  public List<String> getServiceReqs() {
    return serviceReqs;
  }

  public Course setServiceReqs(List<String> serviceReqs) {
    this.serviceReqs = serviceReqs;
    return this;
  }

  public List<String> getMajorReqs() {
    return majorReqs;
  }

  public Course setMajorReqs(List<String> majorReqs) {
    this.majorReqs = majorReqs;
    return this;
  }

  public List<String> getRankReqs() {
    return rankReqs;
  }

  public Course setRankReqs(List<String> rankReqs) {
    this.rankReqs = rankReqs;
    return this;
  }

  public List<String> getOrdnanceTypes() {
    return ordnanceTypes;
  }

  public Course setOrdnanceTypes(List<String> ordnanceTypes) {
    this.ordnanceTypes = ordnanceTypes;
    return this;
  }

  public String getGunnerType() {
    return gunnerType;
  }

  public Course setGunnerType(String gunnerType) {
    this.gunnerType = gunnerType;
    return this;
  }

  public String getSportCategory() {
    return sportCategory;
  }

  public Course setSportCategory(String sportCategory) {
    this.sportCategory = sportCategory;
    return this;
  }

  public String getCountType() {
    return countType;
  }

  public Course setCountType(String countType) {
    this.countType = countType;
    return this;
  }

  public Boolean getAscending() {
    return ascending;
  }

  public Course setAscending(Boolean ascending) {
    this.ascending = ascending;
    return this;
  }

  public String getUnitType() {
    return unitType;
  }

  public Course setUnitType(String unitType) {
    this.unitType = unitType;
    return this;
  }

  public List<SubCourseL1> getSubcourses() {
    return subcourses;
  }

  public Course setSubcourses(List<SubCourseL1> subcourses) {
    this.subcourses = subcourses;
    return this;
  }

  public List<TestContent> getTestContents() {
    return testContents;
  }

  public Course setTestContents(List<TestContent> testContents) {
    this.testContents = testContents;
    return this;
  }

  public String getTextCondition() {
    return textCondition;
  }

  public Course setTextCondition(String textCondition) {
    this.textCondition = textCondition;
    return this;
  }

  public String getTextStandard() {
    return textStandard;
  }

  public Course setTextStandard(String textStandard) {
    this.textStandard = textStandard;
    return this;
  }

  public String getTextEvaluation() {
    return textEvaluation;
  }

  public Course setTextEvaluation(String textEvaluation) {
    this.textEvaluation = textEvaluation;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
