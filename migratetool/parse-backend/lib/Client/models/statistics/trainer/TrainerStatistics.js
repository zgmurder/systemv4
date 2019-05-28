import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 教练员数据统计

// const TrainerStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: number,                                                          // 月
//  year: number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  standardCount: Number,                                                   // 四会数量
//  excellentCount: Number,                                                  // 优秀数量
//  pacesetterCount: Number,                                                 // 标兵数量
// 	officerCount: Number,                                                   // 干部数量
//  trainerCourseCount: Number,                                              // 已有教练员科目数
//  requiredCourseCount: Number,                                             // 应训科目数
//  coverRate: Number,                                                       // 教员覆盖率
//  standardRate: Number,                                                    // 四会率
//  excellentRate: Number,                                                   // 优秀率
//  pacesetterRate: Number,                                                   // 标兵率
//  standardCourseCount: Number,                                             // 四会教练员所教课目数
//  standardCoursePassCount: Number,                                         // 四会教练员所教课目达标数
//  standardWorkRate: Number,                                                // 四会责任落实率
//  excellentCourseCount: Number,                                            // 优秀教练员所教课目数
//  excellentCourseGoodCount: Number,                                        // 优秀教练员所教课目达标数
//  excellentWorkRate: Number,                                               // 优秀责任落实率
//  pacesetterCourseCount: Number,                                           // 标兵教练员所教课目数
//  pacesetterCourseExcellentCount: Number,                                  // 标兵教练员所教课目达标数
//  pacesetterWorkRate: Number,                                              // 标兵责任落实率
//  workRate: Number                                                         // 责任落实率
//  totalRate: Number                                                        // 总体落实率
// });

const TrainerStatistics = Parse.Object.extend("TrainerStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new TrainerStatistics();
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

module.exports = TrainerStatistics;
