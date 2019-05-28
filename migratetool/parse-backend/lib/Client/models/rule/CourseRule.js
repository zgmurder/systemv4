import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from '../standard/TrainStandard';
import Course from '../standard/Course';

// const ChildSchema = new Schema({
//  priority: Number,       // 优先级: 0-10可选, 值越大优先级越高
//  months: [Number],       // 月份选择，参考Monthes
//  weekSeq: [Number],        // 1-5, 表示每个月第几周, 5表示最后一周

//  dayType: String,        // 工作日; 休息日; 节假日,参考DayType
//  weekdays: [Number],        // 星期一...星期日(0-6)，参考WeekDays
//  holidays: [Number],     // 1-7表示节假日第几天, 255表示最后1天
//  section: String,			  // 时间段: 早操; 上午; 下午; 夜间; 不设置为无限制;参考DailySection
//  fromHour: Number,       // 开始课时
//  hours: Number           // 持续课时
// });

// 全局课目规则(针对非军事课目)
// const CourseRuleSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 大纲标准
// 	courseCategory: Number,                                             // 课目分类
// 	course: { type: Schema.Types.ObjectId, ref: 'Course' },             // 课目对象
//  orgCategories: [String],                                            // 适用的单位分类列表

//  forbiddenWeathers: [String],                                        // 禁训天气

//  rateEnabled: Boolean,                                               // 频率设置是否有效
//  rateUnit: String,                                                   // 每周/每月，参考TimeUnit
//  times: Number, 		                                                // 次数
//  totalEnabled: Boolean,                                              // 总次数有效
//  totalTimes: Number,                                                 // 总次数 

// 	childRules: [ChildSchema],                                          // 子训练规则设置
//  preRule: { type: Schema.Types.ObjectId, ref: 'GlobalRule' }         // 前置规则
// });

const CourseRule = Parse.Object.extend("CourseRule", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) { }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new CourseRule();
            parseUtils.object2ParseObject(obj, item);
            if (obj.standard) {
                let parseStandard = TrainStandard.fromObject(parseUtils.fixObject(obj.standard));
                item.set('standard', parseStandard);
            }
            if (obj.course) {
                let parseCourse = Course.fromObject(parseUtils.fixObject(obj.course));
                item.set('course', parseCourse);
            }
            if (obj.preRule) {
                let parseCourseRule = CourseRule.fromObject(parseUtils.fixObject(obj.preRule));
                item.set('preRule', parseCourseRule);
            }

            if (!obj.objectId) {
                var acl = new Parse.ACL();
                acl.setPublicReadAccess(true);
                acl.setRoleWriteAccess(RoleName.Administrator, true);
                item.setACL(acl);
            }
            return item;
        },
        getIncludes: function () {
            return ['standard', 'course', 'preRule'];
        },
        simplify: function (obj) {
            obj.standard && (obj.standard = {
                objectId: obj.standard.objectId,
                name: obj.standard.name
            });

            return obj;
        }
    });

module.exports = CourseRule;