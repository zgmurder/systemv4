import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 单位分类
// const OrgCategorySchema = new Schema({
// 	name: { type: String, unique: true, required: true },
//  orgType: String,
//  orgProperty: String,
//  optionalServices: [String]
//  optionalTasks: [{
//      name: String,
//      optionalSubjects: [String]
//  }]
// 	optionalMajors: [String],
//  physicalLevel: String,          // 体能训练等级(一类人员/二类人员/三类人员)
//  troopCategory: String,          // 军兵种(地面人员/空勤人员/船艇人员)
// });

const OrgCategory = Parse.Object.extend("OrgCategory", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new OrgCategory();
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

module.exports = OrgCategory;