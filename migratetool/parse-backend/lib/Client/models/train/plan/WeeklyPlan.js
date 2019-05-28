import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, ApproveState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Soldier from '../../resource/Soldier';
import TrainPlace from '../../resource/TrainPlace';
import Course from '../../standard/Course';

// 分队周训练计划

// const WeeklyPlanSchema = new Schema({
//  name: String,                                                           // 显示名称，自动生成
//  year: Number,
//  month: Number,
//  weekSeq: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，中队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  trainOrgs: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],      // 训练单位
//  trainMajors: [String],
//  annualPlanId: String,                                                   // 年度计划ID

//  orgCategory: String,                                                    // 单位分类，训练对象
//  serviceReq: String,                                                     // 勤务类型
//  majors: [String],                                                       // 专业区分 (有些分队，不同专业的阶段训练时间不同，比如工兵分队、防化分队等)
//  orgProperty: String,                                                    // 单位属性
//  state: Number,                                                          // 表单审核状态(见ApprovedState)

//  fromDate: Date,                                                         // 起始日期
//  toDate: Date,                                                           // 结束日期
//  isLastWeek: Boolean,                                                    // 是否为当月最后一周
// 	hoursInDay: Number,                                                     // 昼训课时
// 	hoursAtNight: Number,                                                   // 夜训课时

// 	flexibleCourse: { type: Schema.Types.ObjectId, ref: 'Course' },         // 机动内容课目
// 	flexibleTrainer: { type: Schema.Types.ObjectId, ref: 'Soldier' },       // 机动内容教练员
// 	flexiblePlace: { type: Schema.Types.ObjectId, ref: 'TrainPlace' }       // 机动内容场地

//  officerCourses: [{                                                      // 警官训练课目
//      seq: Number,
//      name: String,
//      courseId: String,
//      major: String,
//      trainStep: String,
//      priority: Number,   // 训练顺序，排序用
//      trainUnits: [String],
//      hoursInDay: Number,
//      hoursAtNight: Number
//  }],

// 	commander1: { type: Schema.Types.ObjectId, ref: 'Soldier' },			// 中队长
// 	commander2: { type: Schema.Types.ObjectId, ref: 'Soldier' },			// 指导员
//  theDuty: { type: Schema.Types.ObjectId, ref: 'Soldier' },               // 本周值班员
//  approvedBy: { type: Schema.Types.ObjectId, ref: 'Soldier' },			// 大队长或参谋长
//  approvedByName: String,                                                 // 审批人姓名
//  approvedByPosition: String,                                             // 审批人职务
//  approvedBy2: { type: Schema.Types.ObjectId, ref: 'Soldier' },			// 教导员
//  approvedByName2: String,                                                 // 审批人姓名
//  approvedByPosition2: String,                                             // 审批人职务
//  approveTargetOrgId: String,                                             // 审批单位ID

//  ensures: String,                                                        // 保障措施
//  methods: String,                                                        // 实施方法
//  notes: String
// });

const WeeklyPlan = Parse.Object.extend("WeeklyPlan", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', ApproveState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new WeeklyPlan();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.trainOrgs) {
            let trainOrgs = parseUtils.fixObjectArray(Organization, obj.trainOrgs);
            if (trainOrgs) item.set('trainOrgs', trainOrgs);
        }
        if (obj.commander1) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.commander1));
            item.set('commander1', parseSoldier);
        }
        if (obj.commander2) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.commander2));
            item.set('commander2', parseSoldier);
        }
        if (obj.theDuty) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.theDuty));
            item.set('theDuty', parseSoldier);
        }
        if (obj.approvedBy) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.approvedBy));
            item.set('approvedBy', parseSoldier);
        }
        if (obj.approvedBy2) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.approvedBy));
            item.set('approvedBy2', parseSoldier);
        }
        if (obj.flexibleCourse) {
            let parseCourse = Course.fromObject(parseUtils.fixObject(obj.flexibleCourse));
            item.set('flexibleCourse', parseCourse);
        }
        if (obj.flexibleTrainer) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.flexibleTrainer));
            item.set('flexibleTrainer', parseSoldier);
        }
        if (obj.flexiblePlace) {
            let parsePlace = TrainPlace.fromObject(parseUtils.fixObject(obj.flexiblePlace));
            item.set('flexiblePlace', parsePlace);
        }
        if (obj.officerCourses) {
            let officerCourses = parseUtils.fixObjectArray(Course, obj.officerCourses);
            if (officerCourses) item.set('officerCourses', officerCourses);
        }

        if (!obj.objectId) {
            parseUtils.setACL(item, obj, {
                readRoles: [RoleName.Administrator, RoleName.Reader],
                writeRoles: [RoleName.Operator]
            });
        }

        return item;
    },
    getIncludes: function() {
        return ['organization', 'trainOrgs', 'commander1', 'commander2', 'approvedBy', 'approvedBy2', 'theDuty', 'flexibleCourse', 'flexibleTrainer', 'flexiblePlace', 'officerCourses'];
    }
});

module.exports = WeeklyPlan;
