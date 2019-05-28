import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 节假日
// const OperateRecordSchema = new Schema({
//  className: String,  // 表单名称
//  targetId: String,   // 表单objectId
//  operateType: String,      // 操作类型
//  operatedAt: Date,   // 操作时间
//  operatedBy: String, // 用户名称
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' }, // 单位信息 
//  description: String
// });

const OperateRecord = Parse.Object.extend("OperateRecord", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {}
}, {
  // Class methods
  fromObject: function(obj) {
    var item = new OperateRecord();
    parseUtils.object2ParseObject(obj, item);
    if (obj.organization) {
        let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
        item.set('organization', parseOrganization);
        item.set('orgCode', parseOrganization.get('orgCode'));
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

module.exports = OperateRecord;