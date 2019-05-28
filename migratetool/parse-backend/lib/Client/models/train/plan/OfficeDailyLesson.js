import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Soldier from '../../resource/Soldier';
import Trainer from '../../resource/Trainer';
import TrainPlace from '../../resource/TrainPlace';
import Course from '../../standard/Course';
import OfficeMonthPlan from './OfficeMonthPlan';

// const LessonSchema = new Schema({
// 	section: String,  (un)                                      // 见DaySection, 分早操,上午,下午,夜间
// 	hours: Number,                                          // 课时
// 	category: Number,      (un)                                 // 课目类型, CourseCategory
//  trainMethod: String,                                    // 组训方法
//
//  courses: [{                                             // 安排的课目
//      seq: Number,
//      name: String,
//      courseId: String,                                   // 课目ID，手动录入时, Id为空
//      category: Number,                                   // 课目类型, CourseCategory
//      isManual: String,                                   // 区分该课目是否手动录入
//      depart: String,     (m                                // 所属部门
//      major: String,    (m                                  // 专业课目，按专业区分 (训练单位如果区分专业，那么按专业分列显示)
//
//      inputText: String,                                  // 手动录入子课目内容
//      subcourses: [{                                      // 选择的一级子课目内容
//          name: String,                                   // 一级子课目内容
//          inputText: String,                              // 手动录入二级子课目内容
//          subcourses: [String]                            // 选择的二级子课目内容
//      }],
//  }],
//
// 	trainer: { type: Schema.Types.ObjectId, ref: 'Soldier' },
// 	place: { type: Schema.Types.ObjectId, ref: 'TrainPlace' }
// });

// 每日课表
// const OfficeDailyLessonSchema = new Schema({
// 	date: { type: Date, required: true },
//  weekSeq: Number,
// 	weekday: Number,
//  dayType: String,            //'工作日', '休息日', '节假日'
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，总队或支队单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  monthPlan: { type: Schema.Types.ObjectId, ref: 'OfficeMonthPlan' },       // 机关月计划
//
// 	hoursInDay: { type: Number, default: 0 },                                    // 当日昼训课时
// 	hoursAtNight: { type: Number, default: 0 },                                    // 当日夜训课时
//
// 	lessons: [LessonSchema]
// });

const OfficeDailyLesson = Parse.Object.extend("OfficeDailyLesson", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new OfficeDailyLesson();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.monthPlan) {
            let parsePlan = OfficeMonthPlan.fromObject(parseUtils.fixObject(obj.monthPlan));
            item.set('monthPlan', parsePlan);
        }
        if (obj.lessons) {
            let lessons = obj.lessons.map(lesson => {
                if (lesson.trainer) {
                  lesson.trainer = {
                    objectId: lesson.trainer.objectId,
                    name: lesson.trainer.name
                  }
                }

                if (lesson.place) {
                  lesson.place = {
                    objectId: lesson.place.objectId,
                    name: lesson.place.name
                  }
                }

                return lesson;
              });

              item.set('lessons', lessons);
        }

        if (!obj.objectId) {
            parseUtils.setACL(item, obj, {
                readRoles: [RoleName.Administrator, RoleName.Reader],
                writeRoles: [RoleName.Operator]
            });
        }

        return item;
    },
    getIncludes: function() {
        return ['organization', 'WeeklyPlan'];
    }
});

module.exports = OfficeDailyLesson;
