import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 评分标准
// const ScoreCriteriaSchema = new Schema({
// 	name: { type: String, unique: true, required: true },
//  scoreType: String,          // 评分类型: 多级制/分数制
//  levels: [{
//    name: String,             // 每一级成绩名称
//    level: Number             // 每一级成绩评分 可取范围(0-10)
//  }],               // 评分等级
//  maxScore: Number            // 最高分
// });

const ScoreCriteria = Parse.Object.extend("ScoreCriteria", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new ScoreCriteria();
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

module.exports = ScoreCriteria;