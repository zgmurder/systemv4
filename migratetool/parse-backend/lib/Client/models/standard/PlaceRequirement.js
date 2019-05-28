import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from './TrainStandard';

// 人员指标要求
// const PlaceRequirementSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  orgCategory: String,                            // 单位分类
//  requiredPlaces: [String],                       // 必需场地类型
//  optionalPlaces: [String]                        // 可选场地类型
// });

const PlaceRequirement = Parse.Object.extend("PlaceRequirement", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) { }
}, {
    // Class methods
    fromObject: function (obj) {
      var item = new PlaceRequirement();
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

module.exports = PlaceRequirement;