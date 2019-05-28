import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 教练员等级
// const TrainerLevelSchema = new Schema({
// 	name: { type: String, unique: true, required: true },
//  scoreReq: Number      // 所训课目成绩达标要求(四级制)
// });

const TrainerLevel = Parse.Object.extend("TrainerLevel", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new TrainerLevel();
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

module.exports = TrainerLevel;