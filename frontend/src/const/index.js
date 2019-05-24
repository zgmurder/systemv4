export const mapModules = [
  {
    roles: null,
    name: '训练工作',
    value: 'train',
    path: 'dashboard'
  },
  {
    roles: null,
    name: '单位管理',
    value: 'organization',
    path: 'orgManage'
  },
  {
    roles: null,
    name: '账户权限',
    value: 'account'
  },
  {
    roles: ['Administrator'],
    name: '大纲标准',
    value: 'standard'
  },
  {
    roles: ['Administrator'],
    name: '基础数据',
    value: 'basedata',
    path: 'orgRelated'
  }
]
// 定义常用的返回值
export const ResultCode = {
  Ok: 0,
  Error: 1
}
export const SystemTypes = [{
  name: '军事训练管理系统'
}]
// 定义账号角色类型
export const RoleId = {
  Administrator: 0,
  Manager: 1,
  Operator: 2,
  Network: 3,
  Reader: 4
}

export const RoleName = {
  Administrator: 'Administrator',
  Manager: 'Manager',
  Operator: 'Operator',
  Network: 'Network',
  Reader: 'Reader'
}

export const UserRoles = [{
  role: RoleId.Administrator,
  nameEn: 'Administrator',
  nameCh: '系统管理账号',
  withOrg: false,
  allowBS: true
}, {
  role: RoleId.Manager,
  nameEn: 'Manager',
  nameCh: '业务管理账号',
  withOrg: true,
  allowBS: true
}, {
  role: RoleId.Operator,
  nameEn: 'Operator',
  nameCh: '操作账号',
  withOrg: true,
  allowBS: true
}, {
  role: RoleId.Network,
  nameEn: 'Network',
  nameCh: '网络账号',
  withOrg: false,
  allowBS: false
}, {
  role: RoleId.Reader,
  nameEn: 'Reader',
  nameCh: '只读账号',
  withOrg: false,
  allowBS: false
}]

// 定义部队单位类型
export const OrgType = {
  Troop: '部队',
  UnitForce: '分队',
  LeaderOffice: '首长机关',
  Department: '部门'
}
export const PhysicalLevel = {
  '0': '新兵',
  '1': '一类人员',
  '2': '二类人员',
  '3': '三类人员'
}
// 定义部队编制序列
export const OrgSequence = {
  // LeaderOffice: 0,     // 首长机关
  Army: 1, // 军/总部
  Division: 2, // 师/总队
  Brigade: 3, // 旅
  Regiment: 4, // 团/支队
  Battalion: 5, // 营/大队
  Company: 6, // 连/中队
  Platoon: 7, // 排
  Squad: 8, // 班
  Soldier: 9 // 单兵
}

export const OrgLevelOptions = {
  [OrgSequence.Army]: ['总队', '支队', '中队'],
  [OrgSequence.Division]: ['支队', '中队'],
  [OrgSequence.Brigade]: ['中队'],
  [OrgSequence.Regiment]: ['中队'],
  [OrgSequence.Battalion]: ['中队'],
  [OrgSequence.Company]: []
}

export const OrgSequenceMap = {
  '总部': [OrgSequence.Army],
  '总队': [OrgSequence.Division],
  '支队': [OrgSequence.Brigade, OrgSequence.Regiment],
  '大队': [OrgSequence.Battalion],
  '中队': [OrgSequence.Company],
  '排': [OrgSequence.Platoon],
  '班': [OrgSequence.Squad]
}

export const OrgSequences = [{
  //     type: OrgSequence.LeaderOffice,
  //     name: '首长机关',
  //     describe: '首长机关',
  //     egType:'danger'
  // },{
  type: OrgSequence.Army,
  name: '总部',
  describe: '部队',
  egType: 'warning'
}, {
  type: OrgSequence.Division,
  name: '总队',
  describe: '部队',
  egType: 'warning'
}, {
  type: OrgSequence.Brigade,
  name: '旅级支队',
  describe: '部队',
  egType: 'warning'
}, {
  type: OrgSequence.Regiment,
  name: '团级支队',
  describe: '部队',
  egType: 'warning'
}, {
  type: OrgSequence.Battalion,
  name: '大队',
  describe: '分队',
  egType: 'success'
}, {
  type: OrgSequence.Company,
  name: '中队',
  describe: '分队',
  egType: 'success'
}, {
  type: OrgSequence.Platoon,
  name: '排',
  describe: '分队',
  egType: 'success'
}, {
  type: OrgSequence.Squad,
  name: '班',
  describe: '分队',
  egType: 'success'
}, {
  type: OrgSequence.Soldier,
  name: '单兵',
  describe: '人员',
  egType: 'info'
}]

