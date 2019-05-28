import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Course from '../../standard/Course';
import MonthPlan from './MonthPlan';

// 分队年度训练计划

// const MonthPlanItemSchema = new Schema({
//  year: Number,
//  month: Number,
//  weekSeq: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，支队或大队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承

//  orgCategory: String,                                                    // 单位分类，训练对象
//  serviceReq: String,                                                     // 勤务类型
//  majors: [String],                                                       // 专业区分 (有些分队，不同专业的阶段训练时间不同，比如工兵分队、防化分队等
//  orgProperty: String,                                                    // 单位属性
//  monthPlan: { type: Schema.Types.ObjectId, ref: 'MonthPlan' },
//  annualPlanId: String,                                                   // 年度计划ID

//  fromDate: Date,                                                         // 起始时间
//  toDate: Date,                                                           // 结束时间
//  days: Number,                                                           // 天数
//  hours: Number,                                                          // 按标准计算的时间
//  hoursInDay: Number,                                                     // 按标准累计昼训时间
//  hoursAtNight: Number,                                                   // 按标准累计夜训时间

//  actualHoursInDay: Number,                                               // 课目累计昼训时间
//  actualHoursAtNight: Number,                                             // 课目累计夜训时间

//  officerCourses: [{                                                      // 警官训练课目
//      seq: Number,
//      name: String,
//      courseId: String,
//      major: String,
//      gunnerType: String
//      trainStep: String,
//      priority: Number,   // 训练顺序，排序用
//      trainUnits: [String],
//      tasks: [String],                                   // 课目对应任务(可多选)
//      serviceReq: [String],                             // 勤务类型要求
//      ranks: [String],                           // 军衔要求(军衔二级分类)
//      hoursInDay: Number,
//      hoursAtNight: Number
//  }],
//  orgCourses: [{                                                          // 分队训练课目
//      seq: Number,
//      name: String,
//      courseId: String,
//      major: String,
//      gunnerType: String
//      trainStep: String,
//      priority: Number,   // 训练顺序，排序用
//      trainUnits: [String],
//      tasks: [String],                                   // 课目对应任务(可多选)
//      serviceReq: [String],                             // 勤务类型要求
//      ranks: [String],                           // 军衔要求(军衔二级分类)
//      hoursInDay: Number,
//      hoursAtNight: Number
//  }],
// });

const MonthPlanItem = Parse.Object.extend("MonthPlanItem", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new MonthPlanItem();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.monthPlan) {
            let parsePlan = MonthPlan.fromObject(parseUtils.fixObject(obj.monthPlan));
            item.set('monthPlan', parsePlan);
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
        return ['organization'];
    }
});

module.exports = MonthPlanItem;
