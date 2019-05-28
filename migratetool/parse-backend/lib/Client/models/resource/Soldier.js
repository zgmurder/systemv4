import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import {RoleName, InServiceStatus, TroopCategory} from '../../../Constants';
import Person from './Person';
import Organization from './Organization';

// 人员单位关联表
// const SoldierSchema = new Schema({
// 	name: { type: String, required: true },                                                 // 人员姓名(必填)
// 	cardId: { type: String, unique: true, required: true },                                 // 保障卡号或身份证号(必填)
//  person: { type: Schema.Types.ObjectId, ref: 'Person' },                                 // 关联人员
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },                     // 关联单位
//  joinedAt: Date,	                                                                        // 加入单位日期，添加时自动设置
//  leftAt: Date,	                                                                        // 离开单位日期，退伍或调离时自动填入 (无需用户输入)

//  // 以下是军人基本资料
//  inserviceStatus: Number,                                                                // 服役状态，(默认0) 0: 服役中 1: 已退役 2: 已调离
//  enlistedAt:	Date,	                                                                    // 入伍日期(必填)	
//  dischargedAt: Date,	                                                                    // 退伍日期，退伍时自动填入 (无需用户输入)
//  personProperty: String,                                                                 // 人员属性(必填), 区分分队\警官\保障人员\正式队员\预备队员\新兵
//  isSpecialForce: { type: Boolean, default: false },                                      // 是否为特战队员，personProperty为正式队员和预备队员为true，其它为false (自动生成)
//  specialForce: String,                                                                   // 作战队员或者预备队员，对特战分队有效。（自动生成）
//  position: String,                                                                       // 职务（必填）
//  positionCode: Number,                                                                   // 职务编码,排序用。从职务中自动获取填入
//  positionAt: Date,                                                                       // 当前职务上任日期，职务变化时该字段自动更新为当前日期。可手动修改
//  isCommander: { type: Boolean, default: false },                                         // 是否为指挥员，选定职务后自动填入（界面不体现）
//  isMaster: { type: Boolean, default: false },                                            // 是否为军政主官，选定职务后自动填入（界面不体现）
//  rank: String,                                                                           // 军衔等级(必填)，可选项从军衔等级表获取
//  rankL1: String,                                                                         // 军衔一级分类, 选定rank自动生成
//  rankL2: String,                                                                         // 军衔二级分类, 选定rank自动生成
//  rankCode: Number,                                                                       // 军衔等级码, 选定rank自动生成
//  gunnerType: String,                                                                     // 枪手类型
//  majorType: String,                                                                      // 专业类型(必填)，可选项根据单位分类获取可选专业
//  physicalLevel: String,                                                                  // 体能训练等级分类，区分一类人员/二类人员/三类人员/新兵，可选项从PhysicalLevel表获取
//  troopCategory: String,                                                                  // 军兵种(地面人员/空勤人员/船艇人员)
//  isCivilServant: Boolean,                                                                // 是否为文职人员

//  新增字段V4.0
//  soldierCategory: String,                                                                // 人员类别,见SoldierCategory
//  isSupporter: Boolean,                                                                   // 保障人员标志
// }, { timestamps: {} });

const Soldier = Parse.Object.extend("Soldier", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('joinedAt', new Date());
        this.set('inserviceStatus', InServiceStatus.InService);
        this.set('troopCategory', TroopCategory.LandForce);
        this.set('isCivilServant', false);
        this.set('positionCode', 0);
        this.set('isSupporter', false);
    }
}, {
    // Class methods
    fromObject: function (obj) {
        var item = new Soldier();
        parseUtils.object2ParseObject(obj, item);

        if (obj.person) {
            let parsePerson = Person.fromObject(parseUtils.fixObject(obj.person));
            item.set('person', parsePerson);
        }
        if (obj.organization) {
            let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
            item.set('organization', parseOrganization);
            item.set('orgCode', parseOrganization.get('orgCode'));
        }

        // 设置人员单位关联信息ACL权限
        if (!obj.objectId) {
            parseUtils.setACL(item, obj, {
                readRoles: [RoleName.Reader],
                writeRoles: [RoleName.Operator]
            });
        }
        return item;
    },
    getIncludes: function () {
        return ['person', 'organization'];
    }
});

module.exports = Soldier;
