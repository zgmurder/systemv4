import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 总队年度计划汇总表

// const AnnualPlanSummarySchema = new Schema({
//  year: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，总队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  state: Number,                                                          // 必填，发布状态为1，未发布为0，正式发布后才能被下级各单位查看


//  personReqs: [String],                                                   // 参训兵力
//  trainContents: [String],                                                // 训练内容
//  activities: [String],                                                   // 重要训练活动
//  scoreReqs: [String],                                                    // 质量指标
//  methods: [String]                                                       // 措施与要求
// });

const AnnualPlanSummary = Parse.Object.extend("AnnualPlanSummary", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new AnnualPlanSummary();
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

module.exports = AnnualPlanSummary;
