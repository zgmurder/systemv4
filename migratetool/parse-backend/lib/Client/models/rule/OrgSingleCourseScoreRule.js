import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from '../standard/TrainStandard';

// 单位单课目训练成绩评定规则
// const OrgSingleCourseScoreRuleSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  scoreCriteria: String,                           // 成绩评定标准(多级制类型)
//  score: Number,                                   // 评定成绩
//  conditions: [{                                   // 成绩评定条件(对象为个人单课目成绩)
//      scoreCriteria: String,                       // 成绩评定标准(多级制类型)
//      scoreReq: Number,                            // 成绩要求
//      matchRate: Number,                          // 符合成绩要求的百分比, 数组中的每个条件之间是并且的关系
//  }]
// });

const OrgSingleCourseScoreRule = Parse.Object.extend("OrgSingleCourseScoreRule", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) { }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new OrgSingleCourseScoreRule();
            parseUtils.object2ParseObject(obj, item);
            if (obj.standard) {
                let parseStandard = TrainStandard.fromObject(parseUtils.fixObject(obj.standard));
                item.set('standard', parseStandard);
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
        simplify: function (obj) {
            obj.standard && (obj.standard = {
                objectId: obj.standard.objectId,
                name: obj.standard.name
            });

            return obj;
        }
    });

module.exports = OrgSingleCourseScoreRule;