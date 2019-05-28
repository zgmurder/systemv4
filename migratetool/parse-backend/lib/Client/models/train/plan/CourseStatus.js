import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Soldier from '../../resource/Soldier';
import TrainPlace from '../../resource/TrainPlace';
import Course from '../../standard/Course';

// const CourseStatusSchema = new Schema({
//  year: Number,
// 	course: { type: Schema.Types.ObjectId, ref: 'Course' },
// 	category: { type: Number, required: true, default: 0 },
// 	organization: { type: Schema.Types.ObjectId, ref: 'Organization' },

// 	// 课目状态：0: 未开始 1: 进行中 2: 考核中; 3:已完成 (课目转换申请表审批通过后即切换成进行中状态)
// 	state: { type: String, default: '未开始' },
// 	needTest: Boolean,
// 	startAt: Date,                                      // 课目开始安排训练时间
// 	endAt: Date,                                        // 课目最后安排训练时间
// 	hoursInDay: { type: Number, default: 0 },           // 课目时间要求
// 	hoursAtNight: { type: Number, default: 0 },         // 课目时间要求
// 	actualHoursInDay: { type: Number, default: 0 },     // 实际昼训课时
// 	actualHoursAtNight: { type: Number, default: 0 },   // 实际夜训课时
// 	retainHours: { type: Number, default: 0 },          // 复训课时,待定
// 	patchHours: { type: Number, default: 0 },           // 补训课时，待定
//  monthStats: [{                                      // 月度统计
//   month: Number,
//   hoursInDay: Number,
//   hoursAtNight: Number,
//   actualHoursInDay: Number,
//   actualHoursAtNight: Number,
//   countInMonth: Number,
//  }],
//  countInYear: { type: Number, default: 0 },          // 年度安排次数
//  competitionCount: { type: Number, default: 0 },     // 当前已安排会操次数

//  trainMethod: String,                                                // 组训方法
// 	places: [{ type: Schema.Types.ObjectId, ref: 'TrainPlace' }],       // 可选场地
// 	lastPlace: { type: Schema.Types.ObjectId, ref: 'TrainPlace' },      // 最近安排的场地
// 	lastTrainer: { type: Schema.Types.ObjectId, ref: 'Soldier' },       // 最近安排的教练员
// });

const CourseStatus = Parse.Object.extend("CourseStatus", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new CourseStatus();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
        }
        if (obj.course) {
            let parseCourse = Course.fromObject(parseUtils.fixObject(obj.course));
            item.set('course', parseCourse);
        }
        if (obj.lastPlace) {
            let parsePlace = TrainPlace.fromObject(parseUtils.fixObject(obj.lastPlace));
            item.set('lastPlace', parsePlace);
        }
        if (obj.places) {
            let places = parseUtils.fixObjectArray(TrainPlace, obj.places);
            if (places) item.set('places', places);
        }
        if (obj.lastTrainer) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.lastTrainer));
            item.set('lastTrainer', parseSoldier);
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
        return ['organization', 'course', 'places', 'lastPlace', 'lastTrainer'];
    }
});

module.exports = CourseStatus;
