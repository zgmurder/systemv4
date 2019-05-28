import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import Organization from '../resource/Organization';

// 训练人数统计

// const BulletStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: number,                                                          // 月(随统计更新，最终值为11）
//  year: number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  bulletStat: [{                                                          // 训练弹药
//      type: String,                                                       // 区分弹药类型
//      ordnanceType: String,                                               // 区分种类
//      soldierNumber: Number,                                              // 人员数量
//      unitType: String,                                                   // 弹药单位
//      numType: String,                                                    // 数量单位
//      totalAverage: Number,                                               // 累计人均消耗
//      target: Number,                                                     // 人均指标
//      total: Number,                                                      // 累计消耗
//      totalTarget: Number,                                                // 累计指标
//      rate: Number,                                                       // 进度（累计消耗/累计指标)
//  }],
//  weaponStat: [{                                                          // 训练武器
//      type: String,                                                       // 区分武器类型
//      ordnanceType: String,                                               // 区分种类
//      soldierNumber: Number,                                              // 人员数量
//      unitType: String,                                                   // 弹药单位
//      numType: String,                                                    // 数量单位
//      totalAverage: Number,                                               // 累计人均消耗
//      target: Number,                                                     // 人均指标
//      total: Number,                                                      // 累计消耗
//      totalTarget: Number,                                                // 累计指标
//      rate: Number,                                                       // 进度（累计消耗/累计指标)
//  }],
//  ammunitionStat: [{                                                      // 训练弹药
//      type: String,                                                       // 区分弹药类型
//      ordnanceType: String,                                               // 区分种类
//      soldierNumber: Number,                                              // 人员数量
//      unitType: String,                                                   // 弹药单位
//      numType: String,                                                    // 数量单位
//      totalAverage: Number,                                               // 累计人均消耗
//      target: Number,                                                     // 人均指标
//      total: Number,                                                      // 累计消耗
//      totalTarget: Number,                                                // 累计指标
//      rate: Number,                                                       // 进度（累计消耗/累计指标)
//  }],
//  materialStat: [{                                                        // 训练物资
//      type: String,                                                       // 区分物资类型
//      ordnanceType: String,                                               // 区分种类
//      soldierNumber: Number,                                              // 人员数量
//      unitType: String,                                                   // 弹药单位
//      numType: String,                                                    // 数量单位
//      totalAverage: Number,                                               // 累计人均消耗
//      target: Number,                                                     // 人均指标
//      total: Number,                                                      // 累计消耗
//      totalTarget: Number,                                                // 累计指标
//      rate: Number,                                                       // 进度（累计消耗/累计指标)
//  }],
//  target: Number,                                                         // 累计总指标
//  total: Number,                                                          // 累计总消耗
//  totalRate: Number                                                       // 总进度
// });

const BulletStatistics = Parse.Object.extend("BulletStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new BulletStatistics();
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

module.exports = BulletStatistics;
