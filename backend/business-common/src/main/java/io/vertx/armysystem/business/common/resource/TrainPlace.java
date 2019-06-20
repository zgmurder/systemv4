package io.vertx.armysystem.business.common.resource;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.util.List;

/**
 * 训练场地表定义
 *
 * @author Derek Zheng
 */
@DataObject(generateConverter = true)
public class TrainPlace {
  private String id;
  private String name;                // 场地名称(必填)!
  private String organizationId;      // 关联单位
  private List<String> placeTypes;    // 场地类型列表
  private Boolean indoor;             // 是否为室内场地
  private Boolean internal;           // 是否为自建场地
  private int builtStatus;            // 建设状态, 0:已建、1:在建、2:未建
  private Long startedAt;             // 开建日期(选填)
  private Long builtAt;               // 建成日期(选填)
  private List<String> weathers;      // 适用天气
  private String area;                // 场地规格
  private int capacity;               // 人员容量
  private String address;             // 场地地址
  private List<String> photos;        // 场地图片路径

  private Long createdTime;
  private Long updatedTime;

  public TrainPlace() {
    // Empty constructor
  }

  public TrainPlace(JsonObject json) {
    TrainPlaceConverter.fromJson(json, this);
  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    TrainPlaceConverter.toJson(this, json);
    return json;
  }

  public String getId() {
    return id;
  }

  public TrainPlace setId(String id) {
    this.id = id;
    return this;
  }

  public String getName() {
    return name;
  }

  public TrainPlace setName(String name) {
    this.name = name;
    return this;
  }

  public String getOrganizationId() {
    return organizationId;
  }

  public TrainPlace setOrganizationId(String organizationId) {
    this.organizationId = organizationId;
    return this;
  }

  public List<String> getPlaceTypes() {
    return placeTypes;
  }

  public TrainPlace setPlaceTypes(List<String> placeTypes) {
    this.placeTypes = placeTypes;
    return this;
  }

  public Boolean getIndoor() {
    return indoor;
  }

  public TrainPlace setIndoor(Boolean indoor) {
    this.indoor = indoor;
    return this;
  }

  public Boolean getInternal() {
    return internal;
  }

  public TrainPlace setInternal(Boolean internal) {
    this.internal = internal;
    return this;
  }

  public int getBuiltStatus() {
    return builtStatus;
  }

  public TrainPlace setBuiltStatus(int builtStatus) {
    this.builtStatus = builtStatus;
    return this;
  }

  public Long getStartedAt() {
    return startedAt;
  }

  public TrainPlace setStartedAt(Long startedAt) {
    this.startedAt = startedAt;
    return this;
  }

  public Long getBuiltAt() {
    return builtAt;
  }

  public TrainPlace setBuiltAt(Long builtAt) {
    this.builtAt = builtAt;
    return this;
  }

  public List<String> getWeathers() {
    return weathers;
  }

  public TrainPlace setWeathers(List<String> weathers) {
    this.weathers = weathers;
    return this;
  }

  public String getArea() {
    return area;
  }

  public TrainPlace setArea(String area) {
    this.area = area;
    return this;
  }

  public int getCapacity() {
    return capacity;
  }

  public TrainPlace setCapacity(int capacity) {
    this.capacity = capacity;
    return this;
  }

  public String getAddress() {
    return address;
  }

  public TrainPlace setAddress(String address) {
    this.address = address;
    return this;
  }

  public List<String> getPhotos() {
    return photos;
  }

  public TrainPlace setPhotos(List<String> photos) {
    this.photos = photos;
    return this;
  }

  public Long getCreatedTime() {
    return createdTime;
  }

  public TrainPlace setCreatedTime(Long createdTime) {
    this.createdTime = createdTime;
    return this;
  }

  public Long getUpdatedTime() {
    return updatedTime;
  }

  public TrainPlace setUpdatedTime(Long updatedTime) {
    this.updatedTime = updatedTime;
    return this;
  }

  @Override
  public String toString() {
    return toJson().encodePrettily();
  }
}
