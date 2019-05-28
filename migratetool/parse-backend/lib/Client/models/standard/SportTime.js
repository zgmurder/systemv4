import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';

// 体育课目时间表
// const SportTimeSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
// 	sportCategory: String,                                  // 体育科目分类
//  physicalLevel: String,                                  // 体能训练等级
//  hours: Number,                                          // 时间要求
// });

const SportTime = Parse.Object.extend("SportTime", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {}
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new SportTime();
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

module.exports = SportTime;
