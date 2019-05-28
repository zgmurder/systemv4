import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 分队年度训练计划

// const UnitForceAnnualPlanSchema = new Schema({
//  name: String,                                                           // 显示名称，自动生成
//  year: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，总队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  orgCategory: String,                                                    // 单位分类
//  serviceReq: String,                                                     // 勤务类型
//  majors: [String],                                                       // 专业区分 (有些分队，不同专业的阶段训练时间不同，比如工兵分队、防化分队等)
//  orgProperty: String,                                                    // 单位属性
//  state: Number,                                                          // 提交状态

//  trainSteps: [String],

//  officerTime: { type: Schema.Types.ObjectId, ref: 'TimeRequirement' },
//  unitForceTime: { type: Schema.Types.ObjectId, ref: 'TimeRequirement' },
//  activities: [String],
//  scoreReqs: [String],
//  methods: [String],
//  notes: [String]
// });

const UnitForceAnnualPlan = Parse.Object.extend("UnitForceAnnualPlan", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new UnitForceAnnualPlan();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
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

module.exports = UnitForceAnnualPlan;
