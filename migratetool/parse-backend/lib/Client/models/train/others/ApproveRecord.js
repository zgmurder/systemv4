import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Soldier from '../../resource/Soldier';

// 节假日
// const ApproveRecordSchema = new Schema({
//  className: String,  // 被审核表单名称
//  targetId: String,   // 被审核表单objectId
//  state: Number,      // 审核状态
//  operatedAt: Date,   // 操作时间
//  operatedBy: String, // 用户名称
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' }, // 单位信息 
//  approvedBy: { type: Schema.Types.ObjectId, ref: 'Soldier' },			// 大队长或参谋长
// });

const ApproveRecord = Parse.Object.extend("ApproveRecord", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new ApproveRecord();
    parseUtils.object2ParseObject(obj, item);
    if (obj.organization) {
        let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
        item.set('organization', parseOrganization);
        item.set('orgCode', parseOrganization.get('orgCode'));
    }
    if (obj.approvedBy) {
      let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.approvedBy));
      item.set('approvedBy', parseSoldier);
    }

    if (!obj.objectId) {
    	var acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setRoleWriteAccess(RoleName.Operator, true);
        item.setACL(acl);
    }
    return item;
  }
});

module.exports = ApproveRecord;