import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 单位军事体育训练考核成绩登记表

// const OrgSportAnnualScoreSchema = new Schema({
//  year: { type: Number, required: true },                                 // 年份
//  date: Date,                                                             // 登记日期
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//  orgSequence: Number,                                                    // 编制序列
//  state: Number,                                                          // 提交状态(0: 未提交; 1:已提交) 正式提交后才能被上级查看

//  personTotal: Number,                                                    // 实力数
//  testCount: Number,                                                      // 参考数
//  testRate: Number,                                                       // 参考率

//  personScores: [{                                                        // 所有个人体育成绩总评
//      soldierId: String,                                                  // 人员objectId
//      name: String,                                                       // 姓名
//      cardId: String,                                                     // 卡号
//      position: String,                                                   // 职务
//      isCommander: Boolean,                                               // 是否为指挥员，自动从人员继承（界面不体现）
//      isMaster: Boolean,                                                  // 是否为军政主官，自动从人员继承（界面不体现）
//      positionCode: Number,                                               // 个人总评
//      score: Number
//  }],

//  evaluatedScore: Number,                                                  // 单位成绩总评
//  stats: {                                                                 // 单位评定指标（统计）
//      passCount: Number,                                                   // 及格（合格）人数
//      passRate: Number,                                                    // 及格（合格）率
//      unpassCount: Number,                                                 // 不及格（不合格）人数
//      unpassRate: Number,                                                  // 不及格（不合格）率
//      goodCount: Number,                                                   // 良好人数
//      goodRate: Number,                                                    // 良好率
//      excellentCount: Number,                                              // 优秀人数
//      excellentRate: Number,                                               // 优秀率
//      extraL3Count: Number,                                               // 特3级人数
//      extraL2Count: Number,                                               // 特2级人数
//      extraL1Count: Number,                                               // 特1级人数
//   },

//  notes: [String],                                                        // 备注信息
//  createdBy: String,                                                      // 填写人
//  approvedBy: String,                                                     // 审核人
// });

const OrgSportAnnualScore = Parse.Object.extend("OrgSportAnnualScore", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new OrgSportAnnualScore();
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

module.exports = OrgSportAnnualScore;
