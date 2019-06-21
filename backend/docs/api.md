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

#### 课目分类
```
Train(0, "军事课目"),
Sport(1, "体育课目"),
Politics(2, "政治教育"),
Activity(3, "党团活动"),
Others(4, "其它工作"),
Custom(5, "自定义课目");
```

### 大纲标准(TrainStandard)
```java
class TrainStandard {
  private String id;
  private String name;        // 手动录入
  private String version;     // 版本号, 手动录入
  private int state;          // 大纲启用状态: 0: 未启用/ 1: 已启用/ 2: 已停用, 参考StandardState  不可编辑
  private Long startTime;     // 大纲启用日期, 不可编辑
  private Long endTime;       // 大纲停用日期, 不可编辑
}
```

1. 额外接口(启用或停用大纲)
URL: POST http://127.0.0.1:8080/api/standard/trainstandard/activate/[id or name]
BODY: { activate: Boolean }


### 大纲分册(TrainSection)
```java
class TrainSection {
  private String id;
  private String name;          // 大纲分册名称，手动录入
  private String code;          // 分册编号, 手动录入
  private String standardId;  // 关联的大纲标准ID, 选择填入
  private List<String> orgTypes;  // 单位类型, 选择填入
  private List<String> orgCategories; // 单位分类, 选择填入
  private List<String> personProperties;  // 人员属性, 选择填入
}
```


### 阶段时间表(TrainStageTime)
```java
class TrainStageTime {
  private String id;
  private String standardId;        // 关联的大纲标准ID, 选择填入
  private List<String> orgCategories; // 单位分类列表, 选择填入
  private List<String> majors;        // 专业列表, 选择填入
  private List<StageTime> stageTimes; // 时段列表
}

class StageTime {
  private String task;                // 训练任务
  private Double months;              // 月数
}
```

### 训练课目(Course)
```java
class Course {
  private String id;
  private String name;    // 课目名称
  private int seq;     // 课目序号
  private int category;   // 课目分类，参考CourseCategory
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
}

class SubCourseL1 {
  private int seq;              // 子课目序号
  private String name;          // 子课目名称
  private String require;       // 训练要求, 必训/选训/自训
  private List<SubCourseL2> subcourses;   // 二级子课目列表
}

class SubCourseL2 {
  private int seq;              // 子课目序号
  private String name;          // 子课目名称
  private String require;       // 训练要求, 必训/选训/
}

class TestContent {
  private String name;        // 考核内容名称
  private String testReq;     // 考核要求, 必考或选考
}
```

### 课目配当表(CourseDistribution)
```java
class CourseDistribution {
  private String id;
  private String courseId;                  // 军事课目ID
  private String standardId;                // 大纲标准ID
  private String sectionId;                 // 大纲分册ID
  private List<String> orgCategories;       // 课目适用的单位分类列表
  private List<String> personProperties;    // 课目适用的人员属性列表
  private String serviceReq;                // 勤务类型(可选)
  private String task;                      // 训练任务
  private List<String> subjects;            // 训练课题列表
}
```

### 课目时间参考表(CourseTime)
```java
class CourseTime {
  private String id;
  private List<String> courseIds;           // 训练课目ID列表
  private String standardId;                // 大纲标准ID
  private String sectionId;                 // 大纲分册ID
  private List<String> orgCategories;       // 课目适用的单位分类列表
  private List<String> personProperties;    // 课目适用的人员属性列表
  private List<String> tasks;               // 对应任务列表
  private List<String> serviceReqs;         // 勤务类型列表
  private String major;                     // 专业类型
  private int hoursInDay;                   // 昼训时间要求
  private int hoursAtNight;                 // 夜训时间要求
}
```

### 体育课目时间参考表
```java
class SportTime {
  private String id;
  private String standardId;      // 大纲标准ID
  private String sportCategory;   // 体育科目分类
  private String physicalLevel;   // 体能训练等级
  private int hours;              // 时间要求
}
```

