import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import Organization from '../resource/Organization';

// 人员数量统计

// const SoldierNumberStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: Number,                                                          // 月(随统计更新，最终值为11）
//  year: Number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位（中队，支队，总队）
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  ownSoldierCountList: [{                                                 // 本级人员数量统计
//      type: String,                                                       // 区分类型
//      count: Number                                                       // 人员数量
//  }],
//  allSoldierCountList: [{                                                 // 本级及下级人员数量统计
//      type: String,                                                       // 区分类型
//      count: Number                                                       // 人员数量
//  }]
//  ownSoldierRankList: [{                                                 // 本级人员军衔情况统计
//      type: String,                                                       // 区分军衔类型（列兵， 士官， 蔚官，校官， 将官）
//      count: Number                                                       // 人员数量
//  }],
//  allSoldierRankList: [{                                                 // 本级及下级人员军衔情况统计
//      type: String,                                                       // 区分类型
//      count: Number                                                       // 人员数量
//  }]
// });

const SoldierNumberStatistics = Parse.Object.extend("SoldierNumberStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new SoldierNumberStatistics();
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

module.exports = SoldierNumberStatistics;
