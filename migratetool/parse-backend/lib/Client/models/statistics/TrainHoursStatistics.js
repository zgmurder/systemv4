import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import Organization from '../resource/Organization';

// 训练时间统计

// const TrainHoursStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: number,                                                          // 月(随统计更新，最终值为11）
//  year: number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  timeStat: [{                                                            // 训练时间
//      type: String,                                                       // 区分类型
//      totalTargetHours: Number,                                           // 年度总课时
//      targetHoursInDay: Number,                                           // 累计昼训指标
//      targetHoursAtNight: Number,                                         // 累计夜训指标
//      totalHours: Number,                                                 // 已训总课时
//      totalHoursInDay: Number,                                            // 累计昼训时间
//      totalHoursAtNight: Number                                           // 累计夜训时间
//      rate: Number                                                        // 训练进度(指标为0时训练进度设为-1）
//  }],
//  totalRate: Number                                                       //总训练进度(分队+警官）
// });

const TrainHoursStatistics = Parse.Object.extend("TrainHoursStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new TrainHoursStatistics();
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

module.exports = TrainHoursStatistics;
