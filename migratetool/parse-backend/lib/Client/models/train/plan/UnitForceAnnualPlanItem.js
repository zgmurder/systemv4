import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Course from '../../standard/Course';
import UnitForceAnnualPlan from './UnitForceAnnualPlan';

// 分队年度训练计划

// const UnitForceAnnualPlanSchema = new Schema({
//  year: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，总队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  orgCategory: String,                                                    // 单位分类
//  serviceReq: String,                                                     // 勤务类型
//  majors: [String],                                                       // 专业区分 (有些分队，不同专业的阶段训练时间不同，比如工兵分队、防化分队等
//  orgProperty: String,                                                    // 单位属性
//  annualPlan: { type: Schema.Types.ObjectId, ref: 'UnitForceAnnualPlan' },

//  task: String,
//  subjects: [String],
//  fromDate: Date,
//  toDate: Date,
//  hours: Number,                                                          // 按标准计算的时间
//  hoursInDay: Number,                                                     // 按标准累计昼训时间
//  hoursAtNight: Number,                                                   // 按标准累计夜训时间

//  officerCourses: [{type: Schema.Types.ObjectId, ref: 'Course'}],          // 警官训练课目
//  officerCourseTimes: [{                                                  // 警官训练课目课时要求
//      courseIds: [String],                                                // 可多课目重合共享训练课时
//      hoursInDay: Number,
//      hoursAtNight: Number
//  }],

//  commonCourses: [{type: Schema.Types.ObjectId, ref: 'Course'}],          // 分队训练课目
//  commonCourseTimes: [{                                                  // 警官训练课目课时要求
//      courseIds: [String],                                                // 可多课目重合共享训练课时
//      hoursInDay: Number,
//      hoursAtNight: Number
//  }],
//  majorCourses: [{type: Schema.Types.ObjectId, ref: 'Course'}],          // 分队专业训练课目
//  majorCoursesV2: [{                                                      // 分队专业训练课目，兼容工兵分队而设计
//      majorReq: String,
//      courseId: String
//  }],
//  majorCourseTimes: [{                                                  // 分队专业训练课目课时要求
//      majorReq: String,                                                 // 课目专业
//      courseIds: [String],                                              // 可多课目重合共享训练课时
//      hoursInDay: Number,
//      hoursAtNight: Number
//  }],
// });

const UnitForceAnnualPlanItem = Parse.Object.extend("UnitForceAnnualPlanItem", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new UnitForceAnnualPlanItem();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.annualPlan) {
            let parsePlan = UnitForceAnnualPlan.fromObject(parseUtils.fixObject(obj.annualPlan));
            item.set('annualPlan', parsePlan);
        }
        if (obj.officerCourses) {
            let parseCourses = parseUtils.fixObjectArray(Course, obj.officerCourses);
            item.set('officerCourses', parseCourses);
        }
        if (obj.commonCourses) {
            let parseCourses = parseUtils.fixObjectArray(Course, obj.commonCourses);
            item.set('commonCourses', parseCourses);
        }
        if (obj.majorCourses) {
            let parseCourses = parseUtils.fixObjectArray(Course, obj.majorCourses);
            item.set('majorCourses', parseCourses);
        }

        if (!obj.objectId) {
            var acl = new Parse.ACL();
            acl.setRoleReadAccess(RoleName.Operator, true);
            acl.setRoleReadAccess(RoleName.Reader, true);
            acl.setRoleWriteAccess(RoleName.Operator, true);
            item.setACL(acl);
        }

        return item;
    },
    getIncludes: function() {
        return ['organization', 'officerCourses', 'commonCourses', 'majorCourses'];
    }
});

module.exports = UnitForceAnnualPlanItem;
