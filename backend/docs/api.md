# API 接口定义

## 接口格式
## HTTP Headers
Content-Type: application/json
Authorization: Bearer [token]

### Add
URL: POST http://127.0.0.1:8080/api/[ServiceName]/[CollectionName]
BODY: json object

### Fetch Item
URL: GET http://127.0.0.1:8080/api/[ServiceName]/[CollectionName]/[id or name]
BODY: empty

### Query List
URL: POST http://127.0.0.1:8080/api/[ServiceName]/[CollectionName]s
BODY: MongoDB query condition
{
    "where": {...}
    "option": {
        "fields": [...],
        "sort": {...}
        "skip": 0,
        "limit": 10
    }
}

### Update Item
URL: PATCH http://127.0.0.1:8080/api/[ServiceName]/[CollectionName]/[id or name]
BODY: json object

### Delete Item
URL: DELETE http://127.0.0.1:8080/api/[ServiceName]/[CollectionName]/[id or name]
BODY: empty

## Account
### User
```java
class User {
  private String id;        // auto
  private String username;
  private String password;
  private boolean buildIn; // auto
  private String roleName;
  private int roleLevel;   // auto
  private String organizationId;

  private String phone;
  private String email;
  private String firstName;
  private String lastName;
  private String description;

  private Long createdTime; // auto
  private Long updatedTime; // auto
}
```

额外两个接口：
#### 登陆
POST http://127.0.0.1:8080/api/account/user/login
BODY:
```json
{
  "username": "admin",
  "password": "123456"
}
```

#### 修改密码
POST http://127.0.0.1:8080/api/account/user/updatepwd
BODY:
```json
{
  "username": "admin",
  "oldPassword": "123456",
  "newPassword": "111111"
}
```

### 角色 Role
```java
class Role {
  private String id;
  private String roleName;
  private String displayName;
  private int level;
  private boolean buildIn;
  private String description;
  private Long createdTime;
  private Long updatedTime;

  private List<Permission> permissions;
}
```

## Dictionary

### 军械类型 OrdnanceCategory
常量：武器, 弹药, 物资

### 武警部队编制序列 OrgSequence
常量：
```
Army(1, "总部", "部队"),
Division(2, "总队", "部队"),
Brigade(3, "旅级支队", "部队"),
Regiment(4, "团级支队", "部队"),
Battalion(5, "大队", "分队"),
Company(6, "中队", "分队"),
Platoon(7, "排", "分队"),
Class(8, "班", "分队"),
Team(9, "小队", "分队"),
Soldier(10, "单兵", "人员");
```

### 单位类型 OrgType
常量
```
Troop("部队"),
UnitForce("分队"),
LeaderOffice("首长机关"),
Department("部门")
```

### 评分标准 ScoreCriteria
常量
```
Level2("二级制"),
Level4("四级制"),
Level7("七级制"),
NumberScore("百分制");
```

### 成绩等级 ScoreLevel
常量
```
NoScore(0),       // 未参考
Unpass(1),        // 不合格或不及格
Pass(2),          // 合格或及格
Good(3),          // 良好
Excellent(4),     // 优秀
ExtraL3(5),       // 特三级
ExtraL2(6),       // 特二级
ExtraL1(7);       // 特一级
```

### 体能等级 PhysicalLevel
常量
```
Level1("一类人员"),
Level2("二类人员"),
Level3("三类人员"),
Recruit("新兵"),
CivilServant("文职人员");
```

### 军兵种类型 TroopCategory
常量
```
LandForce("地面人员"),
AirForce("空勤人员"),
BoatForce("船艇人员");
```

### 人员分类 SoldierCategory (添加人员的时候使用)
常量
```
Officer("指挥警官"),
TechOfficer("技术警官"),
CivilServant("文职人员"),
Sergeant("士官"),
Soldier("义务兵");
```

### 人员属性 PersonProperty (添加课目的时候使用)
常量
```
UnitForce("分队"),
Officer("警官"),
TechOfficer("技术警官"),
Supporter("保障人员"),
ReserveMember("预备队员"),
Recruit("新兵"),
RecruitOfficer("新训干部骨干");
```

### 组训类型 GroupTrainMethod
```java
class GroupTrainMethod {
  private String id;    // auto
  private String name;
  private int order;
}
```

### 枪手类型 GunnerType
```java
class GunnerType {
  private String id;      // auto
  private String name;
  private List<String> gunTypes;
  private int order;
}
```

### 军衔等级 MilitaryRank
```java
class MilitaryRank {
    private String id;
    private String name;            // 军衔名称
    private String rankLevel1;      // 军衔1级分类：区分义务兵、士官、军官
    private String rankLevel2;      // 军衔2级分类：比如义务兵、初级士官、中级士官、高级士官、尉官、校官、将官等
    private int order;              // 军衔等级排序码
}
```

### 摩托类型 MotorType
```java
class MotorType {
    private String id;
    private String name;
    private String unit;  // 计量单位
    private int order;
}
```

