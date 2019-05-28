import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import Organization from './Organization';

// 武器库存表
// const WeaponStockSchema = new Schema({
// 	name: { type: String, required: true },                                                 // 武器名称(必填) (从OrdnanceType表中删选武器类型作为可选项，选择填入)
//  unitName: String,                                                                       // 计量单位(必填)
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },                     // 关联单位(必填)
//  total: Number,                                                                          // 武器库存数量(必填)
// }, { timestamps: {} });

const WeaponStock = Parse.Object.extend("WeaponStock", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new WeaponStock();
            parseUtils.object2ParseObject(obj, item);

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
            return ['organization'];
        },
        simplify: function(obj) {
            if (obj.organization) {
                obj.organization = {
                    objectId: obj.organization.objectId,
                    name: obj.organization.name,
                    shortName: obj.organization.shortName,
                    displayName: obj.organization.displayName
                };
            }

            return obj;
          }
    });

module.exports = WeaponStock;
