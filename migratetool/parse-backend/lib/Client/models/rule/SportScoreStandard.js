import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from '../standard/TrainStandard';
import Course from '../standard/Course';

// 体育课目考核要求
// const SportScoreStandardSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  course: { type: Schema.Types.ObjectId, ref: 'Course' },              // 体育课目
//  physicalLevels: [String],                                            // 体能训练等级列表
//  troopCategories: [String],                                            // 军兵种类型列表
//  gender: String,                                                       // 性别要求(男/女)
//  isCivilServant: Boolean,                                              // 是否为文职人员
//  isHighland: Boolean,                                                  // 是否为高原地区
//  heightRange: {                                                        // 海拔范围
//      from: Number,
//      to: Number,
//  },
//  scoreCriteria: String,                                                // 评分标准
//  scoreTarget: String,                                                  // 评分对象（个人/集体），见ScoreTarget
//  scoreDetail: {
//      individual: [{                                                   // 个人成绩细则(评分对象为个人时有效)
//          ageRange: {from: Number, to: Number},                        // 年龄范围
//          count: Number,                                               // 成绩计数
//          score: Number,                                               // 得分
//
//          scoreList: [{
//              count: Number,                                               // 成绩计数
//              score: Number,                                               // 得分
//          }]
//      }],
//      group: [{                                                        // 集体成绩细则(评分对象为集体时有效)
//          count: Number,                                               // 成绩计数
//          score: Number,                                               // 得分
//      }]
//  },
//  highScoreDetail: {                                                   // 超过100分后的成绩计算方式
//      countStep: Number,                                               // 成绩计数增量或减量
//      scoreStep: Number                                                // 得分增量
//  },
//  heightFactor: {                                                      // 海拔影响
//      heightStep: Number,                                              // 海拔增量
//      countStep: Number,                                               // 成绩计数增量
//  }
// });

const SportScoreStandard = Parse.Object.extend("SportScoreStandard", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('isCivilServant', false);
        this.set('isHighland', false);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new SportScoreStandard();
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

module.exports = SportScoreStandard;
