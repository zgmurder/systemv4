import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 单课目军事训练成绩登记表

// const AssessmentSchema = new Schema({
//  name: String,
//  assessMethod: String,                                                   // 考核方式(普考或抽考或训练) (参考AssessMethod)
//  date: { type: Date, required: true },                                   // 日期(时分秒都为0)
//  year: Number,
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承

//  // 以下信息只在抽考时有效
//  orgLevel: String,                                                       // 考核单位对象级别，选项见 OrgLevels
//  assessTargets: [{                                                       // 考核对象：单位+人员
//      orgId: String,
//      soldierIds: [String],
//      soldierCardIds: [String]
//  }],
//  courses: [String],                                                      // 课目ID列表
//  hasShape: Boolean,                                                      // 是否包含体型
// });

const Assessment = Parse.Object.extend("Assessment", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        let item = new Assessment();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
        }

        if (!obj.objectId) {
            let acl = new Parse.ACL();
            acl.setRoleReadAccess(RoleName.Operator, true);
            acl.setRoleReadAccess(RoleName.Reader, true);
            acl.setRoleWriteAccess(RoleName.Operator, true);
            item.setACL(acl);
        }

        return item;
    },
    getIncludes: function() {
        return ['organization'];
    }
});

module.exports = Assessment;
