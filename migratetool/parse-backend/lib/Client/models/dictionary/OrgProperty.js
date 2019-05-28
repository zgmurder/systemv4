import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 单位属性
// const OrgPropertySchema = new Schema({
// 	name: { type: String, unique: true, required: true },
// 	optionalMajors: [String]
// });

const OrgProperty = Parse.Object.extend("OrgProperty", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new OrgProperty();
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

module.exports = OrgProperty;