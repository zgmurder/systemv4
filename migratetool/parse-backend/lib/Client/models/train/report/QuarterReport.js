import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 总队季度统计表

// const QuarterReportSchema = new Schema({
//  year: { type: Number, required: true },                                 // 年份
//  quarter: { type: Number, required: true },                              // 第几季度
//  month: { type: Number, required: true },                                // 月份(每个季度最后一个月)
//  date: { type: Date, required: true },                                   // 最后一个月的月底日期
//  timeout: Boolean,                                                       // 补登记标志
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  trainContent: [String],                                                 // 首长机关季度训练内容列表
// 	timeStatistic: {                                                        // 训练时间
// 		trainDays: Number,                                                  // 首长机关本季度集中训练天数  
// 		trainHours: Number,                                                 // 首长机本季度训练时间（小时）
// 		totalHours: Number                                                  // 首长机关累计训练时间（小时）
// 	},
//  bulletStatOffice: {                                                     // 训练弹药消耗(首长机关)
//      type: String,                                                       // 区分弹药类型，默认只有手枪
//      trainAverage: Number,                                               // 本月消耗量（本级训练）(人均)
//      train: Number                                                       // 本月消耗量（本级训练）(总数)
//      totalTrainAverage: Number,                                          // 累计消耗量（本级训练）(人均)
//      totalTrain: Number,                                                 // 累计消耗量（本级训练）(总数)
//  }
//  bulletStat: [{                                                          // 训练弹药消耗(全部队)
//      type: String,                                                       // 区分弹药类型
//      trainAverage: Number,                                               // 本月消耗量（本级训练）(人均)
//      train: Number                                                       // 本月消耗量（本级训练）(总数)
//      others: Number,                                                     // 本月消耗量（其它）
//      totalTrainAverage: Number,                                          // 累计消耗量（本级训练）(人均)
//      totalTrain: Number,                                                 // 累计消耗量（本级训练）(总数)
//      totalOthers: Number                                                 // 累计消耗量（其它）
//  }],
//  motorStat: [{                                                           // 摩托（飞行）小时(全部队)
//      orgType: String,                                                    // 区分部（分）队类型
//      motorInfo: [{
//      type: String,                                                       // 摩托类型
//      unitType: String,                                                   // 计量单位(公里或小时)
//      count: Number,                                                      // 本月完成量（人均）
//      total: Number                                                       // 累计完成量（人均）
//      }]
//  }],
//  下面为12月份最后一季度需要登记的内容
//  evaluatedScore: Number,                                                 // 首长机关年度训练成绩评定
// 	trainerStatistic: {                                                     // 教练员统计
// 		passNumber: Number,                                                  // 教练员达标单位数量
// 		passRate: Number                                                    // 教练员达标率
// 	},
// 	placeStatistic: {                                                       // 训练场地
// 		passNumber: Number,                                                 // 场地达标单位数量
// 		passRate: Number                                                    // 场地达标率
// 	},

//  createdBy: String,                                                      // 填写人
//  approvedBy: String,                                                       // 审核人
// });

const QuarterReport = Parse.Object.extend("QuarterReport", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('timeout', false);
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new QuarterReport();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
        }

        if (!obj.objectId) {
            parseUtils.setACL(item, obj, {
                readRoles: [RoleName.Administrator, RoleName.Reader], 
                writeRoles: [RoleName.Operator]
            });
        }

        return item;
    },
    getIncludes: function() {
        return ['organization'];
    }
});

module.exports = QuarterReport;