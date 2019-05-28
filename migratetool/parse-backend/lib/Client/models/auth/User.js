import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleId, RoleName } from '../../../Constants';
import Organization from '../resource/Organization';
import Soldier from '../resource/Soldier';

// const UserSchema = new Schema({
//     username: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     role: Number,
//     buildin: Boolean,
//     organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
//     description: String,
//     deactivated: Boolean,                                                // 是否失效
//     deactivatedAt: Date,                                                 // 失效日期
//     soldier: { type: Schema.Types.ObjectId, ref: 'Soldier' },            // 关联Soldier (选填)
//     systems: [String]                                                    // 授权访问的系统名称；目前仅显示为：军事训练管理系统
// }, { timestamps: {} });

class User extends Parse.User {
  constructor() {
    // Pass the ClassName to the Parse.Object constructor
    super();
    // All other initialization
    this.set('role', RoleId.Operator);
    this.set('buildin', false);
    this.set('deactivated', false);
  }

  static fromObject(obj) {
    var item = new User();
    parseUtils.object2ParseObject(obj, item);
    if (obj.organization) {
      let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
      item.set('organization', parseOrganization);
      item.set('orgCode', parseOrganization.get('orgCode'));
    }
    if (obj.soldier) {
      let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.soldier));
      item.set('soldier', parseSoldier);
    }

    if (!obj.objectId) {
      parseUtils.setACL(item, obj, {
        readRoles: [RoleName.Reader],
        writeRoles: [RoleName.Manager]
      });
    }
    return item;
  }

  static getIncludes() {
    return ['organization', 'soldier'];
  }
}

module.exports = User;