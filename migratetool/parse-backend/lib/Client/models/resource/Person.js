import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName } from '../../../Constants';

// 人员信息表
// const PersonSchema = new Schema({
//  // 基本信息
// 	name: { type: String, required: true },                                                 // 人员姓名(必填)
// 	cardId: { type: String, unique: true, required: true },                                 // 保障卡号或身份证号(必填)
//  gender: String,                                                                         // 性别(必填)
//  birthday: Date,                                                                         // 出生日期(必填)
//  politicalStatus: String,                                                                // 政治面貌(党员/团员/群众)(必填)
//  height: Number,                                                                         // 当前身高(厘米)(必填)
//  weight: Number,                                                                         // 当前体重(公斤)(必填)
//  headImage: String,                                                                      // 头像图片HTTP路径(选填)(先上传到图片服务器，然后记录图片路径)

//  // 以下是可选基本资料
//  phoneNum: String,                                                                       // 联系电话
//  bloodType: String,                                                                      // 血型
//  nationality: String,                                                                    // 国籍，默认中国
//  fromCity: String,                                                                       // 籍贯
//  currentCity: String,                                                                    // 户口所在地
//  highestDegree: String,                                                                  // 最高学历
//  graduatedSchool: String,                                                                // 毕业院校
//  graduatedMajor: String,                                                                 // 毕业专业
//  graduatedAt: String,                                                                    // 毕业日期
// }, { timestamps: {} });

const Person = Parse.Object.extend("Person", {
  // Instance properties go in an initialize method
  initialize: function (attrs, options) {
    // this.set('gender', '男');
    // this.set('inservice', true);
    // this.set('isSpecialForce', false);
    // this.set('isCommander', false);
    // this.set('isMaster', false);
  }
}, {
    // Class methods
    fromObject: function (obj) {
      var item = new Person();
      parseUtils.object2ParseObject(obj, item);

      if (!obj.objectId) {
        var acl = new Parse.ACL();
        //   acl.setPublicReadAccess(true);
        acl.setRoleReadAccess(RoleName.Reader, true);
        acl.setRoleReadAccess(RoleName.Operator, true);
        acl.setRoleWriteAccess(RoleName.Operator, true);

        item.setACL(acl);
      }
      return item;
    },
    // queryCondition: function (query) {
    //   query.equalTo('inservice', true);
    // },
  });

module.exports = Person;
