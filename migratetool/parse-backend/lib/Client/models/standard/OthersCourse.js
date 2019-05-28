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
//  trainStep: String,                              // 训练步骤, 参考TrainStep表
//  orgType: String,                                // 课目适用的单位类型
//  orgCategories: [String],                        // 课目适用的单位分类列表,一般是一个
//  personProperties: [String],                     // 课目适用的人员属性列表,一般是一个
//  trainUnits: [String],                           // 训练单元(编制序列), 单兵/班/排/中队/大队.
//  task: String,                                   // 课目对应任务
//  serviceReq: String,                             // 勤务类型要求
//  serviceReq: String,                             // 专业类型要求
//  rankL2Reqs: [String],                           // 军衔要求(军衔二级分类)
//  ordnanceTypes: [String],                        // 配套军械类型, 参考OrdnanceType表
//  placeTypes: [String],                           // 训练场地要求, 参考PlaceType表
//  physicalLevel: String,                          // 体能训练等级, 参考PhysicalLevel表

//  subcourses: [SubCourseSchema],                  // 子课目列表

//  textCondition: String,                          // 课目条件
//  textStandard: String,                           // 课目标准
//  textEvaluation: String,                         // 考核要求
// });

const OthersCourse = Parse.Object.extend("Course", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {
    this.set('category', CourseCategory.Others);
    this.set('isManual', true);
  }
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new OthersCourse();
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
  queryCondition: function(query) {
    query.equalTo('category', CourseCategory.Others);
  },
});

module.exports = OthersCourse;
