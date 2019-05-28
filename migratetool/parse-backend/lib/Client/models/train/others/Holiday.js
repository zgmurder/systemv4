import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';

// 节假日
// const HolidaySchema = new Schema({
//  date: Date,         // Array(['2018/4/5', '2018/4/6', '2018/4/7'])
//  name: String,       // 节假日名称
//  type: String,       // '节假日', '工作日' 参考DayType定义
// });

const Holiday = Parse.Object.extend("Holiday", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new Holiday();
    parseUtils.object2ParseObject(obj, item);

    if (!obj.objectId) {
    	var acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setRoleWriteAccess(RoleName.Operator, true);
        item.setACL(acl);
    }
    return item;
  }
});

module.exports = Holiday;