import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName, PlaceBuiltStatus } from '../../../Constants';
import Organization from './Organization';

// 教练员表
// const TrainPlaceSchema = new Schema({
// 	name: { type: String, required: true },                                                 // 场地名称(必填)!
//  placeTypes: [String],                                                                   // 场地类型!
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },                     // 关联单位!
//  indoor: Boolean,                                                                        // 是否为室内场地!
//  internal: Boolean,                                                                      // 是否为自建场地!
//  builtStatus: Number,                                                                    // 建设状态, 0:已建、1:在建、2:未建 (依赖internal)
//  startAt: Date,                                                                          // 开建日期(选填) (依赖internal)
//  builtAt: Date,                                                                          // 建成日期(选填) (依赖internal)
//  weathers: [String],                                                                     // 适用天气(选填)
//  area: String,                                                                           // 场地规格
//  capacity: Number,                                                                       // 人员容量(选填)
//  address: String,                                                                        // 场地地址(选填)
//  photos: [String],                                                                       // 场地图片路径(可上传)
// }, { timestamps: {} });

const TrainPlace = Parse.Object.extend("TrainPlace", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('indoor', false);
        this.set('builtStatus', PlaceBuiltStatus.Built);
    }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new TrainPlace();
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

module.exports = TrainPlace;
