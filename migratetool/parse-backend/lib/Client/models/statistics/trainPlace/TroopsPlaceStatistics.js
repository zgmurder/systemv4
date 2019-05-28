import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 工作台训练场地统计表（部队)

// const TroopsPlaceStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                                 // date类型(每天0时）
//  month: number,                                                              // 月(随统计更新，最终值为11）
//  year: number,                                                               // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },         // 单位
//  orgCode: String,                                                            // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },            // 关联父组织单位
//  teachTeamPlaceInfo: {                                                       // 教导队场地信息统计
//      created: Number,                                                        // 已有场地数
//      createdDetails: [String],                                               // 已有场地详情
//      building: Number,                                                       // 在建场地数
//      buildingDetails: [String],                                              // 在建场地详情
//      toBeBuilt: Number,                                                      // 未建场地数
//      toBeBuiltDetails: [String],                                             // 未建场地详情
//      targetCreated: Number,                                                  // 应有场地数
//      targetCreatedDetails: [String],                                         // 应有场地详情
//      toBeBuiltRate: Number,                                                  // 未建率
//      buildingRate: Number,                                                   // 在建率
//      builtRate: Number,                                                      // 已建率
//  },
//  basePlaceInfo: {                                                            // 训练基地场地信息统计
//      created: Number,                                                        // 已有场地数
//      createdDetails: [String],                                               // 已有场地详情
//      building: Number,                                                       // 在建场地数
//      buildingDetails: [String],                                              // 在建场地详情
//      toBeBuilt: Number,                                                      // 未建场地数
//      toBeBuiltDetails: [String],                                             // 未建场地详情
//      targetCreated: Number,                                                  // 应有场地数
//      targetCreatedDetails: [String],                                         // 应有场地详情
//      toBeBuiltRate: Number,                                                  // 未建率
//      buildingRate: Number,                                                   // 在建率
//      builtRate: Number,                                                      // 已建率
//  },
//  ownPlaceInfo: {                                                             // 本级（首长机关）场地信息统计
//      created: Number,                                                        // 已有场地数
//      createdDetails: [String],                                               // 已有场地详情
//      building: Number,                                                       // 在建场地数
//      buildingDetails: [String],                                              // 在建场地详情
//      toBeBuilt: Number,                                                      // 未建场地数
//      toBeBuiltDetails: [String],                                             // 未建场地详情
//      targetCreated: Number,                                                  // 应有场地数
//      targetCreatedDetails: [String],                                         // 应有场地详情
//      toBeBuiltRate: Number,                                                  // 未建率
//      buildingRate: Number,                                                   // 在建率
//      builtRate: Number,                                                      // 已建率
// },
//  teachTeamNumber: Number,                                                    // 教导队总数
//  targetTeachTeamNumber: Number,                                              // 达标教导队总数
//  teachTeamRate: Number                                                       // 教导队达标率
//  teachTeamNumber: Number,                                                    // 训练基地总数
//  targetTeachTeamNumber: Number,                                              // 达标训练基地总数
//  teachTeamRate: Number                                                       // 训练基地达标率
//  orgNumber: Number,                                                          // 下级单位总数
//  targetOrgNumber: Number,                                                    // 下级达标单位总数
//  totalRate: Number                                                           // 达标率(下级达标单位数与下级总单位数的比值）
// });

const TroopsPlaceStatistics = Parse.Object.extend("TroopsPlaceStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new TroopsPlaceStatistics();
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

module.exports = TroopsPlaceStatistics;
