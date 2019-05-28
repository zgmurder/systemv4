import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName, PlaceBuiltStatus } from '../../../Constants';
import Organization from './Organization';
import TrainPlace from './TrainPlace';

// 场地关联的视频通道地址
// const VideoChannelSchema = new Schema({
//  place: { type: Schema.Types.ObjectId, ref: 'TrainPlace' },                            // 关联场地
// 	name: { type: String, required: true },                                                 // 视频通道名称
//  mtsServerIP: String,                                                                    // MTS服务器地址
//  cameraIP: String,                                                                       // 摄像机地址
//  channel: Number,                                                                        // 视频通道号
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },                     // 关联单位!
//  orgCode: String,
// }, { timestamps: {} });

const VideoChannel = Parse.Object.extend("VideoChannel", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
    }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new VideoChannel();
            parseUtils.object2ParseObject(obj, item);

            if (obj.organization) {
                let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
                item.set('organization', parseOrganization);
                item.set('orgCode', parseOrganization.get('orgCode'));
            }
            if (obj.place) {
                let parsePlace = TrainPlace.fromObject(parseUtils.fixObject(obj.place));
                item.set('place', parsePlace);
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
            return ['organization', 'place'];
        },
        simplify: function(obj) {
            if (obj.organization) {
                obj.organization = {
                    objectId: obj.organization.objectId,
                    name: obj.organization.name,
                    shortName: obj.organization.shortName,
                    displayName: obj.organization.displayName,
                    orgCode: obj.organization.orgCode
                };
            }

            return obj;
          }
    });

module.exports = VideoChannel;
