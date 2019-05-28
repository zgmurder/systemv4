import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Course from '../../standard/Course';

// const CourseTimeStatusSchema = new Schema({
//  year: Number,
// 	course: { type: Schema.Types.ObjectId, ref: 'Course' },
// 	organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 创建单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  annualPlanId: String,                                                   // 年度计划ID

//  orgCategory: String,                                                    // 单位分类
//  serviceReq: String,                                                     // 勤务类型
//  majors: [String],                                                       // 专业区分 (有些分队，不同专业的阶段训练时间不同，比如工兵分队、防化分队等)
//  orgProperty: String,                                                    // 单位属性
//  major: String,

//  realtedCourseIds: [String],                         // 课目时间中关联的所有课目

// 	hoursInDay: { type: Number, default: 0 },           // 课目时间要求
// 	hoursAtNight: { type: Number, default: 0 },         // 课目时间要求
// 	actualHoursInDay: { type: Number, default: 0 },     // 实际昼训课时
// 	actualHoursAtNight: { type: Number, default: 0 },   // 实际夜训课时

// });

const CourseTimeStatus = Parse.Object.extend("CourseTimeStatus", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new CourseTimeStatus();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.course) {
            let parseCourse = Course.fromObject(parseUtils.fixObject(obj.course));
            item.set('course', parseCourse);
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
        return ['organization', 'course'];
    }
});

module.exports = CourseTimeStatus;
