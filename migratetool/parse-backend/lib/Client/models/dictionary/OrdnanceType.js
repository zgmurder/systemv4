import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 军械类型(武器弹药)
// const OrdnanceTypeSchema = new Schema({
// 	name: { type: String, unique: true, required: true },
//  category: String,       // 军械分类，参考OrdnanceCategory, 分为武器、弹药、物资
//  weaponUnit: String,     // 武器计量单位
//  bulletUnit: String      // 对应弹药/物资计量单位
// });

const OrdnanceType = Parse.Object.extend("OrdnanceType", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new OrdnanceType();
    parseUtils.object2ParseObject(obj, item);

    if (!obj.objectId) {
    	var acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setRoleWriteAccess(RoleName.Administrator, true);
        item.setACL(acl);
    }
    return item;
  }
});

module.exports = OrdnanceType;