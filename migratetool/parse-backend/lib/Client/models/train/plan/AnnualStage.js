import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import AnnualPlanSummary from './AnnualPlanSummary';

// 部分队年度训练阶段要求

// const AnnualStageSchema = new Schema({
//  year: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，总队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  annualSummary: { type: Schema.Types.ObjectId, ref: 'AnnualPlanSummary' },  // 年度计划汇总表

//  name: String,                                // 显示名称(默认同orgCategory)
//  orgProperty: String,                                // 单位属性（必填）
//  orgCategory: String,                                // 单位分类（选填）
//  majors: [String],                                   // 专业区分
//  stages: [{                                          // 训练阶段时间定义
//      fromDate: Date,                                 // 开始日期
//      toDate: Date,                                   // 结束日期
//      task: String                                    // 训练任务
//  }]
// });

const AnnualStage = Parse.Object.extend("AnnualStage", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new AnnualStage();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.annualSummary) {
            let parseAnnualPlanSummary = AnnualPlanSummary.fromObject(parseUtils.fixObject(obj.annualSummary));
            item.set('annualSummary', parseAnnualPlanSummary);
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
        return ['organization', 'annualSummary'];
    }
});

module.exports = AnnualStage;
