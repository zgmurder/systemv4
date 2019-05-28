import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName, InServiceStatus } from '../../../Constants';
import Person from './Person';

// 人员生物识别信息表
// const PersonBiometricSchema = new Schema({
//  person: { type: Schema.Types.ObjectId, ref: 'Person' },                                 // 关联人员
//  fingerDatas: [File],                                                                    // 指纹数据文件列表
//  faceDatas: [File],                                                                      // 人脸数据文件列表
// }, { timestamps: {} });

const PersonBiometric = Parse.Object.extend("PersonBiometric", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new PersonBiometric();
            parseUtils.object2ParseObject(obj, item);

            if (obj.person) {
                let parsePerson = Person.fromObject(parseUtils.fixObject(obj.person));
                item.set('person', parsePerson);
            }

            // 设置人员单位关联信息ACL权限
            if (!obj.objectId) {
                parseUtils.setACL(item, obj, {
                    readRoles: [RoleName.Reader, RoleName.Operator],
                    writeRoles: [RoleName.Operator]
                });
            }
            return item;
        },
        getIncludes: function () {
            return ['person'];
        },
        simplify: function (obj) {
            if (obj.person) {
                obj.person = {
                    objectId: obj.person.objectId,
                    name: obj.person.name
                };
            }


            return obj;
        }
    });

module.exports = PersonBiometric;