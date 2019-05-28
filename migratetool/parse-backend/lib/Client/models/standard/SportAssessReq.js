import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';
import Course from './Course';

// 体育通用训练课目考核要求
// const SportAssessReqSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  course: { type: Schema.Types.ObjectId, ref: 'Course' },              // 体育课目
//  required: Boolean,                                                   // 是否必考,区分必考和选考
//  physicalLevels: [String],                                            // 体能训练等级列表
//  troopCategories: [String],                                            // 军兵种类型列表
//  genders: [String],                                                    // 性别要求列表(男/女)
//  isCivilServant: Boolean,                                              // 是否适用于文职人员
//  ageEnabled: Boolean,                                                  // 是否启用年龄条件
//  ageCondition: {                                                       // 年龄条件
//      fromAge: Number,                                                  // 年龄
//      toAge: Number,                                                    //
//  },
// });

const SportAssessReq = Parse.Object.extend("SportAssessReq", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('required', true);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new SportAssessReq();
        parseUtils.object2ParseObject(obj, item);
        if (obj.standard) {
            let parseStandard = TrainStandard.fromObject(parseUtils.fixObject(obj.standard));
            item.set('standard', parseStandard);
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
    getIncludes: function() {
        return ['standard', 'course'];
    },
    simplify: function(obj) {
        obj.standard && (obj.standard = {
            objectId: obj.standard.objectId,
            name: obj.standard.name
        });

        return obj;
    }
});

module.exports = SportAssessReq;
