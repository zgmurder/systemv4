import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 大队及以上训练质量统计总表

// const QualityStatisticsSchema = new Schema({
//  updateDate: { type: Date, required: true },                             // date类型(每天0时）
//  month: number,                                                          // 月(随统计更新，最终值为11）
//  year: number,                                                           // 年
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  parentOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  orgNumber: Number,                                                      // 下级所有中队数
//  targetScoreNum: Number,                                                 // 成绩达标中队数
//  targetScoreRate: Number,                                                // 成绩达标率
//  unitForceOrgExcellentCount: Number,                                     // 优秀中队数
//  unitForceOrgGoodCount: Number,                                          // 优良中队数
//  unitForceOrgPassCount: Number,                                          // 及格中队数
//  unitForcePassRate: Number,                                              // 中队及格率
//  unitForceGoodRate: Number,                                              // 中队优良率
//  unitForceExcellentRate: Number,                                         // 中队优秀率
//  childOrgNum: Number,                                                    // 下级单位数
//  orgExcellentCount: Number,                                              // 下级优秀单位数
//  orgGoodCount: Number,                                                   // 下级优良单位数
//  orgPassCount: Number,                                                   // 下级及格单位数
//  passRate: Number,                                                       // 及格率
//  goodRate: Number,                                                       // 优良率
//  excellentRate: Number,                                                  // 优秀率
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
//  officeQuality: {                                                        // 本级（首长机关）个人年度成绩分布
//      total: Number,                                                      // 实力数
//      personTargetCount: Number,                                          // 个人达标数
//      personPassCount: Number,                                            // 个人及格数
//      personGoodCount: Number,                                            // 个人优良数
//      personExcellentCount: Number,                                       // 个人优秀数
//      personTargetRate: Number,                                           // 个人达标率
//      personPassRate: Number,                                             // 个人及格率
//      personGoodRate: Number,                                             // 个人优良率
//      personExcellentRate: Number                                         // 个人优秀率
//  }
//  orgScore: Number,                                                       // 单位成绩评定（如有单位成绩则从单位成绩获取，如无则根据多科目综合计算规则通过下级单位成绩计算）
//  allScore: Number,                                                       // 中队总分数累加
//  totalRate: Number                                                       // 质量指标
// });

const QualityStatistics = Parse.Object.extend("QualityStatistics", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new QualityStatistics();
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

module.exports = QualityStatistics;
