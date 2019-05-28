import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Soldier from '../../resource/Soldier';
import Assessment from './Assessment';

// 个人抽考/训练成绩排名

// const PersonScoreRankSchema = new Schema({
//  assessment: { type: Schema.Types.ObjectId, ref: 'Assessment' },         // 关联考核事件
//  date: Date,                                                             // 登记日期
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//  organizer: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 组织单位
//  soldier: { type: Schema.Types.ObjectId, ref: 'Soldier' },               // 人员
//  name: String,                                                           // 姓名
//  age: Number,                                                            // 年龄, 根据人员出生年月自动计算
//  gender: String,                                                         // 性别，自动从人员继承
//  cardId: String,                                                         // 保障卡号
//  departmentPosition:                                                     // 单位名称+职务，自动从单位和人员继承
//  position: String,                                                       // 职务，自动从人员继承
//  positionCode: Number,                                                   // 人员职务编码，自动从人员继承，排序用
//  isCommander: { type: Boolean, default: false },                         // 是否为指挥员，自动从人员继承（界面不体现）
//  isMaster: { type: Boolean, default: false },                            // 是否为军政主官，自动从人员继承（界面不体现）

//  assessMethod: String,                                                   // 考核方式(普考或抽考或训练) (参考AssessMethod)
//
//  scoreCriteria: String,                                                  // 训练课目评分标准
//  totalScore: Number,                                                     // 训练课目百分制得分总分
//  rank: Number,                                                           // 排名
//  courseScores: [{
//      scoreCriteria: String,                                                  // 成绩标准
//      courseId: String,                                                   // 课目对象ObjectId
//      courseName: String,                                                 // 课目名称
//      count: Number,                                                      // 考核计数成绩
//      countType: String,                                                  // 计数类型（参考CountType, 时间或数量）(从课目继承)
//      unitType: String,                                                   // 计数单位(秒/次/转等)(从课目继承)
//      score: Number,                                                      // 百分制或四级制得分
//  }],
// });

const PersonScoreRank = Parse.Object.extend("PersonScoreRank", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new PersonScoreRank();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.organizer) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organizer));
            item.set('organizer', parseOrganization);
        }
        if (obj.soldier) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.soldier));
            item.set('soldier', parseSoldier);
        }
        if (obj.assessment) {
            let parseAssessment = Assessment.fromObject(parseUtils.fixObject(obj.assessment));
            item.set('assessment', parseAssessment);
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
        return ['assessment', 'organization', 'organizer','soldier'];
    }
});

module.exports = PersonScoreRank;
