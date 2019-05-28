
import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import TrainStandard from './TrainStandard';
import { RoleName, StandardState } from '../../../Constants';

// 训练阶段时长
// const TrainStageTimeSchema = Schema({
// 	standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  orgCategories: [String],                        // 课目适用的单位分类列表,一般是一个
// 	majorReq: [String],                             // 专业类型要求
//  stageTime: [{task:'', time:0}]],
// });

const TrainStageTime = Parse.Object.extend("TrainStageTime", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
  }, {
    // Class methods
    fromObject: function(obj) {
      var item = new TrainStageTime();

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
        obj.section && (obj.section = {
                objectId: obj.section.objectId,
                name: obj.section.name
        });

        return obj;
    }
  });
  
  module.exports = TrainStageTime;