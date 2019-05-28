import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 天气类型
// const WeatherTypeSchema = new Schema({
// 	name: { type: String, unique: true, required: true },
// });

const WeatherType = Parse.Object.extend("WeatherType", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new WeatherType();
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

module.exports = WeatherType;