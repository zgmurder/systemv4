import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';

// 体型合格标准
// const BMIStandardSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  gender: String,                                 // 性别
//  ageRange: {                                     // 年龄范围
//      from: Number,
//      to: Number
//  },
//  bmiRange: {                                     // 体脂范围
//      from: Number,
//      to: Number
//  }
// });

const BMIStandard = Parse.Object.extend("BMIStandard", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) { }
}, {
    // Class methods
    fromObject: function (obj) {
        var item = new BMIStandard();
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

module.exports = BMIStandard;
