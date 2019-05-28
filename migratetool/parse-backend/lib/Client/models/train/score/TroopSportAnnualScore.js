import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 单位军事体育训练考核成绩汇总表

// const TroopSportAnnualScoreSchema = new Schema({
//  year: { type: Number, required: true },                                 // 年份
//  date: Date,                                                             // 登记日期
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//  orgSequence: Number,                                                    // 编制序列
//  state: Number,                                                          // 提交状态(0: 未提交; 1:已提交) 正式提交后才能被上级查看

//  militaryMaster: Number,                                                 // 军事主官成绩
//  politicalMaster: Number,                                                // 政治主官成绩

//  orgScores: [{                                                           // 下级单位年度训练成绩列表
//      name: String,                                                       // 单位名称
//      orgCode: String,                                                    // 单位编码，自动从单位继承，排序用
//      orgSequence: Number,                                                // 编制序列
//      score: Number                                                       // 单位年度成绩
//  }],

//  evaluatedScore: Number,                                                  // 单位成绩总评
//  stats: {                                                                 // 单位评定指标（统计）
//      passCount: Number,                                                   // 及格单位个数
//      unpassCount: Number,                                                 // 不及格单位个数
//      goodCount: Number,                                                   // 良好单位个数
//      excellentCount: Number,                                              // 优秀单位个数
//   },

//  notes: [String],                                                        // 备注信息
//  createdBy: String,                                                      // 填写人
//  approvedBy: String,                                                     // 审核人
// });

const TroopSportAnnualScore = Parse.Object.extend("TroopSportAnnualScore", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new TroopSportAnnualScore();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
            item.set('orgSequence', parseOrganization.get('orgSequence'));
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

module.exports = TroopSportAnnualScore;
