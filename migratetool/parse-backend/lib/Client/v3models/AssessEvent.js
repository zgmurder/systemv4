import Parse from '../parse';
import parseUtils from '../../utils/parseUtils';
import { RoleName, SubmitState } from '../../Constants';
import Organization from '../models/resource/Organization';
import Trainer from '../models/resource/Trainer';
import Course from '../models/standard/Course';

// 单课目军事训练成绩登记表

// const AssessEventSchema = new Schema({
//  date: { type: Date, required: true },                                   // 日期(时分秒都为0)
//  course: { type: Schema.Types.ObjectId, ref: 'Course' },                 // 考核课目
//  courseName: String,                                                     // 课目名称（自动设置，检索用）
//  testContent: String,                                                  // 考核内容（可人工填写，同一个课目可以登记多个考核内容）
//  trainer: { type: Schema.Types.ObjectId, ref: 'Trainer' },               // 课目教练员
//  trainerLevel: String,                                                   // 教练员等级(后台自动设置)
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承
//  organizer: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 组织单位
//  assessMethod: String,                                                   // 考核方式(普考或抽考) (参考AssessMethod)
//  isMakeup: Boolean,                                                      // 是否已经补考过(录入补考成绩后，表示已补考)
//  state: Number,                                                          // 提交状态(0: 未提交; 1:已提交) 正式提交后才能被上级查看
//  isAuto: Boolean,                                                        // 根据考核内容自动生成主课目的成绩，true时不可编辑

//     scoreSriteria: String,                                               // 课目成绩标准
//     score: String,                                                       // 评定成绩
//     total: Number,                                                       // 总人数
//     passCount: Number,                                                   // 及格（合格）人数
//     passRate: Number,                                                    // 及格（合格）率
//     unpassCount: Number,                                                 // 不及格（不合格）人数
//     unpassRate: Number,                                                  // 不及格（不合格）率
//     goodCount: Number,                                                   // 良好人数
//     goodRate: Number,                                                    // 良好率
//     excellentCount: Number,                                              // 优秀人数
//     excellentRate: Number                                                // 优秀率

//  createdBy: String,                                                      // 填写人
//  approvedBy: String,                                                     // 审核人
// });

const AssessEvent = Parse.Object.extend("AssessEvent", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('state', SubmitState.Initial);
        this.set('isMakeup', false);
        this.set('isAuto', false);
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new AssessEvent();
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
        if (obj.trainer) {
            let parseTrainer = Trainer.fromObject(parseUtils.fixObject(obj.trainer));
            item.set('trainer', parseTrainer);
            item.set('trainerLevel', parseTrainer.get('level'));
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
        return ['organization', 'organizer', 'course', 'trainer'];
    }
});

module.exports = AssessEvent;
