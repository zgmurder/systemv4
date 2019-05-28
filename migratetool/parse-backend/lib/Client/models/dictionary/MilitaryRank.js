import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 军衔等级
// const MilitaryRankSchema = new Schema({
// 	name: { type: String, unique: true, required: true },
//  rankLevel1: String,
//  rankLevel2: String,
// 	levelCode: Number
// });

const MilitaryRank = Parse.Object.extend("MilitaryRank", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new MilitaryRank();
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
    query.addAscending('levelCode');
  }
});

module.exports = MilitaryRank;