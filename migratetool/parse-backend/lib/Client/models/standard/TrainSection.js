import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import {RoleName} from '../../../Constants';
import TrainStandard from './TrainStandard';

// 军事训练大纲分册
// const TrainSectionSchema = new Schema({
// 	name: { type: String, unique: true, required: true },   // 分册名称
//  code: String,                                   // 分册编码
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  orgTypes: [String]                              // 本分册适用的单位类型
//  orgCategories: [String],                        // 本分册适用的单位分类
//  personProperties: [String],                     // 本分册适用的人员属性
// });

const TrainSection = Parse.Object.extend("TrainSection", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function (obj) {
        var item = new TrainSection();
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
    }
});

module.exports = TrainSection;
