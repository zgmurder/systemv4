import Parse from '../parse';
import parseUtils from '../../utils/parseUtils';
import { RoleName, SubmitState } from '../../Constants';
import Organization from '../models/resource/Organization';
import Trainer from '../models/resource/Trainer';
import Course from '../models/standard/Course';

// 单课目体育成绩登记表

// const SportEventSchema = new Schema({
//  date: { type: Date, required: true },                                   // 日期(时分秒都为0)
//  course: { type: Schema.Types.ObjectId, ref: 'Course' },                 // 考核课目
//  courseName: String,                                                     // 课目名称（自动设置，检索用）
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  organizer: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 组织单位
//  assessMethod: String,                                                   // 考核方式(普考或抽考) (参考AssessMethod)
//  state: Number,                                                          // 提交状态(0: 未提交; 1:已提交) 正式提交后才能被上级查看

//  scoreSriteria: String,                                                  // 课目成绩标准
//  testReq: String,                                                        // 考核要求：必考或选考
//  sportTestCategory: Number,                                              // 体育考核要求分类，见SportTestCategory
//  groupId: Number,                                                        // 专项课目组编号

//  createdBy: String,                                                      // 填写人
//  approvedBy: String,                                                     // 审核人
// });

const SportEvent = Parse.Object.extend("SportEvent", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new SportEvent();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
        }
        if (obj.organizer) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organizer));
            item.set('organizer', parseOrganization);
        }
        if (obj.course) {
            let parseCourse = Course.fromObject(parseUtils.fixObject(obj.course));
            item.set('course', parseCourse);
            item.set('courseName', parseCourse.get('name'));
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
        return ['organization', 'organizer', 'course'];
    }
});

module.exports = SportEvent;
