import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
//import TrainStandard from './TrainStandard';

// 每日作息时间
// const DailyScheduleSchema = new Schema({
//  orgCategory: String,                            // 单位分类
//  eMorning: Number,                              // 早操课时数
//  morning: Number,                                // 上午课时数
//  afternoon: Number,                              // 下午课时数(包含体能训练时间)
//  night: Number,                                  // 夜训课时数
//  sport: Number                                   // 下午体能训练课时数
// });

const DailySchedule = Parse.Object.extend("DailySchedule", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new DailySchedule();
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

module.exports = DailySchedule;