export const IsZongDui = (seq) => {
  return seq === OrgSequence.Division
}
export const IsZhiDui = (seq) => {
  return seq === OrgSequence.Brigade || seq === OrgSequence.Regiment
}
export const IsDaDui = (seq) => {
  return seq === OrgSequence.Battalion
}
export const IsZhongDui = (seq) => {
  return seq >= OrgSequence.Company
}

export const OrgSequenceName = (seq) => {
  const seqItem = OrgSequences.find(item => item.type === seq)
  return (seqItem && seqItem.name) || ''
}

export const Departments = [{
  orgSeq: OrgSequence.Division,
  departs: [{
    seq: 0,
    name: '指挥员',
    majors: ['指挥员']
  }, {
    seq: 1,
    name: '参谋部',
    majors: ['作战勤务', '作训', '情报', '信息通信', '部队管理', '机要']
  }, {
    seq: 2,
    name: '政治工作部',
    majors: ['组织', '人力资源', '宣传', '保卫']
  }, {
    seq: 3,
    name: '保障部',
    majors: ['战勤计划', '财务', '军需营房', '卫生', '运输投送', '装备保障']
  }]
}, {
  orgSeq: OrgSequence.Brigade,
  departs: [{
    seq: 0,
    name: '指挥员',
    majors: ['指挥员']
  }, {
    seq: 1,
    name: '参谋部',
    majors: ['作训', '侦察', '信息通信', '部队管理', '机要']
  }, {
    seq: 2,
    name: '政治工作部',
    majors: ['组织', '人力资源', '宣传', '保卫']
  }, {
    seq: 3,
    name: '保障部',
    majors: ['战勤计划', '财务', '军需营房', '运输投送', '装备保障']
  }]
}, {
  orgSeq: OrgSequence.Regiment,
  departs: [{
    seq: 0,
    name: '指挥员',
    majors: ['指挥员']
  }, {
    seq: 1,
    name: '参谋部',
    majors: ['作训', '侦察', '信息通信', '部队管理', '机要']
  }, {
    seq: 2,
    name: '政治工作处',
    majors: ['组织', '人力资源', '宣传', '保卫']
  }, {
    seq: 3,
    name: '保障处',
    majors: ['战勤计划', '财务', '军需营房', '运输投送', '装备保障']
  }]
}]

export const TrainMethods = ['个人自学', '个人自训', '专题辅导', '理论辅导', '专题研究', '现场勘查', '作业练习', '单方作业', '对抗作业']

// 定义人员属性
export const PersonProperty = {
  Soldier: '分队',
  Officer: '警官',
  TechOfficer: '技术警官',
  Supporter: '保障人员',
  // OfficialMember: '正式队员',
  ReserveMember: '预备队员',
  Recruit: '新兵',
  RecruitOfficer: '新训干部骨干'
}

export const SpecialForce = {
  FightMember: '作战队员',
  ReserveMember: '预备队员'
}

// 军兵种分类
export const TroopCategory = {
  LandForce: '地面人员',
  AirForce: '空勤人员',
  BoatForce: '船艇人员'
}

// 人员类别
export const SoldierCategories = ['指挥警官', '技术警官', '文职人员', '士官', '义务兵']
export const SoldierCategory = {
  Officer: '指挥警官',
  TechOfficer: '技术警官',
  CivilServant: '文职人员',
  Sergeant: '士官',
  Soldier: '义务兵'
}

