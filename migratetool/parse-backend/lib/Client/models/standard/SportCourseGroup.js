import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';
import Course from './Course';

// 体育专项训练课目组
// const SportCourseGroupSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  groupId: Number,                                                    // 课目组编号
//  itemSeq: Number,                                                    // 课目序号
//  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],           // 体育课目列表
//  physicalLevel: String,                                              // 体能训练等级
//  troopCategory: String,                                              // 军兵种类型
//  gender: String,                                                     // 性别要求
// });

const SportCourseGroup = Parse.Object.extend("SportCourseGroup", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
       
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new SportCourseGroup();
        parseUtils.object2ParseObject(obj, item);
        if (obj.standard) {
            let parseStandard = TrainStandard.fromObject(parseUtils.fixObject(obj.standard));
            item.set('standard', parseStandard);
        }
        if (obj.courses) {
            let parseCourse = parseUtils.fixObjectArray(Course, obj.courses);
            item.set('courses', parseCourse);
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
        return ['standard', 'courses'];
    },
    simplify: function(obj) {
        obj.standard && (obj.standard = {
            objectId: obj.standard.objectId,
            name: obj.standard.name
        });

        return obj;
    }
});

module.exports = SportCourseGroup;
