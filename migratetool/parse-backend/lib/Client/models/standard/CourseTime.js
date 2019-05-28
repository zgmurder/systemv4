import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';
import TrainSection from './TrainSection';
import Course from './Course';

// 课目时间表
// const CourseTimeSchema = new Schema({
//  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],    // 训练课目列表
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  section: { type: Schema.Types.ObjectId, ref: 'TrainSection' },    // 训练大纲
//  orgCategories: [String],                        // 课目适用的单位分类列表
//  personProperties: [String],                     // 课目适用的人员属性列表
//  task: String,                                   // 任务类型(已被删除)
//  tasks: [String],                                // 对应任务类型
//  serviceReq: [String],                           // 勤务类型
//  major: String,                                  // 专业类型(新增)
//  hoursInDay: Number,                             // 昼训时间要求
//  hoursAtNight: Number,                           // 夜训时间要求
// });

const CourseTime = Parse.Object.extend("CourseTime", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new CourseTime();
    parseUtils.object2ParseObject(obj, item);
    if (obj.standard) {
        let parseStandard = TrainStandard.fromObject(parseUtils.fixObject(obj.standard));
        item.set('standard', parseStandard);
    }
    if (obj.section) {
        let parseSection = TrainSection.fromObject(parseUtils.fixObject(obj.section));
        item.set('section', parseSection);
    }
    if (obj.courses) {
        let parseCourses = parseUtils.fixObjectArray(Course, obj.courses);
        item.set('courses', parseCourses);
    }

    if (!obj.objectId) {
    	var acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setRoleWriteAccess(RoleName.Administrator, true);
        item.setACL(acl);
    }
    return item;
  },
  getIncludes: function() {
    return ['standard', 'section', 'courses'];
  },
  simplify: function(obj) {
    obj.standard && (obj.standard = {
        objectId: obj.standard.objectId,
        name: obj.standard.name
    });
    obj.section && (obj.section = {
        objectId: obj.section.objectId,
        name: obj.section.name
    });

    return obj;
  }
});

module.exports = CourseTime;
