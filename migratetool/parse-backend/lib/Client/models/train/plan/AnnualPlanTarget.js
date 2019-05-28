import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import AnnualPlanSummary from './AnnualPlanSummary';

// 部分队年度训练阶段要求

// const AnnualPlanTargetSchema = new Schema({
//  year: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，总队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  annualPlanId: String,
//  targetOrgId: String,
//  targetOrgName: String
// });

const AnnualPlanTarget = Parse.Object.extend("AnnualPlanTarget", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new AnnualPlanTarget();
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

module.exports = AnnualPlanTarget;
