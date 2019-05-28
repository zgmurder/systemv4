import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';
import TrainSection from './TrainSection';
import Course from './Course';

// 课目配档表
// const CourseDistributionSchema = new Schema({
// 	name: { type: String, required: true },         // 课目名称
//  seq: Number,                                    // 课目序号
//  course: { type: Schema.Types.ObjectId, ref: 'Course' },    // 训练课目
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  section: { type: Schema.Types.ObjectId, ref: 'TrainSection' },    // 训练大纲
//  orgCategories: [String],                        // 课目适用的单位分类列表(同课目)
//  personProperties: [String],                     // 课目适用的人员属性列表
//  serviceReq: String,                             // 勤务类型(可选)
//  task: String,                                   // 训练任务
//  subjects: [String],                             // 训练课题列表
// });

const CourseDistribution = Parse.Object.extend("CourseDistribution", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) { }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new CourseDistribution();
            parseUtils.object2ParseObject(obj, item);
            if (obj.standard) {
                let parseStandard = TrainStandard.fromObject(parseUtils.fixObject(obj.standard));
                item.set('standard', parseStandard);
            }
            if (obj.section) {
                let parseSection = TrainSection.fromObject(parseUtils.fixObject(obj.section));
                item.set('section', parseSection);
            }
            if (obj.course) {
                let parseCourse = Course.fromObject(parseUtils.fixObject(obj.course));
                item.set('course', parseCourse);
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
            return ['standard', 'section', 'course'];
        },
        simplify: function (obj) {
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

module.exports = CourseDistribution;
