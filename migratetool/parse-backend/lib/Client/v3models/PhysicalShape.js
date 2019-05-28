import Parse from '../parse';
import parseUtils from '../../utils/parseUtils';
import { RoleName, SubmitState } from '../../Constants';
import Organization from '../models/resource/Organization';
import Soldier from '../models/resource/Soldier';

// 个人体型表
// const PhysicalShapeSchema = new Schema({
//  year: Number,                                                           // 年份
//  date: { type: Date, required: true },                                   // 考核日期(时分秒都为0)
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },     // 人员所属单位
//  orgCode: String,                                                        // 单位编码，自动从单位继承，排序用
//

//  soldier: { type: Schema.Types.ObjectId, ref: 'Soldier' },               // 人员
//  age: Number,                                                            // 年龄, 根据人员出生年月自动计算
//  gender: String,                                                         // 性别，自动从人员继承
//  cardId: String,                                                         // 保障卡号
//  position: String,                                                       // 职务，自动从人员继承
//  positionCode: Number,                                                   // 人员职务编码，自动从人员继承，排序用
//  isCommander: { type: Boolean, default: false },                         // 是否为指挥员，自动从人员继承（界面不体现）
//  isMaster: { type: Boolean, default: false },                            // 是否为军政主官，自动从人员继承（界面不体现）

//  height: Number,                                                         // 身高(cm)
//  weight: Number,                                                         // 体重(kg)
//  bmi: Number,                                                            // 体型
//  pbf: Number,                                                            // 体脂(%)

//  scoreCriteria: String,                                                  // 成绩标准
//  score: Number,                                                          // 考核得分(四机制或百分制)
// });

const PhysicalShape = Parse.Object.extend("PhysicalShape", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
    // Class methods
    fromObject: function(obj) {
        var item = new PhysicalShape();
        parseUtils.object2ParseObject(obj, item);
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
        }
        if (obj.soldier) {
            let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.soldier));
            item.set('soldier', parseSoldier);
            item.set('positionCode', parseSoldier.get('positionCode'));
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
        return ['organization', 'soldier'];
    }
});

module.exports = PhysicalShape;
