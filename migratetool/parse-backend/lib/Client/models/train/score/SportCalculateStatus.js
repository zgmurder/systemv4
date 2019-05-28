import Parse from '../../../parse';
import parseUtils from '../../../../utils/parseUtils';
import { RoleName, SubmitState } from '../../../../Constants';
import Organization from '../../resource/Organization';

// 单课目体育成绩登记表

// const SportEventSchema = new Schema({

//  organizer: { type: Schema.Types.ObjectId, ref: 'Organization' },        // 组织单位
//  assessMethod: String,                                                   // 考核方式(普考或抽考) (参考AssessMethod)
//  solvedNum: Number,                                                      // 已处理人数
//  soldiersTotalNum: Number,                                               // 总士兵人数

// });

const SportCalculateStatus = Parse.Object.extend("SportCalculateStatus", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new SportCalculateStatus();

        parseUtils.object2ParseObject(obj, item);
        if (obj.organizer) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organizer));
            item.set('organizer', parseOrganization);
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
        return [ 'organizer'];
    }
});

module.exports = SportCalculateStatus;
