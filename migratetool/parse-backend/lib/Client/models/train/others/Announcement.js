import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 节假日
// const AnnouncementSchema = new Schema({
//  title: String,          // 公示标题
//  type: String,           // 公示类型
//  startDate: Date,        // 开始时间
//  endDate: Date,          // 结束时间
//
//  contentTxt: String,           // 公示文本内容(多行文本)
//
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 发布单位
//  orgCode: String,
//
//  state: Number           // 发布状态，见SubmitState
// });

const Announcement = Parse.Object.extend("Announcement", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {}
}, {
    // Class methods
    fromObject: function(obj) {
        let item = new Announcement();
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
    },
    getIncludes: function() {
        return ['organization'];
    }
});

module.exports = Announcement;
