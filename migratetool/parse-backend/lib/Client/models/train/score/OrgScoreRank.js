import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';
import Assessment from './Assessment';

// 个人抽考/训练成绩排名

// const OrgScoreRankSchema = new Schema({
//  assessment: { type: Schema.Types.ObjectId, ref: 'Assessment' },         // 关联考核事件
//  date: Date,                                                             // 登记日期
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//  organizer: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 组织单位
//
//  requiredScoreCriteria: String,                                          // 通用训练课目评分标准
//  totalScore: Number,                                                     // 通用训练课目百分制得分总分
//  rank: Number,                                                           // 排名
// });

const OrgScoreRank = Parse.Object.extend("OrgScoreRank", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new OrgScoreRank();
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
        if (obj.assessment) {
            let parseAssessment = Assessment.fromObject(parseUtils.fixObject(obj.assessment));
            item.set('assessment', parseAssessment);
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
        return ['assessment', 'organization', 'organizer','soldier'];
    }
});

module.exports = OrgScoreRank;
