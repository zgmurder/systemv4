import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Soldier from '../../resource/Soldier';

// 个人军事体育训练考核成绩登记表

// const PersonSportAnnualScoreSchema = new Schema({
//  year: { type: Number, required: true },                                 // 年份
//  month: Number,                                                          // 月份
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
//  state: Number,                                                          // 提交状态(0: 未提交; 1:已提交) 正式提交后才能被上级查看

//  isCivilServant: Boolean,                                                // 是否为文职人员 (从人员继承)
//  physicalLevel: String,                                                  // 体能训练等级（一类人员/二类人员/三类人员/新兵） (从人员继承)
//
//  assessMethod: String,                                                   // 考核方式(普考或抽考或训练) (参考AssessMethod)
//
//  shapeScore: Number,                                                     // 成绩评定(合格或不合格)
//  shape: {                                                                // 体型
//      height: Number,                                                     // 身高cm
//      weight: Number,                                                     // 体重kg
//      bmi: Number,                                                        // 体型
//      pbf: Number,                                                        // 体脂
//      score: Number,                                                      // 成绩评定(合格或不合格)
//  },
//  evaluatedScoreCriteria: String,                                         // 总评评分标准
//  evaluatedScore: Number,                                                 // 总评成绩

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

//  notes: [String],                                                        // 备注
//  createdBy: String,                                                      // 主考人
// });

const PersonSportAnnualScore = Parse.Object.extend("PersonSportAnnualScore", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new PersonSportAnnualScore();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
        }
        if (obj.organizer) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organizer));
            item.set('organizer', parseOrganization);
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
        return ['organization', 'organizer','soldier'];
    }
});

module.exports = PersonSportAnnualScore;
