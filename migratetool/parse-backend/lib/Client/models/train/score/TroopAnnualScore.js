import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 部队年度军事训练综合成绩登记表(适用于支队、总队)

// const TroopAnnualScoreSchema = new Schema({
//  year: { type: Number, required: true },                                 // 年份
//  date: Date,                                                             // 登记日期
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//  orgSequence: Number,                                                    // 编制序列
//  state: Number,                                                          // 提交状态(0: 未提交; 1:已提交) 正式提交后才能被上级查看

//  officeAnnualScore: Number,                                              // 本级机关年度训练成绩
//  childrenScore: Number,                                                  // 下级单位年度训练成绩总评
//  childOrgScores: [{                                                      // 下级单位年度训练成绩列表
//      name: String,                                                       // 单位名称
//      orgCode: String,                                                    // 单位编码，自动从单位继承，排序用
//      score: Number                                                       // 单位年度成绩
//  }],

//  tacticsScore: Number,                                                   // 部队战术（战役）训练成绩

//  isPassed: Boolean,                                                      // 是否达标
//  annualScore: Number,                                                    // 年度训练成绩

//  notes: [String],                                                        // 备注信息
//  createdBy: String,                                                      // 填写人
//  approvedBy: String,                                                     // 审核人
// });

const TroopAnnualScore = Parse.Object.extend("TroopAnnualScore", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new TroopAnnualScore();
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

module.exports = TroopAnnualScore;
