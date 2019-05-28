import Parse from '../parse';
import parseUtils from '../../utils/parseUtils';
import { RoleName, SubmitState } from '../../Constants';
import Organization from '../models/resource/Organization';
import Soldier from '../models/resource/Soldier';
import Course from '../models/standard/Course';
import SportEvent from './SportEvent';

// 个人体育单课目成绩记录

// const SportScorechema = new Schema({
//  sportEvent: { type: Schema.Types.ObjectId, ref: 'AssessEvent' },        // 体育课目考核事件
//  date: { type: Date, required: true },                               // 考核日期(时分秒都为0)
//  course: { type: Schema.Types.ObjectId, ref: 'Course' },                 // 考核课目
//  courseName: String,                                                     // 课目名称（自动设置，检索用）
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用

//  soldier: { type: Schema.Types.ObjectId, ref: 'Soldier' },               // 人员
//  age: Number,                                                            // 年龄, 根据人员出生年月自动计算
//  gender: String,                                                         // 性别，自动从人员继承
//  cardId: String,                                                         // 保障卡号
//  departmentPosition:                                                     // 单位名称+职务，自动从单位和人员继承
//  position: String,                                                       // 职务，自动从人员继承
//  positionCode: Number,                                                   // 人员职务编码，自动从人员继承，排序用
//  isCommander: { type: Boolean, default: false },                         // 是否为指挥员，自动从人员继承（界面不体现）
//  isMaster: { type: Boolean, default: false },                            // 是否为军政主官，自动从人员继承（界面不体现）

//  require: Boolean,                                                       // true为通用必考课目，false为专项课目,弃用
//  sportTestCategory: Number,                                              // 体育考核要求分类，见SportTestCategory
//  groupId: Number,                                                        // 专项课目组编号

//  assessMethod: String,                                                   // 考核方式(普考或抽考或训练) (参考AssessMethod)
//  scoreCriteria: String,                                                  // 成绩标准
//  count: Number,                                                          // 考核计数成绩
//  countType: String,                                                      // 计数类型（参考CountType, 时间或数量）(从课目继承)
//  unitType: String,                                                       // 计数单位(秒/次/转等)(从课目继承)
//  score: Number,                                                          // 考核得分(四机制或百分制)
//  isMakeup: Boolean,                                                      // 是否补考成绩
//  isPassed: Boolean,                                                      // 是否及格
// });

const SportScore = Parse.Object.extend("SportScore", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new SportScore();
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
        if (obj.course) {
            let parseCourse = Course.fromObject(parseUtils.fixObject(obj.course));
            item.set('course', parseCourse);
            item.set('courseName', parseCourse.get('name'));
        }
        if (obj.sportEvent) {
            let parseSportEvent = SportEvent.fromObject(parseUtils.fixObject(obj.sportEvent));
            item.set('sportEvent', parseSportEvent);
            item.set('date', parseSportEvent.get('date'));
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
        return ['organization','organizer', 'soldier', 'course', 'sportEvent'];
    }
});

module.exports = SportScore;
