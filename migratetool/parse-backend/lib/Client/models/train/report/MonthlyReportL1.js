import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 中队月统计表

// const MonthlyReportL1Schema = new Schema({
//  year: { type: Number, required: true },                                 // 年份（必填）
//  month: { type: Number, required: true },                                // 月份（必填）（0~11）
//  date: { type: Date, required: true },                                   // 月底日期
//  timeout: Boolean,                                                       // 补登记标志,true表示为补登记（必填），默认false（可不填）
//  state: Number,                                                          // 必填，提交为1，保存为0，正式提交后才能被上级查看
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 主单位（必填）
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  targetOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 表关联单位（表实际目标单位）（必填）
//  mainFlag: Boolean,                                                      // 主表标志
//  dailyNumber: Number,                                                    // 已提交的日登记表数量
//  parentOrg; { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  timeStat: [{                                                            // 训练时间
//      type: String,                                                       // 区分人员属性
//      hoursInDay: Number,                                                 // 本月训练时间（昼）
//      hoursAtNight: Number,                                               // 本月训练时间（夜）
//      totalHoursInDay: Number,                                            // 累计训练时间（昼）
//      totalHoursAtNight: Number                                           // 累计训练时间（夜）
//  }],
//  bulletStat: [{                                                          // 训练弹药
//      type: String,                                                       // 区分弹药类型
//      trainAverage: Number,                                               // 本月消耗量（本级训练）(人均)
//      train: Number                                                       // 本月消耗量（本级训练）(总数)
//      others: Number,                                                     // 本月消耗量（其它）
//      totalTrainAverage: Number,                                          // 累计消耗量（本级训练）(人均)
//      totalTrain: Number,                                                 // 累计消耗量（本级训练）(总数)
//      totalOthers: Number                                                 // 累计消耗量（其它）
//  }],
//  motorStat: [{                                                           // 摩托（飞行）小时
//      type: String,                                                       // 区分摩托类型
//      unitType: String,                                                   // 计量单位(小时或公里)
//      count: Number,                                                      // 本月完成量（人均）
//      total: Number                                                       // 累计完成量（人均）
//  }],
//  下面为12月份需要登记的内容
//  qualityStat: {                                                          // 训练质量
//      excellentRate: Number,                                              // 优秀率
// 		goodRate: Number,                                                   // 优良率
// 		passRate: Number,                                                   // 及格率
// 		evaluatedScore: Number,                                             // 成绩评定
//  },
// 	trainerStatistic: {                                                     // 教练员统计
// 		officerCount: Number,                                               // 干部数量
// 		monitorCount: Number,                                               // 班长数量
// 		otherCount: Number,                                                 // 其它教练员数量
// 		standardCount: Number,                                              // ‘四会’达标数量
// 		standardRate: Number                                                // ‘四会’达标率
// 	},
// 	placeStatistic: {                                                       // 训练场地统计
//      createdDetails: [String],                                           // 已建场地名称(详细列表)
// 		created: [String],                                                    // 已建场地名称(汇总，如2场1中心)
// 		nonCreated: [String],                                               // 未建场地名称
// 		newCreated: [String],                                               // 新建场地名称
// 		passRate: Number                                                    // 达标率
// 	},

//  createdBy: String,                                                      // 填写人
//  commander: String,                                                      // 中队主官
// });

const MonthlyReportL1 = Parse.Object.extend("MonthlyReportL1", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('timeout', false);
        this.set('state', SubmitState.Initial);
        this.set('mainFlag', true);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new MonthlyReportL1();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
        }

        if (obj.targetOrg) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.targetOrg));
            item.set('targetOrg', parseOrganization);
        }

        if (obj.parentOrg) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.parentOrg));
            item.set('parentOrg', parseOrganization);
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
        return ['organization','targetOrg'];
    }
});

module.exports = MonthlyReportL1;
