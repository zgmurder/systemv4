import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import Organization from '../resource/Organization';

// 总表

// const TableStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: number,                                                          // 月(随统计更新，最终值为11）
//  year: number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  TrainHoursRate: Number,                                                 // 时间
//  YearParticipationRate: Number,                                          // 人员（参选率)
//  TrainContentRate: Number,                                               // 内容
//  QualityRate: Number,                                                    // 质量
//  TrainerRate: Number,                                                    // 教练员
//  PlaceRate: Number,                                                      // 场地
//  BulletRate: Number,                                                     // 弹药
//  MotorRate: Number                                                       // 摩托小时
//  totalRate: Number                                                       // 总进度
// });

const TableStatistics = Parse.Object.extend("TableStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new TableStatistics();
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

module.exports = TableStatistics;
