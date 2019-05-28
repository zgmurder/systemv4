import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 职务定义
// const PositionSchema = new Schema({
// 	name: { type: String, unique: true, required: true },
//  orgCategory: Number,            // 单位分类
//  isCommander: Boolean,           // 是否指挥员
//  isMaster: Boolean,              // 是否军政主官
// 	sortCode: Number,               // 职务编码(排序用)
// });

const Position2 = Parse.Object.extend("Position2", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new Position2();
    parseUtils.object2ParseObject(obj, item);

    if (!obj.objectId) {
    	var acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setRoleWriteAccess(RoleName.Administrator, true);
        item.setACL(acl);
    }
    return item;
  },
  queryCondition: function(query) {
    query.addAscending('sortCode');
  }
});

module.exports = Position2;