export const myPersonProperty = ((obj) => {
  const arr = []
  const types = ['danger', 'warning', 'warning', 'warning', 'success', 'success']
  // const describes = ['总部、总队或支队的机关部门', '部队类型', '部队类型', '部队类型', '分队类型', '分队类型']
  Object.values(obj).forEach((item, index) => {
    arr.push({
      name: item,
      index: index,
      egType: types[index]
    })
  })
  return arr
})(PersonProperty)

// 大纲启用状态
export const StandardState = {
  Initial: '未启用',
  Using: '已启用',
  Stopped: '已停用'
}

// 训练考核方式
export const AssessMethod = {
  Normal: '普考',
  Sampling: '抽考',
  Train: '训练'
}

// 评分标准
export const ScoreType = {
  Number: '分数制',
  Level: '多级制'
}

// 评分对象
export const ScoreTarget = {
  Individual: '个人',
  Group: '集体'
}
// 年龄段
export const AgeSection = [
  '18岁~25岁', '26岁~32岁', '33岁~40岁', '40岁以上'
]

// 教龄
export const TeachAgeSection = [
  '0~3年', '4年~6年', '7年~9年', '10年以上'
]

// 分级成绩评分等级定义6
export const ScoreLevel = {
  Unpass: 1, // 不及格或不合格
  Pass: 2, // 及格或合格
  Good: 3, // 良好
  Excellent: 4, // 优秀
  ExtraL3: 5, // 特三级
  ExtraL2: 6, // 特二级
  ExtraL1: 7 // 特一级
}
export const ScoreLevel1 = {
  '1': '不及格或不合格',
  '2': '及格或合格',
  '3': '良好',
  '4': '优秀',
  '5': '特三级',
  '6': '特二级',
  '7': '特一级'
}

export const ScoreCriteria = {
  Level2: {
    name: '二级制',
    optionalScores: ['不合格', '合格']
  },
  Level4: {
    name: '四级制',
    optionalScores: ['不及格', '及格', '良好', '优秀']
  },
  Level7: {
    name: '七级制',
    optionalScores: ['不及格', '及格', '良好', '优秀', '特三级', '特二级', '特一级']
  },
  NumberScore: {
    name: '百分制'
  }
}

export const ScoreLevel2 = {
  Lack: 0, // 缺考
  Unpass: 1, // 不及格或不合格
  Pass: 2, // 及格或合格
  Good: 3, // 良好
  Excellent: 4, // 优秀
  ExtraL3: 5, // 特三级
  ExtraL2: 6, // 特二级
  ExtraL1: 7 // 特一级
}

export const ScoreCriteria2 = {
  Level2: {
    name: '二级制',
    optionalScores: ['未参考', '不合格', '合格']
  },
  Level4: {
    name: '四级制',
    optionalScores: ['未参考', '不及格', '及格', '良好', '优秀']
  },
  Level7: {
    name: '七级制',
    optionalScores: ['未参考', '不及格', '及格', '良好', '优秀', '特三级', '特二级', '特一级']
  },
  NumberScore: {
    name: '百分制'
  }
}

export const Ranks = [{
  name: '列兵',
  rankLevel1: '义务兵',
  rankLevel2: '义务兵'
}, {
  name: '上等兵',
  rankLevel1: '义务兵',
  rankLevel2: '义务兵'
}, {
  name: '下士',
  rankLevel1: '士官',
  rankLevel2: '初级士官'
}, {
  name: '中士',
  rankLevel1: '士官',
  rankLevel2: '初级士官'
}, {
  name: '上士',
  rankLevel1: '士官',
  rankLevel2: '中级士官'
}, {
  name: '四级军士长',
  rankLevel1: '士官',
  rankLevel2: '中级士官'
}, {
  name: '三级军士长',
  rankLevel1: '士官',
  rankLevel2: '高级士官'
}, {
  name: '二级军士长',
  rankLevel1: '士官',
  rankLevel2: '高级士官'
}, {
  name: '一级军士长',
  rankLevel1: '士官',
  rankLevel2: '高级士官'
}, {
  name: '少尉',
  rankLevel1: '军官',
  rankLevel2: '尉官'
}, {
  name: '中尉',
  rankLevel1: '军官',
  rankLevel2: '尉官'
}, {
  name: '上尉',
  rankLevel1: '军官',
  rankLevel2: '尉官'
}, {
  name: '少校',
  rankLevel1: '军官',
  rankLevel2: '校官'
}, {
  name: '中校',
  rankLevel1: '军官',
  rankLevel2: '校官'
}, {
  name: '上校',
  rankLevel1: '军官',
  rankLevel2: '校官'
}, {
  name: '大校',
  rankLevel1: '军官',
  rankLevel2: '校官'
}, {
  name: '少将',
  rankLevel1: '军官',
  rankLevel2: '将官'
}, {
  name: '中将',
  rankLevel1: '军官',
  rankLevel2: '将官'
}, {
  name: '上将',
  rankLevel1: '军官',
  rankLevel2: '将官'
}]

