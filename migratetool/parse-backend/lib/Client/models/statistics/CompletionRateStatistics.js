import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import Organization from '../resource/Organization';

/// 日登记表、周计划、月计划、军事成绩完成提交情况统计
// const CompletionRateStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: number,                                                          // 月(随统计更新，最终值为11）
//  year: number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位

//  总队、支队有该字段记录
//  monthPlan: {                                                           // 下级所有单位月计划提交情况
//      target: Number                                                      // 总分队类型数（支队） 支队该值叠加（总队）
//      monthSubmit: {
//         total: Number,                                                   // 当月提交数
//         target: Number,                                                  // 指标
//         rate:  Number                                                    // 当月提交比例
//      }
//      yearSubmit: {
//         total: Number,                                                   // 当年提交数
//         target: Number,                                                  // 指标
//         rate:  Number                                                    // 当年提交比例
//      }
//  },
//  总队、支队、大队有该字段记录
//  weeklyPlan: {                                                           // 下级所有中队周计划提交情况
//      target: Number                                                      // 总中队数
//      currentWeekSubmit: {
//           total: Number,                                                 // 本周周计划提交数
//           target: Number,                                                // 指标
//           rate:  Number                                                  // 本周周计划提交比例
//      }
//      nextWeekSubmit: {
//           total: Number,                                                 // 下周周计划提交数
//           target: Number,                                                // 指标
//           rate:  Number                                                  // 下周周计划提交比例
//      }
//      yearSubmit: {
//           total: Number,                                                 // 本年度周计划提交数
//           target: Number,                                                // 指标
//           rate:  Number                                                  // 本年度周计划提交比例
//      }
//  },
//  总队、支队、大队有该字段记录
//  dailyReport: {                                                          // 下级所有中队日登记表提交情况
//      target: Number                                                      // 总中队数
//      currentWeekSubmit: {
//         total: Number,                                                   // 本周提交数
//         target: Number,                                                  // 指标
//         rate:  Number                                                    // 本周提交比例
//      }
//      yearSubmit: {
//         total: Number,                                                   // 当年提交数
//         target: Number,                                                  // 指标
//         rate:  Number                                                    // 当年提交比例
//      }
//  },

//  中队特有
//  completionRate: [{                                                      // 完成率情况 
//      type: String,                                                       // 完成率类型 ['军事成绩', ‘周计划’, ‘日登记’]
//      total: Number                                                       // 累计完成量
//      target: Number,                                                     // 指标
//      rate: Number,                                                       // 进度
//  }],
// });
const CompletionRateStatistics = Parse.Object.extend("CompletionRateStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new CompletionRateStatistics();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            // item.set('orgCode', obj.organization.orgCode);
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

module.exports = CompletionRateStatistics;
