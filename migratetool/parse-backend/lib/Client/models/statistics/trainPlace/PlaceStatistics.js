import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 八落实训练场地统计表

// const PlaceStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: number,                                                          // 月(随统计更新，最终值为11）
//  year: number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  created: Number,                                                        // 已有场地数
//  createdDetails: [String],                                               // 已有场地详情
//  building: Number,                                                       // 在建场地数
//  buildingDetails: [String],                                              // 在建场地详情
//  toBeBuilt: Number,                                                      // 未建场地数
//  toBeBuiltDetails: [String],                                             // 未建场地详情
//  targetCreated: Number,                                                  // 应有场地数
//  targetCreatedDetails: [String],                                         // 应有场地详情
//  orgNumber: Number,                                                      // 下级单位总数
//  targetOrgNumber: Number,                                                // 下级达标单位总数
//  placeList: [{                                                           // 应有场地建设情况列表
//      placeType: String,                                                  // 区分类型
//      created: Number,                                                    // 已有场地数
//      targetCreated: Number                                               // 应有场地数
//    }],
//  ownPlaceInfo: {                                                         // 本级（首长机关）场地信息统计
//      created: Number,                                                    // 已有场地数
//      createdDetails: [String],                                           // 已有场地详情
//      building: Number,                                                   // 在建场地数
//      buildingDetails: [String],                                          // 在建场地详情
//      toBeBuilt: Number,                                                  // 未建场地数
//      toBeBuiltDetails: [String],                                         // 未建场地详情
//      targetCreated: Number,                                              // 应有场地数
//      targetCreatedDetails: [String],                                     // 应有场地详情
//      toBeBuiltRate: Number,                                              // 未建率
//      buildingRate: Number,                                               // 在建率
//      builtRate: Number,                                                  // 已建率
// },
//  toBeBuiltRate: Number,                                                  // 未建率
//  buildingRate: Number,                                                   // 在建率
//  builtRate: Number,                                                      // 已建率
//  totalRate: Number,                                                      // 达标率(下级达标单位数与下级总单位数的比值）
// });

const PlaceStatistics = Parse.Object.extend("PlaceStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new PlaceStatistics();
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

module.exports = PlaceStatistics;
