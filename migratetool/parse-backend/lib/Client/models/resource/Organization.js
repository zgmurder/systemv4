import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import {RoleName} from '../../../Constants';
import _ from 'lodash';

// 组织单位表
// const OrganizationSchema = new Schema({
// 	name: { type: String, unique: true, required: true },                                   // 单位名称(短名称，比如一排)
// 	displayName: String,                                                                        // 单位标准名称，比如XX支队XX中队一排
//  nodeCode: Number,                                                                       // 同级单位排序编码
//  orgCode: String,                                                                        // 完整的单位排序编码(16位字符串)
//  parentIds: [String],                                                                    // 上级单位ID列表(包括本级)
// 	parentId: String,                                                                       // 直属上级单位ID
//  divisionId: String,                                                                     // 所属总队单位ID
//  childrenIds: [String],                                                                  // 直属子单位ID列表
//  orgSequence: Number,                                                                    // 编制序列
//  orgType: String,                                                                        // 单位类型, 区分：部队\首长机关\分队\部门
//  orgCategory: String,                                                                    // 单位分类
//  orgProperty: String,                                                                    // 单位性质
//  orgMajor: String,                                                                       // 单位专业类型
//  serviceType: String,                                                                    // 执勤分队的勤务类型
// 	important: { type: Boolean, default: false },                                           // 重要方向任务部队
//  specialMission: String,                                                                 // 重要方向任务部队类型, 从SpecialMission表中获取
//  formalized: { type: Boolean, default: false },                                          // 正式使用阶段，中队无法在首页设置课目状态
//  scheduleUnit: { type: Boolean, default: false },                                        // 独立制表标志, 通过该标志可以实现大队\中队等的排表逻辑
//  planSoldierCount: {type: Number, default: 0 },                                          // 单位编制人员数量
//  height: Number,                                                                         // 海拔高度
// 	address: String,
// 	gis: {
// 		longitude: Number,
// 		latitude: Number,
// 		altitude: Number
// 	},
// 	sentryCount: {type: Number, default: 0 },                                               // 哨位数量
// 	deleted: { type: Boolean, default: false },                                             // 删除标志
// 	deletedAt: Date,

// 新增字段
//  orgMajors: [String],                                                                    // 单位专业类型

// }, { timestamps: {} });

const Organization = Parse.Object.extend("Organization", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('nodeCode', 0);
        this.set('orgCode', '0');
        this.set('scheduleUnit', false);
        this.set('formalized', false);
        this.set('deleted', false);
        this.set('important', false);
        this.set('planSoldierCount', 0);
        this.set('sentryCount', 0);
        this.set('height', 0);
        this.set('gis', {
            altitude: 0,
            latitude: 0,
            longitude: 0
        });
    }
}, {
    // Class methods
    fromObject: function (obj) {
        var item = new Organization();
        parseUtils.object2ParseObject(obj, item);

        if (!obj.objectId) {
            var acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            acl.setRoleReadAccess(RoleName.Reader, true);
            acl.setRoleWriteAccess(RoleName.Network, true);
            acl.setRoleWriteAccess(RoleName.Operator, true);

            item.setACL(acl);
        }
        return item;
    },
    queryCondition: function (query) {
        query.equalTo('deleted', false);
    },
    simplify: function (obj) {
        obj.ACL = undefined;

        return obj;
    }
});

module.exports = Organization;
