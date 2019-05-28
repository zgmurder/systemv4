import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';

// 单位训练质量指标要求
// const OrgScoreRequirementSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  orgCategory: String,                            // 单位分类
//  scoreReq: Number,                              // 最低成绩要求
// });

const OrgScoreRequirement = Parse.Object.extend("OrgScoreRequirement", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) { }
}, {
    // Class methods
    fromObject: function (obj) {
      var item = new OrgScoreRequirement();
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

module.exports = OrgScoreRequirement;