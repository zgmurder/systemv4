import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName, CourseCategory } from '../../../Constants';
import TrainStandard from './TrainStandard';
import TrainSection from './TrainSection';

// 子课目
// const SubCourseSchema = Schema({
// 	seq: Number,
// 	name: String,
// 	require: String,
// 	subcourses: [SubCourseSchema],
// });

// 课目
// const CourseSchema = new Schema({
// 	name: { type: String, required: true },         // 课目名称
//  seq: Number,                                    // 课目序号
//  category: Number,                               // 课目分类, 参考Constants.CourseCategory
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  section: { type: Schema.Types.ObjectId, ref: 'TrainSection' },    // 训练大纲
//  isManual: Boolean,                              // 子课目是否自定义
//  require: String,                                // 训练要求, 必训/选训/自训, 参考Constants.TrainRequirement
//  scoreCriteria: String,                          // 评分标准, 二级制/四机制/七级制/百分制
//  trainStep: String,                              // 训练步骤, 参考SportCategory
//  placeTypes: [String],                           // 训练场地要求, 参考PlaceType表

//  sportCategory: String,                          // 体育课目分类,参考SportCategory表
//  countType: String,                              // 课目成绩按 时间或数量 计数
//  isAscending: Boolean,                           // true: 递增评分，false: 递减评分
//  unitType: String,                               // 计量单位, (手动输入)（次/转/米/阶/圈等）

//  subcourses: [SubCourseSchema],                  // 子课目列表

//  textCondition: String,                          // 课目条件
//  textStandard: String,                           // 课目标准
//  textEvaluation: String,                         // 考核要求
// });

const SportCourse = Parse.Object.extend("Course", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('category', CourseCategory.Sport);
        this.set('isManual', false);
    }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new SportCourse();
            parseUtils.object2ParseObject(obj, item);
            if (obj.standard) {
                let parseStandard = TrainStandard.fromObject(parseUtils.fixObject(obj.standard));
                item.set('standard', parseStandard);
            }
            if (obj.section) {
                let parseSection = TrainSection.fromObject(parseUtils.fixObject(obj.section));
                item.set('section', parseSection);
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
            return ['standard'];
        },
        queryCondition: function (query) {
            query.equalTo('category', CourseCategory.Sport);
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

module.exports = SportCourse;
