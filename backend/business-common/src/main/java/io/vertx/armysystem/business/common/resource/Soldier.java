package io.vertx.armysystem.business.common.resource;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * Soldier data object
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class Soldier {
  private String id;
  private String name;                      // 人员姓名(必填)
  private String cardId;                    // 保障卡号或身份证号(必填)
  private String gender;                    // 性别(必填)
  private Long birthday;                    // 出生日期(必填)
  private String politicalStatus;           // 政治面貌(党员/团员/群众)(必填)
  private Double height;                    // 当前身高(厘米)(必填)
  private Double weight;                    // 当前体重(公斤)(必填)
  private String headUrl;                   // 头像图片HTTP路径(选填)(先上传到图片服务器，然后记录图片路径)
  private AdvancedPersonInfo advanced;      // 用户可选相关信息

  private String organizationId;            // 当前所在单位ID
  private Long joinedAt;                    // 加入单位日期，添加时自动设置
  private Long leftAt;                      // 离开单位日期，退伍或调离时自动填入 (无需用户输入)

  // 以下是军人基本资料
  private int inserviceStatus;              // 服役状态，(默认0) 0: 服役中 1: 已退役 2: 已调离 3: 暂离深造 (由调动时触发，自动设置)
  private Long enlistedAt;                  // 入伍日期(必填)
  private Long dischargedAt;                // 退伍日期，退伍时自动填入 (无需用户输入)
  private String positionId;                // 职务（必填）; 从Position表获取可选列表
  private Long positionAt;                  // 任职日期
  private String rankId;                    // 军衔等级(必填)，可选项从军衔等级表MilitaryRank获取可选列表

  private String soldierCategory;           // 人员类别(必填)，区分指挥警官/技术警官/文职人员/士官/义务兵
  private Boolean isSupporter;              // 保障人员标志(必填)
  private String personProperty;            // 人员属性(自动生成), 区分分队\警官\保障人员\预备队员\新兵\新训干部骨干
  private Boolean isCivilServant;           // 是否为文职人员(自动生成)
  private Boolean isSpecialForce;           // 是否为特战队员，所属单位属性为特战时为true, 其它为false (自动生成)
  private String specialForceType;          // 作战队员或者预备队员，对特战分队有效，所属单位为特战属性时，由用户选择。(选填)

  private String gunnerType;                // 枪手类型(选填)
  private List<String> majorType;           // 专业类型(选填)，可选项根据单位分类获取可选专业
  private String physicalLevel;             // 体能训练等级分类，区分一类人员/二类人员/三类人员/新兵(自动设置)
  private String troopCategory;             // 军兵种(地面人员/空勤人员/船艇人员)(自动设置)

  private Long createdTime;
  private Long updatedTime;

  public Soldier() {
    // Empty constructor
  }

  public Soldier(JsonObject json) {
    SoldierConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    SoldierConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public Soldier setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public Soldier setName(String name) {
    this.name = name;
    return this;
  }

  public String getCardId() {
    return cardId;
  }

  public Soldier setCardId(String cardId) {
    this.cardId = cardId;
    return this;
  }

  public String getGender() {
    return gender;
  }

  public Soldier setGender(String gender) {
    this.gender = gender;
    return this;
  }

  public Long getBirthday() {
    return birthday;
  }

  public Soldier setBirthday(Long birthday) {
    this.birthday = birthday;
    return this;
  }

  public String getPoliticalStatus() {
    return politicalStatus;
  }

  public Soldier setPoliticalStatus(String politicalStatus) {
    this.politicalStatus = politicalStatus;
    return this;
  }

  public Double getHeight() {
    return height;
  }

  public Soldier setHeight(Double height) {
    this.height = height;
    return this;
  }

  public Double getWeight() {
    return weight;
  }

  public Soldier setWeight(Double weight) {
    this.weight = weight;
    return this;
  }

  public String getHeadUrl() {
    return headUrl;
  }

  public Soldier setHeadUrl(String headUrl) {
    this.headUrl = headUrl;
    return this;
  }

  public AdvancedPersonInfo getAdvanced() {
    return advanced;
  }

  public Soldier setAdvanced(AdvancedPersonInfo advanced) {
    this.advanced = advanced;
    return this;
  }

  public String getOrganizationId() {
    return organizationId;
  }

  public Soldier setOrganizationId(String organizationId) {
    this.organizationId = organizationId;
    return this;
  }

  public Long getJoinedAt() {
    return joinedAt;
  }

  public Soldier setJoinedAt(Long joinedAt) {
    this.joinedAt = joinedAt;
    return this;
  }

  public Long getLeftAt() {
    return leftAt;
  }

  public Soldier setLeftAt(Long leftAt) {
    this.leftAt = leftAt;
    return this;
  }

  public int getInserviceStatus() {
    return inserviceStatus;
  }

  public Soldier setInserviceStatus(int inserviceStatus) {
    this.inserviceStatus = inserviceStatus;
    return this;
  }

  public Long getEnlistedAt() {
    return enlistedAt;
  }

  public Soldier setEnlistedAt(Long enlistedAt) {
    this.enlistedAt = enlistedAt;
    return this;
  }

  public Long getDischargedAt() {
    return dischargedAt;
  }

  public Soldier setDischargedAt(Long dischargedAt) {
    this.dischargedAt = dischargedAt;
    return this;
  }

  public String getPositionId() {
    return positionId;
  }

  public Soldier setPositionId(String positionId) {
    this.positionId = positionId;
    return this;
  }

  public Long getPositionAt() {
    return positionAt;
  }

  public Soldier setPositionAt(Long positionAt) {
    this.positionAt = positionAt;
    return this;
  }

  public String getRankId() {
    return rankId;
  }

  public Soldier setRankId(String rankId) {
    this.rankId = rankId;
    return this;
  }

  public String getSoldierCategory() {
    return soldierCategory;
  }

  public Soldier setSoldierCategory(String soldierCategory) {
    this.soldierCategory = soldierCategory;
    return this;
  }

  public Boolean getSupporter() {
    return isSupporter;
  }

  public Soldier setSupporter(Boolean supporter) {
    isSupporter = supporter;
    return this;
  }

  public String getPersonProperty() {
    return personProperty;
  }

  public Soldier setPersonProperty(String personProperty) {
    this.personProperty = personProperty;
    return this;
  }

  public Boolean getCivilServant() {
    return isCivilServant;
  }

  public Soldier setCivilServant(Boolean civilServant) {
    isCivilServant = civilServant;
    return this;
  }

  public Boolean getSpecialForce() {
    return isSpecialForce;
  }

  public Soldier setSpecialForce(Boolean specialForce) {
    this.isSpecialForce = specialForce;
    return this;
  }

  public String getSpecialForceType() {
    return specialForceType;
  }

  public Soldier setSpecialForceType(String specialForceType) {
    this.specialForceType = specialForceType;
    return this;
  }

  public String getGunnerType() {
    return gunnerType;
  }

  public Soldier setGunnerType(String gunnerType) {
    this.gunnerType = gunnerType;
    return this;
  }

  public List<String> getMajorType() {
    return majorType;
  }

  public Soldier setMajorType(List<String> majorType) {
    this.majorType = majorType;
    return this;
  }

  public String getPhysicalLevel() {
    return physicalLevel;
  }

  public Soldier setPhysicalLevel(String physicalLevel) {
    this.physicalLevel = physicalLevel;
    return this;
  }

  public String getTroopCategory() {
    return troopCategory;
  }

  public Soldier setTroopCategory(String troopCategory) {
    this.troopCategory = troopCategory;
    return this;
  }

  public Long getCreatedTime() {
    return createdTime;
  }

  public Soldier setCreatedTime(Long createdTime) {
    this.createdTime = createdTime;
    return this;
  }

  public Long getUpdatedTime() {
    return updatedTime;
  }

  public Soldier setUpdatedTime(Long updatedTime) {
    this.updatedTime = updatedTime;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
