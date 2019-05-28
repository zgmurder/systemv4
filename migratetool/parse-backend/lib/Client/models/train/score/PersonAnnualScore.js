import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Soldier from '../../resource/Soldier';

// 个人年度训练成绩

// const PersonAnnualScoreSchema = new Schema({
//  year: { type: Number, required: true },                                 // 年份
//  date: Date,                                                             // 登记日期
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//  soldier: { type: Schema.Types.ObjectId, ref: 'Soldier' },               // 人员
//  name: String,                                                           // 姓名
//  age: Number,                                                            // 年龄, 根据人员出生年月自动计算
//  gender: String,                                                         // 性别，自动从人员继承
//  cardId: String,                                                         // 保障卡号
//  position: String,                                                       // 职务，自动从人员继承
//  positionCode: Number,                                                   // 人员职务编码，自动从人员继承，排序用
//  isCommander: { type: Boolean, default: false },                         // 是否为指挥员，自动从人员继承（界面不体现）
//  isMaster: { type: Boolean, default: false },                            // 是否为军政主官，自动从人员继承（界面不体现）
//  state: Number,                                                          // 提交状态(0: 未提交; 1:已提交) 正式提交后才能被上级查看

//  courseScores: [{                                                        // 课目成绩列表
//      name: String,                                                       // 课目名称
//      criteria: String,                                                   // 成绩标准
//      score: Number,                                                      // 课目成绩
//      makeupScore: Number,                                                // 补考成绩
//      isMakeup: Boolean,                                                  // 是否补考
//  }],

//  isPassed: Boolean,                                                      // 是否达标
//  score: Number,                                                          // 年度训练成绩
//  excellentTrainer: Boolean,                                              // 是否为优秀教练员(参谋)
//  competitions: [String],                                                 // 比武竞赛记录

//  createdBy: String,                                                      // 填写人
//  approvedBy: String,                                                     // 审核人
// });

const PersonAnnualScore = Parse.Object.extend("PersonAnnualScore", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new PersonAnnualScore();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
        }
        if (obj.soldier) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.soldier));
            item.set('soldier', parseSoldier);
            item.set('positionCode', parseSoldier.get('positionCode'));

            // item.set('position', parseSoldier.get('position'));
            // item.set('isCommander', parseSoldier.get('isCommander'));
            // item.set('isMaster', parseSoldier.get('isMaster'));
        }

        // if (!obj.objectId) 
        {
            parseUtils.setACL(item, obj, {
                readRoles: [RoleName.Operator, RoleName.Reader],
                writeRoles: [RoleName.Operator, RoleName.Network]
            });
        }

        return item;
    },
    getIncludes: function() {
        return ['organization', 'soldier'];
    }
});

module.exports = PersonAnnualScore;
