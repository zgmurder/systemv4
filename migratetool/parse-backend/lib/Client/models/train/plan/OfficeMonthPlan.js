import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';


// 首长机关月训练计划

// const MonthPlanSchema = new Schema({
//  name: String,                                                           // 显示名称，自动生成
//  year: Number,
//  month: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，总队/支队
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  state: Number,

//  departs: [object],                                                      // 部门，见Departments

//  fromDate: Date,                                                         // 起始日期
//  toDate: Date,                                                           // 结束日期
//  days: Number,
//  hours: Number,                                                          // 本阶段警官训练课时

//  scoreReqs: String,
//  methods: String,
//  notes: String
// });

const OfficeMonthPlan = Parse.Object.extend("OfficeMonthPlan", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new OfficeMonthPlan();
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

module.exports = OfficeMonthPlan;
