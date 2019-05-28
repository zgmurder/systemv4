import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 体能训练等级(一类人员、二类人员、三类人员、新兵)
// const PhysicalLevelSchema = new Schema({
// 	name: { type: String, unique: true, required: true },
// });

const PhysicalLevel = Parse.Object.extend("PhysicalLevel", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new PhysicalLevel();
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

module.exports = PhysicalLevel;