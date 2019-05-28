import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 工作台训练质量统计总表

// const WorkQualityStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                                 // date类型(每天0时）
//  month: number,                                                              // 月(随统计更新，最终值为11）
//  year: number,                                                               // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },         // 单位
//  orgCode: String,                                                            // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },            // 关联父组织单位
//  soldierQuality: {                                                           // 所有单兵个人年度成绩分布
//      total: Number,                                                          // 实力数
//      personTargetCount: Number,                                              // 个人达标数
//      personPassCount: Number,                                                // 个人及格数
//      personGoodCount: Number,                                                // 个人优良数
//      personExcellentCount: Number,                                           // 个人优秀数
//      personTargetRate: Number,                                               // 个人达标率
//      personPassRate: Number,                                                 // 个人及格率
//      personGoodRate: Number,                                                 // 个人优良率
//      personExcellentRate: Number                                             // 个人优秀率
//  }
//  unitForceQuality: {                                                         // 所有中队级单位年度成绩分布
//      orgNumber: Number,                                                      // 下级中队数
//      orgExcellentCount: Number,                                              // 优秀中队数
//      orgGoodCount: Number,                                                   // 优良中队数
//      orgPassCount: Number,                                                   // 及格中队数
//      passRate: Number,                                                       // 及格率
//      goodRate: Number,                                                       // 优良率
//      excellentRate: Number                                                   // 优秀率
//  }
//  battalionQuality: {                                                         // 所有大队级单位年度成绩分布
//      orgNumber: Number,                                                      // 下级大队数
//      orgExcellentCount: Number,                                              // 优秀大队数
//      orgGoodCount: Number,                                                   // 优良大队数
//      orgPassCount: Number,                                                   // 及格大队数
//      passRate: Number,                                                       // 及格率
//      goodRate: Number,                                                       // 优良率
//      excellentRate: Number                                                   // 优秀率
//  }
//  regimentQuality: {                                                          // 所有支队级单位年度成绩分布
//      orgNumber: Number,                                                      // 下级支队数
//      orgExcellentCount: Number,                                              // 优秀支队数
//      orgGoodCount: Number,                                                   // 优良支队数
//      orgPassCount: Number,                                                   // 及格支队数
//      passRate: Number,                                                       // 及格率
//      goodRate: Number,                                                       // 优良率
//      excellentRate: Number                                                   // 优秀率
//  }
//  divisionQuality: {                                                          // 所有总队级单位年度成绩分布
//      orgNumber: Number,                                                      // 下级总队数
//      orgExcellentCount: Number,                                              // 优秀总队数
//      orgGoodCount: Number,                                                   // 优良总队数
//      orgPassCount: Number,                                                   // 及格总队数
//      passRate: Number,                                                       // 及格率
//      goodRate: Number,                                                       // 优良率
//      excellentRate: Number                                                   // 优秀率
//  }
//  officeQuality: {                                                            // 本级（首长机关）个人年度成绩分布
//      total: Number,                                                          // 实力数
//      personTargetCount: Number,                                              // 个人达标数
//      personPassCount: Number,                                                // 个人及格数
//      personGoodCount: Number,                                                // 个人优良数
//      personExcellentCount: Number,                                           // 个人优秀数
//      personTargetRate: Number,                                               // 个人达标率
//      personPassRate: Number,                                                 // 个人及格率
//      personGoodRate: Number,                                                 // 个人优良率
//      personExcellentRate: Number                                             // 个人优秀率
//  }
// });

const WorkQualityStatistics = Parse.Object.extend("WorkQualityStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new WorkQualityStatistics();
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

module.exports = WorkQualityStatistics;
