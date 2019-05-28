import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import TrainStandard from '../standard/TrainStandard';

// 单位体育成绩评定标准
// const OrgSportScoreStandardSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  isNewRecruit: Boolean,                           // 是否是新兵单位
//  scoreCriteria: String,                           // 成绩评定标准(多级制类型)
//  score: Number,                                   // 评定成绩
//  conditions: [{                                   // 成绩评定条件(对象为个人单课目成绩), 数组中的每个条件之间是并且的关系
//      scoreCriteria: String,                       // 成绩评定标准(多级制类型)
//      scoreReq: Number,                            // 成绩要求
//      matchRate: Number,                           // 符合成绩要求的百分比
//  }],
//  masterScore: Number,                             // 军政主官成绩要求
// });

const OrgSportScoreStandard = Parse.Object.extend("OrgSportScoreStandard", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {
    this.set('isNewRecruit', false);
  }
}, {
    // Class methods
    fromObject: function (obj) {
      var item = new OrgSportScoreStandard();
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
    simplify: function (obj) {
      obj.standard && (obj.standard = {
        objectId: obj.standard.objectId,
        name: obj.standard.name
      });

      return obj;
    }
  });

module.exports = OrgSportScoreStandard;