import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';
import Organization from '../resource/Organization';

// 客户反馈表
// const CustomerAdviceSchema = new Schema({
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },                     // 关联单位
//  title: String,                                                                          // 建议标题
//  content: String,                                                                        // 详细内容

//  advisorName: String,                                                                    // 联系人
//  phone: String,                                                                          // 联系电话
//  photos: [String],

//  state: Number                                                                           // 处理结果

// }, { timestamps: {} });

const CustomerAdvice = Parse.Object.extend("CustomerAdvice", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new CustomerAdvice();
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
        }
    });

module.exports = CustomerAdvice;