### 通用训练课目
```java
class RequiredSportCourse {
  private String id;
  private String courseId;
  private String standardId;
  private List<String> physicalLevels;    // 体能训练等级列表
  private List<String> troopCategories;   // 军兵种类型列表
  private List<String> genders;           // 性别要求列表(男/女)
  private Boolean required;              // 必考/选考
  private Boolean civilServant;          // 是否适用于文职人员
  private Boolean ageEnabled;            // 是否启用年龄条件
  private int fromAge;                   // 年龄条件
  private int toAge;
}
```

### 专项训练课目
```java
class OptionalSportCourse {
  private String id;
  private String standardId;
  private List<String> courseIds;       // 体育课目列表，或者的关系
  private int groupId;                  // 课目组编号
  private int itemSeq;                  // 课目序号
  private String physicalLevel;         // 体能训练等级
  private String troopCategory;         // 军兵种类型
  private String gender;                // 性别要求
}
```

### 八落实人员参训率要求
```java
class PersonRequirement {
  private String id;
  private String standardId;
  private String orgCategory;
  private int trainRate;
}
```

### 八落实训练时间要求
```java
class TimeRequirement {
  private String id;
  private String standardId;
  private String orgCategory;       // 单位分类
  private String personProperty;    // 人员属性分类
  private Double months;               // 年度训练月数
  private Double days;                 // 年度训练天数
  private Double hours;                // 年度训练小时数
  private Double daysPerMonth;          // 月度训练天数
  private Double daysPerWeek;           // 每周训练天数
  private Double hoursPerDay;           // 每天训练小时数
  private Double hoursAtNight;          // 年度夜训小时数
  private Double rateAtNight;           // 年度夜巡比率
  private Double flexibleDays;          // 机动天数
}
```

### 八落实训练场地要求
```java
class PlaceRequirement {
  private String id;
  private String standardId;
  private String orgCategory;
  private List<String> requiredPlaces;
  private List<String> optionalPlaces;
}
```

### 八落实单位训练质量要求
```java
class OrgScoreRequirement {
  private String id;
  private String standardId;
  private String orgCategory;   // 单位分类
  private int scoreReq;         // 最低成绩要求
}
```

### 八落实人员训练质量要求
```java
class PersonScoreRequirement {
  private String id;
  private String standardId;
  private String personProperty;    // 训练大纲
  private List<String> ranks;       // 军衔等级列表
  private int startYear;            // 任职年限范围,比如0-2年, 2年以上等
  private int endYear;
  private int scoreReq;             // 成绩要求
}
```

### 八落实弹药消耗要求
```java
class BulletRequirement {
  private String id;
  private String standardId;
  private String orgCategory;     // 单位分类
  private String majorType;       // 专业类型
  private String ordnanceType;    // 军械类型
  private String rankL1;          // 军衔一级分类(义务兵/士官/军官)
  private int quota;              // 数量配额
  private String unitType;        // 计量单位
  private String numType;         // 数量类型(单人/单炮/总量)
}
```

### 八落实摩托飞行小时要求
```java
class MotorRequirement {
  private String id;
  private String standardId;
  private String orgCategory;     // 单位分类
  private String majorType;       // 专业类型
  private int quota;              // 数量配额: 训练小时数要求或行车里程数
  private String unitType;        // 计量单位
}
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

### 人员管理
```java
class Soldier {
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

  private String organizationId;            // 当前所在单位ID; 只读显示时，返回Organization对象
  private Long joinedAt;                    // 加入单位日期，添加时自动设置
  private Long leftAt;                      // 离开单位日期，退伍或调离时自动填入 (无需用户输入)

