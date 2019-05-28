import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';

// 个人训练质量指标要求
// const PersonScoreRequirementSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  personProperty: String,                            // 人员属性
//  ranks: [String],                              // 军衔等级列表
//  yearRange: {                                    // 任职年限范围
//      start: Number,                              // 比如0-2年, 2年以上等
//      end: Number,
//  },
//  scoreReq: Number,                               // 成绩要求
// });

const PersonScoreRequirement = Parse.Object.extend("PersonScoreRequirement", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) { }
}, {
    // Class methods
    fromObject: function (obj) {
      var item = new PersonScoreRequirement();
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

module.exports = PersonScoreRequirement;
