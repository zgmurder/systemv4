import Parse from '../parse';
import parseUtils from '../../utils/parseUtils';
import { RoleName, SubmitState } from '../../Constants';
import Organization from '../models/resource/Organization';
import Course from '../models/standard/Course';
import Soldier from '../models/resource/Soldier';
import AssessEvent from './AssessEvent';

// 个人单课目成绩

// const PersonScoreSchema = new Schema({
//  assessEvent: { type: Schema.Types.ObjectId, ref: 'AssessEvent' },       // 考核事件
//  assessAt: { type: Date, required: true },                               // 考核日期(时分秒都为0)
//  course: { type: Schema.Types.ObjectId, ref: 'Course' },                 // 考核课目
//  courseName: String,                                                     // 课目名称（自动设置，检索用）
//  testContent: String,                                                  // 考核内容（可人工填写，同一个课目可以登记多个考核内容）
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

//  assessMethod: String,                                                   // 考核方式(普考或抽考) (参考AssessMethod)
//  scoreCriteria: String,                                                  // 成绩标准
//  score: Number,                                                          // 首考成绩(0：表示缺考)
//  makeupScore: Number,                                                    // 补考成绩
//  isMakeup: Boolean,                                                      // 是否已经补考过(录入补考成绩后，表示已补考)
// });

const PersonScore = Parse.Object.extend("PersonScore", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('isMakeup', false);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new PersonScore();
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
        if (obj.course) {
            let parseCourse = Course.fromObject(parseUtils.fixObject(obj.course));
            item.set('course', parseCourse);
            item.set('courseName', parseCourse.get('name'));
        }
        if (obj.assessEvent) {
            let parseAssessEvent = AssessEvent.fromObject(parseUtils.fixObject(obj.assessEvent));
            item.set('assessEvent', parseAssessEvent);
            item.set('assessAt', parseAssessEvent.get('date'));
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
        return ['organization', 'course', 'soldier'];
    }
});

module.exports = PersonScore;
