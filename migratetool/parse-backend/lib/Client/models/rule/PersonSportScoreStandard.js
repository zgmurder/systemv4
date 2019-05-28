import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from '../standard/TrainStandard';

// 个人军事体育训练成绩评定标准
// const PersonSportScoreStandardSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  physicalLevel: String,                                              // 体能训练等级
//  isTotal: Boolean,                                                   // true: 总分; false:单项
//  scoreCriteria: String,                                              // 评分标准(七级制)
//  evaluatedScore: Number,                                             // 评定成绩
//  scoreCondtion: Number                                               // 得分
// });

const PersonSportScoreStandard = Parse.Object.extend("PersonSportScoreStandard", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('isTotal', false);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new PersonSportScoreStandard();
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
    getIncludes: function() {
        return ['standard'];
    },
    simplify: function(obj) {
        obj.standard && (obj.standard = {
            objectId: obj.standard.objectId,
            name: obj.standard.name
        });

        return obj;
    }
});

module.exports = PersonSportScoreStandard;
