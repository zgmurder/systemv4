import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Course from '../../standard/Course';

// 单位单课目成绩，记录班组训练、课题或战术训练等课目的单位成绩

// const OrgScoreSchema = new Schema({
//  assessEvent: { type: Schema.Types.ObjectId, ref: 'AssessEvent' },       // 考核事件
//  assessAt: { type: Date, required: true },                               // 考核日期(时分秒都为0)
//  course: { type: Schema.Types.ObjectId, ref: 'Course' },                 // 考核课目
//  courseName: String,                                                     // 课目名称（自动设置，检索用）
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//  assessMethod: String,                                                   // 考核方式(普考) (参考AssessMethod)
//  score: Number,                                                          // 课目成绩
// });

const OrgScore = Parse.Object.extend("OrgScore", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {

    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new OrgScore();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
        }
        if (obj.course) {
            let parseCourse = Course.fromObject(parseUtils.fixObject(obj.course));
            item.set('course', parseCourse);
            item.set('courseName', parseCourse.get('name'));
        }

        if (!obj.objectId) {
            parseUtils.setACL(item, obj, {
                readRoles: [RoleName.Operator, RoleName.Reader],
                writeRoles: [RoleName.Operator, RoleName.Network]
            });
        }

        return item;
    },
    getIncludes: function() {
        return ['organization', 'course'];
    }
});

module.exports = OrgScore;
