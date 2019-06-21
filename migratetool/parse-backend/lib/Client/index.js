import Parse from './parse';

export default {
	Object: Parse.Object,
	Cloud: Parse.Cloud,
	User: require('./models/auth/User'),
	Role: Parse.Role,
	ACL: Parse.ACL,
	Config: Parse.Config,
	Error: Parse.Error,
	File: Parse.File,
	Promise: Parse.Promise,
	Query: Parse.Query,
	Relation: Parse.Relation,
	LiveQuery: Parse.LiveQuery,
	LiveQueryClient: Parse.LiveQueryClient,
	Schema: Parse.Schema,

	// 基础数据接口
	OrgProperty: require('./models/dictionary/OrgProperty'),
	OrgCategory: require('./models/dictionary/OrgCategory'),
	SpecialMission: require('./models/dictionary/SpecialMission'),
	MilitaryRank: require('./models/dictionary/MilitaryRank'),
	Position: require('./models/dictionary/Position'),
    Position2: require('./models/dictionary/Position2'),
	SupporterMajor: require('./models/dictionary/SupporterMajor'),
	TrainerLevel: require('./models/dictionary/TrainerLevel'),
	PhysicalLevel: require('./models/dictionary/PhysicalLevel'),
	TrainStep: require('./models/dictionary/TrainStep'),
	PlaceType: require('./models/dictionary/PlaceType'),
    GroupTrainMethod: require('./models/dictionary/GroupTrainMethod'),
	MotorType: require('./models/dictionary/MotorType'),
	ScoreCriteria: require('./models/dictionary/ScoreCriteria'),
	WeatherType: require('./models/dictionary/WeatherType'),
	OrdnanceType: require('./models/dictionary/OrdnanceType'),
	GunnerType: require('./models/dictionary/GunnerType'),
    SportCategory: require('./models/dictionary/SportCategory'),

    // 训练大纲
    TrainStandard: require('./models/standard/TrainStandard'),
	TrainSection: require('./models/standard/TrainSection'),
	Course: require('./models/standard/Course'),
	TrainCourse: require('./models/standard/TrainCourse'),
	SportCourse: require('./models/standard/SportCourse'),
	PoliticsCourse: require('./models/standard/PoliticsCourse'),
	ActivityCourse: require('./models/standard/ActivityCourse'),
	OthersCourse: require('./models/standard/OthersCourse'),
	CourseTime: require('./models/standard/CourseTime'),
	CourseDistribution: require('./models/standard/CourseDistribution'),
    SportTime: require('./models/standard/SportTime'),
	SportAssessReq: require('./models/standard/SportAssessReq'),
	SportCourseGroup: require('./models/standard/SportCourseGroup'),
	TrainStageTime: require('./models/standard/TrainStageTime'),

	// 八落实指标要求
    PersonRequirement: require('./models/standard/PersonRequirement'),
	TimeRequirement: require('./models/standard/TimeRequirement'),
	BulletRequirement: require('./models/standard/BulletRequirement'),
	MotorRequirement: require('./models/standard/MotorRequirement'),
	PlaceRequirement: require('./models/standard/PlaceRequirement'),
	PersonScoreRequirement: require('./models/standard/PersonScoreRequirement'),
	OrgScoreRequirement: require('./models/standard/OrgScoreRequirement'),


    // 军事成绩评定规则
    OrgSingleCourseScoreRule: require('./models/rule/OrgSingleCourseScoreRule'),
    OrgMultipleCourseScoreRule: require('./models/rule/OrgMultipleCourseScoreRule'),
    PersonAnnualScoreRule: require('./models/rule/PersonAnnualScoreRule'),
    MultipleTargetScoreRule: require('./models/rule/MultipleTargetScoreRule'),
    UnitForceAnnualScoreRule: require('./models/rule/UnitForceAnnualScoreRule'),
    LeaderOfficeAnnualScoreRule: require('./models/rule/LeaderOfficeAnnualScoreRule'),
    TroopAnnualScoreRule: require('./models/rule/TroopAnnualScoreRule'),

    // 体育成绩评分标准
    BMIStandard: require('./models/standard/BMIStandard'),
	PBFStandard: require('./models/standard/PBFStandard'),
	SportScoreStandard: require('./models/rule/SportScoreStandard'),
	PersonSportScoreStandard: require('./models/rule/PersonSportScoreStandard'),
	OrgSportScoreStandard: require('./models/rule/OrgSportScoreStandard'),

	// 全局规则
    CourseRule: require('./models/rule/CourseRule'),
	RetrainRule: require('./models/rule/RetrainRule'),
	CompetitionRule: require('./models/rule/CompetitionRule'),
	DailySchedule: require('./models/rule/DailySchedule'),

	// 资源管理
	Organization: require('./models/resource/Organization'),
	OosOrganization: require('./models/resource/OosOrganization'),
	Person: require('./models/resource/Person'),
	PersonBiometric: require('./models/resource/PersonBiometric'),
	Soldier: require('./models/resource/Soldier'),
	Trainer: require('./models/resource/Trainer'),
	TrainPlace: require('./models/resource/TrainPlace'),
	WeaponStock: require('./models/resource/WeaponStock'),
	VideoChannel: require('./models/resource/VideoChannel'),

	// 登记统计
	DailyReport: require('./models/train/report/DailyReport'),
	MonthlyReportL1: require('./models/train/report/MonthlyReportL1'),
	MonthlyReportL2: require('./models/train/report/MonthlyReportL2'),
	QuarterReport: require('./models/train/report/QuarterReport'),

	// 成绩管理
    Assessment: require('./models/train/score/Assessment'),
	AssessEvent: require('./models/train/score/AssessEvent'),
	PersonScore: require('./models/train/score/PersonScore'),
	PersonAnnualScore: require('./models/train/score/PersonAnnualScore'),
	OrgScore: require('./models/train/score/OrgScore'),
	UnitForceAnnualScore: require('./models/train/score/UnitForceAnnualScore'),
	OfficeAnnualScore: require('./models/train/score/OfficeAnnualScore'),
	TroopAnnualScore: require('./models/train/score/TroopAnnualScore'),
	//体育成绩
	SportScore: require('./models/train/score/SportScore'),
    SportCalculateStatus: require('./models/train/score/SportCalculateStatus'),
	PhysicalShape: require('./models/train/score/PhysicalShape'),
	PersonSportAnnualScore: require('./models/train/score/PersonSportAnnualScore'),
	OrgSportAnnualScore: require('./models/train/score/OrgSportAnnualScore'),
	TroopSportAnnualScore: require('./models/train/score/TroopSportAnnualScore'),
    ScoreStatisticAnalysis:require('./models/train/score/ScoreStatisticAnalysis'),

    PersonTrainArchive: require('./models/train/score/PersonTrainArchive'),

    PersonScoreRank: require('./models/train/score/PersonScoreRank'),
    OrgScoreRank: require('./models/train/score/OrgScoreRank'),

	// 军事训练计划
	AnnualPlanSummary: require('./models/train/plan/AnnualPlanSummary'),
	AnnualStage: require('./models/train/plan/AnnualStage'),
	OfficeAnnualPlan: require('./models/train/plan/OfficeAnnualPlan'),
	UnitForceAnnualPlan: require('./models/train/plan/UnitForceAnnualPlan'),
	UnitForceAnnualPlanItem: require('./models/train/plan/UnitForceAnnualPlanItem'),
	StagePlan: require('./models/train/plan/StagePlan'),
	StagePlanItem: require('./models/train/plan/StagePlanItem'),
	MonthPlan: require('./models/train/plan/MonthPlan'),
	MonthPlanItem: require('./models/train/plan/MonthPlanItem'),
	CourseTimeStatus: require('./models/train/plan/CourseTimeStatus'),
	WeeklyPlan: require('./models/train/plan/WeeklyPlan'),
	DailyLesson: require('./models/train/plan/DailyLesson'),
	CourseStatus: require('./models/train/plan/CourseStatus'),
	OfficeMonthPlan: require('./models/train/plan/OfficeMonthPlan'),
	OfficeDailyLesson: require('./models/train/plan/OfficeDailyLesson'),

	AnnualPlanTarget: require('./models/train/plan/AnnualPlanTarget'),

	// 其它表格
	Holiday: require('./models/train/others/Holiday'),
	ApproveRecord: require('./models/train/others/ApproveRecord'),
	Announcement: require('./models/train/others/Announcement'),
	OperateRecord: require('./models/train/others/OperateRecord'),

	// 后台管理功能
	CustomerAdvice: require('./models/backend/CustomerAdvice'),

    // 八落实统计表
    MonthParticipationRate: require('./models/statistics/participation/MonthParticipationRate'),
    YearParticipationRate: require('./models/statistics/participation/YearParticipationRate'),
    DailyParticipationRate: require('./models/statistics/participation/DailyParticipationRate'),

    TrainHoursStatistics: require('./models/statistics/TrainHoursStatistics'),

    PlaceStatistics: require('./models/statistics/trainPlace/PlaceStatistics'),
    TroopsPlaceStatistics: require('./models/statistics/trainPlace/TroopsPlaceStatistics'),

    MotorStatistics: require('./models/statistics/MotorStatistics'),

    CompletionRateStatistics: require('./models/statistics/CompletionRateStatistics'),

    BulletStatistics: require('./models/statistics/BulletStatistics'),

    QualityStatistics: require('./models/statistics/quality/QualityStatistics'),
    UnitForceQualityStatistics: require('./models/statistics/quality/UnitForceQualityStatistics'),
    WorkQualityStatistics: require('./models/statistics/quality/WorkQualityStatistics'),

    TrainContentStatistics: require('./models/statistics/TrainContentStatistics'),

    TrainerStatistics: require('./models/statistics/trainer/TrainerStatistics'),
    TrainerCourseStatistics: require('./models/statistics/trainer/TrainerCourseStatistics'),

    TableStatistics: require('./models/statistics/TableStatistics'),

    SoldierNumberStatistics: require('./models/statistics/SoldierNumberStatistics'),

    // 兼容V3.x版本的成绩相关表单
    AssessEventV3x: require('./v3models/AssessEvent'),
    PersonScoreV3x: require('./v3models/PersonScore'),
    SportEventV3x: require('./v3models/SportEvent'),
    SportScoreV3x: require('./v3models/SportScore'),
    PhysicalShapeV3x: require('./v3models/PhysicalShape')
};
