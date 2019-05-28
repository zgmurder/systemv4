import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import Organization from '../resource/Organization';

// 训练人数统计

// const MotorStatisticsStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: number,                                                          // 月(随统计更新，最终值为11）
//  year: number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  motorStat: [{                                                           // 摩托小时
//      type: String,                                                       // 摩托类型
//      unitType: String,                                                   // 计量单位(公里或小时)
//      total: Number                                                       // 累计完成量
//      target: Number,                                                     // 指标
//      rate: Number,                                                       // 进度
//  }],
//  totalRate: Number                                                       // 总进度
// });

const MotorStatistics = Parse.Object.extend("MotorStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new MotorStatistics();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            item.set('orgCode', obj.organization.orgCode);
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }

        if (obj.parentOrg) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.parentOrg));
            item.set('parentOrg', parseOrganization);
        }

        if (!obj.objectId) {
            var acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            acl.setRoleWriteAccess(RoleName.Administrator, true);
            item.setACL(acl);
        }

        return item;
    },
    getIncludes: function() {
        return ['organization'];
    }
});

module.exports = MotorStatistics;