  // 以下是军人基本资料
  private int inserviceStatus;              // 服役状态，(默认0) 0: 服役中 1: 已退役 2: 已调离 3: 暂离深造 (由调动时触发，自动设置)
  private Long enlistedAt;                  // 入伍日期(必填)
  private Long dischargedAt;                // 退伍日期，退伍时自动填入 (无需用户输入)
  private String positionId;                // 职务ID（必填）; 从Position表获取可选列表
  private String position;                  // 职务名称, 只读显示用
  private String rankId;                    // 军衔等级ID(必填)，可选项从军衔等级表MilitaryRank获取可选列表
  private String rank;                      // 职务名称, 只读显示用

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
}
class AdvancedPersonInfo {
  private String phoneNum;        // 联系电话
  private String bloodType;       // 血型
  private String nationality;     // 国籍，默认中国
  private String fromCity;        // 籍贯
  private String currentCity;     // 户口所在地
  private String highestDegree;   // 最高学历
  private String graduatedSchool; // 毕业院校
  private String graduatedMajor;  // 毕业专业
  private String graduatedAt;     // 毕业日期
}
```

1. Add
URL: POST http://127.0.0.1:8080/api/resource/soldier
BODY: json object

2. Fetch Item
URL: GET http://127.0.0.1:8080/api/resource/soldier/[id]
BODY: empty

3. Query List
URL: POST http://127.0.0.1:8080/api/resource/soldiers
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
URL: PATCH http://127.0.0.1:8080/api/resource/soldier/[id]
BODY: json object

5. Delete Item
URL: DELETE http://127.0.0.1:8080/api/resource/soldier/[id]
BODY: empty

6. 退役/调离/暂离深造接口
URL: POST http://127.0.0.1:8080/api/resource/soldier/change/[id]
BODY: 
```java
class SoldierArchive {
  private String id;
  private String name;              
  private String cardId;
  private String action;          // 具体参考SoldierAction
  private String organizationId;
  private String positionId;
  private String position;
  private String rankId;
  private String rank;
  private String description;
  private Long createdTime;
}
```
根据action字段区分操作类型，具体定义如下：
```java
enum SoldierAction {
  NewRecruit("新兵入伍"),
  InitialRegister("初始登记"),
  PositionChange("职务调整"),
  RankChange("军衔升级"),
  OrganizationChange("单位调动"),
  SoldierRetire("军人退役"),
  TemporaryStudy("暂离深造");
}
```

6.1 新兵入伍和初始登记
在添加人员的时候会自动设置

6.2 职务调整
表示仅仅修改职务信息，那么BODY信息包括:
```json
{
    "action": "职务调整",
    "positionId": "String",
    "description": "String"  // 备注说明
}
```

6.3 军衔升级
表示仅仅修改军衔信息，那么BODY信息包括:
```json
{
    "action": "军衔升级",
    "rankId": "String",
    "description": "String"  // 备注说明
}
```

6.4 单位调动
表示发生点位调动，那么BODY信息包括:
```json
{
    "action": "单位调动",
    "organizationId": "String",
    "positionId": "String",
    "rankId": "String",
    "description": "String"  // 备注说明
}
```

6.5 军人退役
军人退役，那么BODY信息包括:
```json
{
    "action": "军人退役",
    "description": "String"  // 备注说明
}
```

6.6 暂离深造
军人退役，那么BODY信息包括:
```json
{
    "action": "暂离深造",
    "description": "String"  // 备注说明
}
```

7. 查询人员变动记录
URL: POST http://127.0.0.1:8080/api/resource/soldier/[id]/archives
BODY: 
```java
class SoldierArchive {
  private String id;
  private String name;              
  private String cardId;
  private String action;          // 具体参考SoldierAction
  private String organizationId;
  private String positionId;
  private String position;
  private String rankId;
  private String rank;
  private String description;
  private Long createdTime;
}
```

### 教练员管理
```java
class Trainer {
  private String id;
  private String soldierId;               // 关联人员, 查询返回soldier对象(必填)
  private String organizationId;          // 关联单位, 查询返回organization对象(必填)
  private String level;                   // 教练员等级(必填)
  private Long startedAt;                 // 提升为教练员的日期(必填)
  private List<String> availableCourseIds;  // 主教课目列表, 查询返回availableCourses对象列表
  private List<String> assistCourseIds;     // 备教课目列表, 查询返回assistCourses对象列表

  private Long createdTime;
  private Long updatedTime;
}
```

### 场地管理
```java
class TrainPlace {
  private String id;
  private String name;                // 场地名称(必填)
  private String organizationId;      // 关联单位, 查询返回organization对象(必填)
  private List<String> placeTypes;    // 场地类型列表(必填)
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
}
```