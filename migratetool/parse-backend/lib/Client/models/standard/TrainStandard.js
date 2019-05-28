import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName, StandardState } from '../../../Constants';

// 军事训练大纲
// const TrainStandardSchema = new Schema({
// 	name: { type: String, unique: true, required: true },
//  state: String,        // 大纲启用状态: 未启用/已启用/已停用  具体参考Constants.StandardState
//  startTime: Date,                                // 大纲启用日期
//  endTime: Date                                   // 大纲停用日期
// });

const TrainStandard = Parse.Object.extend("TrainStandard", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {
      this.set('state', StandardState.Initial);
  }
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new TrainStandard();
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

module.exports = TrainStandard;
