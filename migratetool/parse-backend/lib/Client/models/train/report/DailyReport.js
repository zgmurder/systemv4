import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 中队日登记表

// const DailyReportSchema = new Schema({
//  date: { type: Date, required: true },                                   // 必填 date类型
//  weekday: { type: Number, required: true },                              // 星期
//  timeout: Boolean,                                                       // 补登记标记，true表示为补登记（必填），默认false（可不填）
//  state: Number,                                                          // 必填，提交为1，保存为0，正式提交后才能被上级查看
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，主单位，即中队，objectId或对象数据
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  targetOrg: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 必填，表关联单位，登记表单位（中队/应急班/特战排）objectId或对象数据
//  mainFlag: Boolean,                                                      // 主表标志
//  parentOrg; { type: Schema.Types.ObjectId, ref: 'Organization' },        // 关联父组织单位
//  personStat: {                                                           // 训练人员
//    total: Number,                                                        // 必填，实力数
//    present: Number,                                                      // 必填，参训人数
//    presentRate: Number,                                                  // 必填，参训率
//    notes: String                                                         // 未参数人员及原因
//  },
//  contentStat: {                                                          // 训练内容
//    earlyMoring: [],                                                  // 早操
//    morning: [],                                                      // 上午
//    afternoon: [],                                                    // 下午
//    sport: [],                                                        // 体能训练
//    night: []                                                         // 夜训
//  },
//  timeStat: [{                                                            // 训练时间
//      type: String,                                                       // 区分
//      hoursInDay: Number,                                                 // 当日训练时间（昼）
//      hoursAtNight: Number,                                               // 当日训练时间（夜）
//      totalHoursInDay: Number,                                            // 累计训练时间（昼）
//      totalHoursAtNight: Number                                           // 累计训练时间（夜）
//  }],
//  bulletStat: [{                                                          // 训练弹药
//      type: String,                                                       // 区分弹药类型
//      trainAverage: Number,                                               // 当日消耗量（本级训练）(人均)
//      train: Number                                                       // 当日消耗量（本级训练）(总数)
//      others: Number,                                                     // 当日消耗量（其它）
//      totalTrainAverage: Number,                                          // 累计消耗量（本级训练）(人均)
//      totalTrain: Number,                                                 // 累计消耗量（本级训练）(总数)
//      totalOthers: Number                                                 // 累计消耗量（其它）
//  }],
//  motorStat: [{                                                           // 摩托（飞行）小时
//      type: String,                                                       // 区分摩托类型
//      unitType: String,                                                   // 计量单位(小时或公里)
//      count: Number,                                                      // 当日完成量（人均）
//      total: Number                                                       // 累计完成量（人均）
//  }],
//  createdBy: String,                                                      // 填写人
//  commander: String,                                                      // 中队主官
// });

const DailyReport = Parse.Object.extend("DailyReport", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('timeout', false);
        this.set('state', SubmitState.Initial);
        this.set('mainFlag', true);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new DailyReport();
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

module.exports = DailyReport;