export const MapRankToLevel1 = (rank) => {
  const rankObj = Ranks.find(item => item.name === rank)
  return (rankObj || {}).rankLevel1
}
export const MapRankToLevel2 = (rank) => {
  const rankObj = Ranks.find(item => item.name === rank)
  return (rankObj || {}).rankLevel2
}

export const PoliticalStatus = [
  '党员', '团员', '群众'
]

export const Gender = {
  Male: '男',
  Female: '女'
}

// 成绩计数方式
export const CountType = {
  Time: '时间',
  Amount: '数量'
}

// 定义军械分类
export const OrdnanceCategory = {
  Weapon: '武器',
  Bullet: '弹药',
  Supplies: '物资'
}

// 武器年度消耗数量类型
export const BulletNumType = {
  PerPerson: '单人',
  PerGun: '单枪',
  PerCannon: '单炮',
  PerTeam: '单班组',
  Amount: '总量'
}

// 人员服役状态
export const InServiceStatus = {
  InService: 0, // 服役中
  Retired: 1, // 已退役
  Transferred: 2, // 已调离
  TmpRemoved: 3, // 暂离深造
  Names: ['服役中', '已退役', '已调离', '暂离深造'],
  RetiredReasons: ['退伍', '转业', '离休', '退休']
}

// 场地建设状态
export const PlaceBuiltStatus = {
  Built: 0, // 已建
  Building: 1, // 在建
  Unbuilt: 2, // 未建
  Names: ['已建', '在建', '未建']
}

// 课目分类
export const CourseCategory = {
  Train: 0,
  Sport: 1,
  Politics: 2,
  Activity: 3,
  Others: 4,
  Custom: 5
}

export const CourseOption = {
  ThisWeek: 0, // 本周课目选项
  ThisStage: 1, // 本月课目选项
  ThisYear: 2 // 本年课目选项
}

export const CourseCategorys = [{
  id: CourseCategory.Train,
  name: '军事课目',
  link: 'train'
}, {
  id: CourseCategory.Sport,
  name: '体育课目',
  link: 'sport'
}, {
  id: CourseCategory.Politics,
  name: '政治教育',
  link: 'politics'
}, {
  id: CourseCategory.Activity,
  name: '党团活动',
  link: 'activity'
}, {
  id: CourseCategory.Others,
  name: '其它工作',
  link: 'others'
}
  /*, {
      id: CourseCategory.Custom,
      name: '自定义课目',
      link: 'custom'
  },*/
]

export const AssessCourseCategorys = ['军事课目', '体育课目', '体型']
export const AssessCourseCategory = {
  Train: '军事课目',
  Sport: '体育课目',
  Shape: '体型'
}

export const TrainRequirement = {
  Required: '必训',
  Optional: '选训',
  Self: '自训'
}

export const TestRequirement = {
  Required: '必考',
  Optional: '选考'
}

export const SubmitState = {
  Initial: 0,
  Submited: 1
}

export const SubmitStates = ['未提交', '已提交']

export const ApproveState = {
  Initial: 0,
  Rejected: 1,
  Approving: 2,
  Approved: 3
}

export const ApproveStates = ['草稿', '退回重改', '审核中', '审核通过']

