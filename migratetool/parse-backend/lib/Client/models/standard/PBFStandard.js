import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';

// 体脂合格标准
// const PBFStandardSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  gender: String,                                 // 性别
//  ageRange: {                                     // 年龄范围
//      from: Number,
//      to: Number
//  },
//  pbfRange: {                                     // 体脂范围,单位百分比
//      from: Number,
//      to: Number
//  }
// });

const PBFStandard = Parse.Object.extend("PBFStandard", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) { }
}, {
    // Class methods
    fromObject: function (obj) {
        var item = new PBFStandard();
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

module.exports = PBFStandard;
