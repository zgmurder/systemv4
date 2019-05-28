import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 训练步骤
// const TrainStepSchema = new Schema({
// 	name: { type: String, unique: true, required: true },
//  orgType: String,        // 单位类型 分队或首长机关
//  trainUnits: [String],   // 训练单元：见编制序列
//  priority: Number        // 优先级
// });

const TrainStep = Parse.Object.extend("TrainStep", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new TrainStep();
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

module.exports = TrainStep;