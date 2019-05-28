import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 中队及首长机关训练质量统计

// const UnitForceQualityStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: number,                                                          // 月(随统计更新，最终值为11）
//  year: number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  scoreCourseCount: Number,                                               // 已考核科目数
//  coursePassCount: Number,                                                // 科目及格数
//  courseGoodCount: Number,                                                // 科目优良数
//  courseExcellentCount: Number,                                           // 科目优秀数
//  coursePassRate: Number,                                                 // 科目及格率
//  courseGoodRate: Number,                                                 // 科目优良率
//  courseExcellentRate: Number,                                            // 科目优秀率
//  total: Number,                                                          // 实力数
//  personTargetCount: Number,                                              // 个人达标数
//  personPassCount: Number,                                                // 个人及格数
//  personGoodCount: Number,                                                // 个人优良数
//  personExcellentCount: Number,                                           // 个人优秀数
//  personTargetRate: Number,                                               // 个人达标率
//  personPassRate: Number,                                                 // 个人及格率
//  personGoodRate: Number,                                                 // 个人优良率
//  personExcellentRate: Number,                                            // 个人优秀率
//  orgScore:  Number                                                       // 单位成绩评定
//  target:  Boolean                                                        // 是否达标
// });

const UnitForceQualityStatistics = Parse.Object.extend("UnitForceQualityStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new UnitForceQualityStatistics();
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

module.exports = UnitForceQualityStatistics;
