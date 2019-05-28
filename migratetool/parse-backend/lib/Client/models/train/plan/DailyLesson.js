import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Soldier from '../../resource/Soldier';
import Trainer from '../../resource/Trainer';
import TrainPlace from '../../resource/TrainPlace';
import Course from '../../standard/Course';
import WeeklyPlan from './WeeklyPlan';

// const LessonSchema = new Schema({
// 	section: String,                                        // 见DaySection, 分早操,上午,下午,夜间
// 	hours: Number,                                          // 课时
// 	category: Number,                                       // 课目类型, CourseCategory
//  priority: Number,

//  courses: [{                                          // 安排的课目
//      seq: Number,
//      name: String,
//      courseId: String,                                   // 课目ID，手动录入时, Id为空
//      category: Number,                                   // 课目类型, CourseCategory
//      isManual: String,                                   // 区分该课目是否手动录入
//      major: String,                                      // 专业课目，按专业区分 (训练单位如果区分专业，那么按专业分列显示)
//      gunnerType: String,                                 // 针对射击课目，区分枪手类型

//      inputText: String,                                  // 手动录入子课目内容
//      subcourses: [{                                      // 选择的一级子课目内容
//          name: String,                                   // 一级子课目内容
//          inputText: String,                              // 手动录入二级子课目内容
//          subcourses: [String]                            // 选择的二级子课目内容
//      }],
//  }],

// 	trainer: { type: Schema.Types.ObjectId, ref: 'Soldier' },
//  trainerName: String,
// 	place: { type: Schema.Types.ObjectId, ref: 'TrainPlace' }
// });

// 每日课表
// const DailyLessonSchema = new Schema({
// 	date: { type: Date, required: true },
//  weekSeq: Number,
// 	weekday: Number,
//  dayType: String,            //'工作日', '休息日', '节假日'
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 必填，中队或下级单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  weeklyPlan: { type: Schema.Types.ObjectId, ref: 'WeeklyPlan' },       // 周计划id

//  orgCategory: String,                                                    // 单位分类，训练对象
//  serviceReq: String,                                                     // 勤务类型
//  orgProperty: String,                                                    // 单位属性

// 	hoursInDay: { type: Number, default: 0 },                               // 当日昼训课时
// 	hoursAtNight: { type: Number, default: 0 },                             // 当日夜训课时

//  holiday: String,                                                        // 节日名称
//  holidayIndex: Number,                                                   // 节假日第几日
//  weather: String,                                                        // 天气
// 	theDuty: { type: Schema.Types.ObjectId, ref: 'Soldier' },               // 值班员

// 	lessons: [LessonSchema]
// });

const DailyLesson = Parse.Object.extend("DailyLesson", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new DailyLesson();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.weeklyPlan) {
            let parsePlan = WeeklyPlan.fromObject(parseUtils.fixObject(obj.weeklyPlan));
            item.set('weeklyPlan', parsePlan);
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

module.exports = DailyLesson;
