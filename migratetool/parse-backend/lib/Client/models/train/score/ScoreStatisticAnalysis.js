import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 体育成绩统计分析

// const ScoreStatisticAnalysisSchema = new Schema({
//  year: { type: Number, required: true },                                 // 年份
//  date: Date,                                                             // 分析日期
//  assessMethod: String,                                                   // 考核方式
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用

//  stats: {
//      referenceNum,                                                           // 参考人数
//
//      passRate,                                                               // 及格率
//      passCount,                                                              // 及格人数
//
//      goodRate,                                                               // 良好率
//      goodCount,                                                              // 良好人数
//
//      excellentRate,                                                          // 优秀率
//      excellentCount,                                                         // 优秀人数
//
//      extraL3Rate,                                                            // 特三率
//      extraL3Count,                                                           // 特三人数
//
//      extraL2Rate,                                                            // 特二率
//      extraL2Count,                                                           // 特二人数
//
//      extraL1Rate,                                                            // 特一率
//      extraL1Count,                                                           // 特一人数
// }

//  totalAverageScore: Number,                                                   // 总平均分
//  courseAverageScores: [{                                                      // 课目平均分列表
//       name: String,                                                           // 课目名称
//       averageScore: Number,                                                   // 课目平均分
// }]
//});

const ScoreStatisticAnalysis = Parse.Object.extend("ScoreStatisticAnalysis", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new ScoreStatisticAnalysis();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (!obj.objectId) {
            parseUtils.setACL(item, obj, {
                readRoles: [RoleName.Operator, RoleName.Reader],
                writeRoles: [RoleName.Operator, RoleName.Network]
            });
        }
        return item;
    },
    getIncludes: function() {
        return ['organization'];
    }
});

module.exports = ScoreStatisticAnalysis;
