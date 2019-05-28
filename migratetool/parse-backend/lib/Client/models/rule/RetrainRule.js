import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from '../standard/TrainStandard';
import TrainSection from '../standard/TrainSection';
import Course from '../standard/Course';

// 复训课目规则
// const RetrainRuleSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 大纲标准
//  section: { type: Schema.Types.ObjectId, ref: 'TrainSection' },    // 大纲标准
// 	courseCategory: Number,                                             // 课目分类
// 	course: { type: Schema.Types.ObjectId, ref: 'Course' },             // 课目对象
//  orgCategories: [String],                                            // 适用的单位分类列表

//  sequence: Number, 		        // 复训安排顺序
//  hours: Number, 		            // 每次安排的课时数
//  weight: Number,                 // 安排课时权重
// });

const RetrainRule = Parse.Object.extend("RetrainRule", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) { }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new RetrainRule();
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

module.exports = RetrainRule;