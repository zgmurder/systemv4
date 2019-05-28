import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Soldier from '../../resource/Soldier';

// 个人训练档案

// const PersonAnnualScoreSchema = new Schema({
//  year: { type: Number, required: true },                                 // 年份
//  date: Date,                                                             // 登记日期
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//  soldier: { type: Schema.Types.ObjectId, ref: 'Soldier' },               // 人员
//  name: String,                                                           // 姓名
//  cardId: String,                                                         // 保障卡号
//  position: String,                                                       // 职务，自动从人员继承
//  positionCode: Number,                                                   // 人员职务编码，自动从人员继承，排序用
//  state: Number,                                                          // 提交状态(0: 未提交; 1:已提交) 正式提交后才能被上级查看

//  courseScores: [{                                                        // 课目成绩列表
//      courseId: String,
//      name: String,                                                       // 课目名称
//      criteria: String,                                                   // 成绩标准
//      score: Number,                                                      // 课目成绩
//      makeupScore: Number,                                                // 补考成绩
//      isMakeup: Boolean,                                                  // 是否补考
//  }],

//  shapeScore: Number,                                                     // 成绩评定(合格或不合格)
//  shape: {                                                                // 体型
//      height: Number,                                                     // 身高cm
//      weight: Number,                                                     // 体重kg
//      bmi: Number,                                                        // 体型
//      pbf: Number,                                                        // 体脂
//      score: Number,                                                      // 成绩评定(合格或不合格)
//  },

//  requiredScoreCriteria: String,                                          // 通用训练课目评分标准
//  totalScore: Number,                                                     // 通用训练课目百分制得分总分
//  requiredCourseScores: [{
//      courseId: String,                                                   // 课目对象ObjectId
//      courseName: String,                                                 // 课目名称
//      count: Number,                                                      // 考核计数成绩
//      countType: String,                                                  // 计数类型（参考CountType, 时间或数量）(从课目继承)
//      unitType: String,                                                   // 计数单位(秒/次/转等)(从课目继承)
//      score: Number,                                                      // 百分制或四级制得分
//      isMakeup: Boolean,                                                      // 是否补考成绩
//      isPassed: Boolean,                                                      // 是否及格
//  }],

//  optionalScoreCriteria: String,                                          // 专项训练课目组评分标准
//  groupId: Number,                                                        // 专项课目组ID
//  optionalScore: Number,                                                  // 专项课目成绩
//  optionalCourseScores: [{
//      courseId: String,                                                   // 课目对象ObjectId
//      courseName: String,                                                 // 课目名称
//      count: Number,                                                      // 考核计数成绩
//      countType: String,                                                  // 计数类型（参考CountType, 时间或数量）(从课目继承)
//      unitType: String,                                                   // 计数单位(秒/次/转等)(从课目继承)
//      score: Number,                                                      // 百分制或四级制得分
//      isMakeup: Boolean,                                                      // 是否补考成绩
//      isPassed: Boolean,                                                      // 是否及格
//  }],

//  trainScore: Number,                                                     // 军事成绩总评
//  sportScore: Number,                                                     // 体育成绩总评

//  overAllScore: Number,                                                   // 年度训练成绩
//  isPassed: Boolean,                                                      // 是否达标

//  rewards: String,                                                   // 表彰与奖励

//  createdBy: String,                                                      // 填写人
//  approvedBy: String,                                                     // 审核人
// });

const PersonTrainArchive = Parse.Object.extend("PersonTrainArchive", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        let item = new PersonTrainArchive();
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

module.exports = PersonTrainArchive;
