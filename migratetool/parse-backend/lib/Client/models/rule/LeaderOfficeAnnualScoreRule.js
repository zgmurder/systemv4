import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from '../standard/TrainStandard';

// 首长机关年度训练成绩评定标准
// const LeaderOfficeAnnualScoreRuleSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  scoreCriteria: String,                           // 成绩评定标准(多级制类型)
//  score: Number,                                   // 评定成绩
//  withTactics: Boolean,                            // 是否有战术作业成绩
//  conditions: [{                                   // 成绩评定条件(对象为个人单课目成绩)
//      scoreCriteria: String,                       // 成绩评定标准(多级制类型)
//      exerciseSocre: Number,                        // 指挥所演习成绩要求(0:表示无要求)
//      scoreReq: Number,                            // 成绩要求
//      courseNum: Number,                           // 符合成绩要求的课目数, 数组中的每个条件之间是并且的关系
//  }]
// });

const LeaderOfficeAnnualScoreRule = Parse.Object.extend("LeaderOfficeAnnualScoreRule", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) { }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new LeaderOfficeAnnualScoreRule();
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

module.exports = LeaderOfficeAnnualScoreRule;