### 军械类型 OrdnanceType
```java
class OrdnanceType {
    private String id;
    private String name;
    private String category;        // 军械分类，参考OrdnanceCategory, 分为武器、弹药、物资
    private String weaponUnit;      // 武器计量单位
    private String bulletUnit;      // 对应弹药/物资计量单位
    private int order;
}
```

### 武警部队单位详细分类 OrgCategory
```java
class OrgCategory {
    private String id;
    private String name;
    private String orgType;                                         // 单位类型: 部队/分队/首长机关/部门
  
    private String orgProperty;                                     // 单位属性
    private List<String> optionalServices;      // 单位勤务类型
    private List<TrainTask> optionalTasks;      // 单位训练任务列表
  
    private List<String> optionalMajors;        // 单位可选专业
    private String physicalLevel;                                   // 战士体能等级
    private String troopCategory;                                   // 军兵种类型，比如地面人员/空勤人员/船艇人员
    private int order;
}

class TrainTask {
    private String name;
    private List<String> optionalSubjects;    // 可选课题
}
```

### 武警部队单位属性 OrgProperty
```java
class OrgProperty {
    private String id;
    private String name;
    private List<String> optionalMajors;    // 可选专业
    private int order;
}
```

### 场地类型 PlaceType
```java
class PlaceType {
     private String id;
     private String name;
     private int order;
}
```

### 人员职务 Position
```java
class Position {
    private String id;
    private String name;
    private int orgSequence;      // 根据编制序列区分职务
    private String orgCategory;   // 根据单位分类区分职务
    private boolean isCommander;  // 指挥员
    private boolean isMaster;     // 军政主官
    private int order;
}
```

### 特殊任务类型 SpecialMission
```java
class SpecialMission {
    private String id;
    private String name;
    private int order;
}
```

### 体育课目分类 SportCategory
```java
class SportCategory {
    private String id;
    private String name;
    private int order;
}
```

### 保障人员专业类型 SupporterMajor
```java
class SupporterMajor {
    private String id;
    private String name;
    private int order;
}
```

### 教练员等级 TrainerLevel
```java
class TrainerLevel {
    private String id;
    private String name;
    private int scoreReq;           // 该等级教练员所教授课目需要达到的成绩
    private int order;
}
```

### 训练步骤 TrainStep
```java
class TrainStep {
    private String id;
    private String name;
    private String orgType;
    private List<Integer> trainUnits;
    private int priority;
    private int order;
}
```

### 天气类型 WeatherType
```java
class WeatherType {
    private String id;
    private String name;
    private int order;
}
```

## 大纲标准

### 枚举
#### 大纲启用状态 StandardState
常量
```
Initial(0),
Activated(1),
Stopped(2);
```


## 资源管理(resource)

### 单位管理(Organization)
```java
class Organization {
  private String id;
  private String name;              // 单位短名称，手动录入
  private String displayName;       // 单位完整名称(后端自动生成)
  private int nodeCode;             // 单位同级排序码，手动录入
  private String orgCode;           // 单位完整排序码，自动生成
  private String parentId;          // 父单位ID，页面手动选择
  private List<String> parentIds = new ArrayList<>();   // 上级单位ID列表，自动生成
  private int childCount;           // 直属子单位数量,自动生成
  private int orgSequence;          // 编制序列，手动选择
  private String orgType;           // 单位类型，手动选择
  private String orgCategory;       // 单位分类，手动选择
  private String orgProperty;       // 单位属性，根据单位分类自动设置(前端)
  private String serviceType;       // 勤务类型，根据单位分类进行获取后选择
  private List<String> orgMajors;   // 专业类型，根据单位分类进行获取后选择
  private Boolean important;        // 重要任务方向部队标志
  private String specialMission;    // 重要任务方向部队类型
  private int planSodierCount;      // 不填
  private String address;           // 地址，手动录入
  private Double longitude;   // 经度
  private Double latitude;    // 维度
  private Double altitude;    // 海拔高度

  private Boolean deactivated;  // 停用标志，通过单独的停用按钮来触发
  private Long deactivatedAt;   // 失效时间
}
```

1. Add
URL: POST http://127.0.0.1:8080/api/resource/organization
BODY: json object

2. Fetch Item
URL: GET http://127.0.0.1:8080/api/resource/organization/[id or displayName]
BODY: empty

3. Query List
URL: POST http://127.0.0.1:8080/api/resource/organizations
BODY: MongoDB query condition
{
    "where": {...}
    "option": {
        "fields": [...],
        "sort": {...}
        "skip": 0,
        "limit": 10
    }
}

4. Update Item
URL: PATCH http://127.0.0.1:8080/api/resource/organization/[id or displayName]
BODY: json object

5. Delete Item
URL: DELETE http://127.0.0.1:8080/api/resource/organization/[id or displayName]
BODY: empty

6. 同级单位交换顺序
URL: POST http://127.0.0.1:8080/api/resource/organization/swap/[id or displayName]
BODY: { id: String }

7. 停用或重用单位
URL: POST http://127.0.0.1:8080/api/resource/organization/deactivate/[id or displayName]
BODY: { deactivate: Boolean }
