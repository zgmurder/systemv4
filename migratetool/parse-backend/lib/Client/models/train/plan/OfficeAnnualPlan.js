import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Course from '../../standard/Course';

// 首长机关年度训练计划

// const OfficeAnnualPlanSchema = new Schema({
//  year: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，总队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  orgSequence: String,                                                    // 编制序列(总队/支队)
//  orgCategory: String,                                                    // 单位分类

//  trainSteps: [{                                                          // 保存各个训练步骤的时间统计
//      name: String,                                                       // 训练步骤名称
//      hoursInDay: Number,                                                 // 昼训课时
//      hoursAtNight: Number,                                               // 夜训课时
//
//      commonCourses: [{                                                   // 公共课目列表（只用于界面显示，不保存到数据库）
//          name: String,
//          courseId: String,
//      }],
//      majorCourses: [{                                                    // 专业课目列表（只用于界面显示，不保存到数据库）
//          name: String,
//          courseId: String,
//          depart: String,                                                 // 部门
//          major: String                                                   // 专业
//      }]
//
//      commonStats: {                                                           // 公共课目课时（有专业课目时有效）
//          name: String,
//          hoursInDay: Number,
//          hoursAtNight: Number,
//      },
//      majorStats: {                                                            // 专业课目课时（有专业课目时有效）
//          name: String,
//          hoursInDay: Number,
//          hoursAtNight: Number,
//      },
//  }],
//  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]               // 年度安排的所有课目，保存到数据库，不做界面显示
//  timeReq: String,
//  activities: String,
//  scoreReqs: String,
//  methods: String,
//  notes: String,
// });

const OfficeAnnualPlan = Parse.Object.extend("OfficeAnnualPlan", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new OfficeAnnualPlan();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.courses) {
            let parseCourses = parseUtils.fixObjectArray(Course, obj.courses);
            item.set('courses', parseCourses);
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

module.exports = OfficeAnnualPlan;