export const CourseState = {
  Initial: 0,
  Progress: 1,
  WaitTest: 2,
  Finished: 3
}

export const CourseStates = ['未开始', '进行中', '待考核', '已完成']

export const SportTestCategory = {
  Required: 0,
  Optional: 1
}

export const SportTestCategories = ['通用课目', '专项课目组']

export const TimeUnit = {
  Daily: '每日',
  Weekly: '每周',
  Monthly: '每月',
  Quarterly: '每季度',
  Yearly: '每年'
}

export const DailySection = {
  EarlyMoring: '早操',
  Morning: '上午',
  Afternoon: '下午',
  Night: '夜间',
  Sport: '体能'
}

export const DayType = {
  Workday: '工作日',
  Weekend: '休息日',
  Holiday: '节假日'
}

export const WeekDays = [{
  value: 0,
  name: '星期日',
  shortName: '日'
}, {
  value: 1,
  name: '星期一',
  shortName: '一'
}, {
  value: 2,
  name: '星期二',
  shortName: '二'
}, {
  value: 3,
  name: '星期三',
  shortName: '三'
}, {
  value: 4,
  name: '星期四',
  shortName: '四'
}, {
  value: 5,
  name: '星期五',
  shortName: '五'
}, {
  value: 6,
  name: '星期六',
  shortName: '六'
}]

export const Monthes = [{
  value: 1,
  name: '一月份',
  shortName: '一'
}, {
  value: 2,
  name: '二月份',
  shortName: '二'
}, {
  value: 3,
  name: '三月份',
  shortName: '三'
}, {
  value: 4,
  name: '四月份',
  shortName: '四'
}, {
  value: 5,
  name: '五月份',
  shortName: '五'
}, {
  value: 6,
  name: '六月份',
  shortName: '六'
}, {
  value: 7,
  name: '七月份',
  shortName: '七'
}, {
  value: 8,
  name: '八月份',
  shortName: '八'
}, {
  value: 9,
  name: '九月份',
  shortName: '九'
}, {
  value: 10,
  name: '十月份',
  shortName: '十'
}, {
  value: 11,
  name: '十一月份',
  shortName: '十一'
}, {
  value: 12,
  name: '十二月份',
  shortName: '十二'
}]

// 成绩评定规则部分定义
export const ScoreCategory = {

  // 个人课目成绩
  PersonCourseScore: '个人单课目训练成绩',
  PersonAnnualScore: '个人年度训练成绩',

  // 单位课目成绩
  OrgOneCourseScore: '单位单课目训练成绩',
  OrgMultipleCourseScore: '单位多课目训练成绩',

  // 单位年度训练成绩
  OrgAnnualScore: '单位年度训练成绩',
  TroopAnnualScore: '部队年度训练成绩',
  UnitForceAnnualScore: '分队年度训练成绩',
  LeaderOfficeAnnualScore: '首长机关年度训练成绩',

  // 部队年度训练成绩组成
  TroopOfficeAnnualScore: '本机机关年度训练成绩',
  TroopSubOrgAnnualScore: '下级单位年度训练成绩',
  TroopTacticsScore: '部队战术（战役）训练成绩',

  // 分队年度训练成绩组成
  UnitForceCommanderAnnualScore: '本级指挥员年度训练成绩',
  UnitForceSubOrgAnnualScore: '下级单位年度训练成绩',
  UnitForceSubPersonAnnualScore: '个人年度训练成绩',
  UnitForceTacticsScore: '本级战术训练（专业合练）成绩',

  // 首长机关年度训练成绩组成
  LeaderOfficePersonAnnualScore: '机关个人年度训练成绩',
  LeaderOfficeTacticsScore: '战术（战役）作业成绩',
  LeaderOfficeExerciseScore: '指挥所演习成绩',

  // 军事体育训练成绩
  PersonSportAnnualScore: '个人年度军事体育训练成绩',
  OrgSportAnnualScore: '单位年度军事体育训练成绩'
}
export const AdminOrganization = {
  orgSequence: 1,
  name: 'admin单位'

}

export const Operate = {
  ADD: 0,
  EDIT: 1,
  DELETE: 2
}
