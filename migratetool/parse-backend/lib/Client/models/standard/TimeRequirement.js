import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';

// 时间指标要求
// const TimeRequirementSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  orgCategory: String,                            // 单位分类
//  personProperty: String,                         // 人员属性分类
//  timeReq: {
//      months: Number,                             // 年度训练月数
//      days: Number,                               // 年度训练天数
//      hours: Number,                              // 年度训练小时数
//      daysPerMonth: Number,                       // 月度训练天数
//      daysPerWeek: Number,                        // 每周训练天数
//      hoursPerDay: Number,                        // 每天训练小时数
//      hoursAtNight: Number,                       // 年度夜训小时数
//      rateAtNight: Number,                        // 年度夜巡比率
//      flexibleDays: Number                        // 机动天数
//  }
// });

const TimeRequirement = Parse.Object.extend("TimeRequirement", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) { }
}, {
    // Class methods
    fromObject: function (obj) {
      var item = new TimeRequirement();
      parseUtils.object2ParseObject(obj, item);
      if (obj.standard) {
        let parseStandard = TrainStandard.fromObject(parseUtils.fixObject(obj.standard));
        item.set('standard', parseStandard);
      }

      if (!obj.objectId) {
        var acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setRoleWriteAccess(RoleName.Administrator, true);
        item.setACL(acl);
      }
      return item;
    },
    getIncludes: function () {
      return ['standard'];
    },
    simplify: function (obj) {
      obj.standard && (obj.standard = {
        objectId: obj.standard.objectId,
        name: obj.standard.name
      });

      return obj;
    }
  });

module.exports = TimeRequirement;