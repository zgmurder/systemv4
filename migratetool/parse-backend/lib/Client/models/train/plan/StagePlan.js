import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import UnitForceAnnualPlanItem from './UnitForceAnnualPlanItem';

// 分队阶段训练计划

// const StagePlanSchema = new Schema({
//  name: String,                                                           // 显示名称，自动生成
//  year: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，支队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  createdOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },       // 自动生成，创建者人员单位
//  annualPlanItem: { type: Schema.Types.ObjectId, ref: 'UnitForceAnnualPlanItem' },
//  annualPlanId: String,                                                   // 年度计划ID

//  orgCategory: String,                                                    // 单位分类，训练对象
//  serviceReq: String,                                                     // 勤务类型
//  majors: [String],                                                       // 专业区分 (有些分队，不同专业的阶段训练时间不同，比如工兵分队、防化分队等)
//  orgProperty: String,                                                    // 单位属性
//  state: Number,                                                          // 提交状态

//  task: String,                                                           // 任务
//  subjects: [String],                                                     // 课题
//  fromDate: Date,                                                         // 起始日期
//  toDate: Date,                                                           // 结束日期
//  officerHours: Number,                                                   // 本阶段警官训练课时
//  soldierHours: Number,                                                   // 本阶段分队训练课时

//  activities: [String],
//  scoreReqs: [String],
//  basicReqs: [String],
//  methods: [String],
//  notes: [String]
// });

const StagePlan = Parse.Object.extend("StagePlan", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new StagePlan();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.createdOrg) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.createdOrg));
            item.set('createdOrg', parseOrganization);
        }
        if (obj.annualPlanItem) {
            let parsePlanItem = UnitForceAnnualPlanItem.fromObject(parseUtils.fixObject(obj.annualPlanItem));
            item.set('annualPlanItem', parsePlanItem);
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
        return ['organization', 'createdOrg', 'annualPlanItem'];
    }
});

module.exports = StagePlan;
