import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 首长机关年度军事训练综合成绩登记表(适用于支队、总队机关)

// const OfficeAnnualScoreSchema = new Schema({
//  year: { type: Number, required: true },                                 // 年份
//  date: Date,                                                             // 登记日期
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//  orgSequence: Number,                                                    // 编制序列
//  state: Number,                                                          // 提交状态(0: 未提交; 1:已提交) 正式提交后才能被上级查看

//  childrenScore: Number,                                                  // 机关个人年度训练成绩总评
//  personScores: [{                                                        // 机关个人年度训练成绩列表
//      name: String,                                                       // 姓名
//      cardId: String,                                                     // 卡号
//      position: String,                                                   // 职务
//      positionCode: Number,                                               // 个人年度成绩
//      isCommander: Boolean,                                               // 是否为指挥员，自动从人员继承（界面不体现）
//      isMaster: Boolean,                                                  // 是否为军政主官，自动从人员继承（界面不体现）
//      score: Number
//  }],
//  cantBeExcellent: Boolean,                                               // 军政主官有1人达不到优秀，则为true

//  tacticsScore: Number,                                                   // 战术（战役）作业成绩
//  exerciseScore: Number,                                                  // 指挥所演习成绩

//  isPassed: Boolean,                                                      // 是否达标
//  annualScore: Number,                                                    // 年度训练成绩

//  notes: [String],                                                        // 备注信息
//  createdBy: String,                                                      // 填写人
//  approvedBy: String,                                                     // 审核人
// });

const OfficeAnnualScore = Parse.Object.extend("OfficeAnnualScore", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new OfficeAnnualScore();
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

module.exports = OfficeAnnualScore;
