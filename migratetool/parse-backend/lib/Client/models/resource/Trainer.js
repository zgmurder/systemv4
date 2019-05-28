import Parse from '../../parse';
import parseUtils from '../../../utils/parseUtils';
import { RoleName, InServiceStatus } from '../../../Constants';
import Soldier from './Soldier';
import Organization from './Organization';
import Course from '../standard/Course';

// 教练员表
// const TrainerSchema = new Schema({
//  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },                     // 关联单位 查
// 	name: { type: String, required: true },                                                 // 人员姓名(必填)
// 	cardId: { type: String, unique: true, required: true },                                 // 保障卡号或身份证号(必填)
//  soldier: { type: Schema.Types.ObjectId, ref: 'Soldier' },                               // 关联人员
//  level: String,                                                                          // 教练员等级
//  startedAt: Date,                                                                        // 提升为教练员的日期
//  inserviceStatus: Number,                                                                // 服役状态，(默认0) 0: 服役中 1: 已退役 2: 已调离
//  availableCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],                    // 主教课目列表
//  availableAssistCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],              // 备教课目列表
// }, { timestamps: {} });

const Trainer = Parse.Object.extend("Trainer", {
    // Instance properties go in an initialize method
    initialize: function (attrs, options) {
        this.set('inserviceStatus', InServiceStatus.InService);
    }
}, {
        // Class methods
        fromObject: function (obj) {
            var item = new Trainer();
            parseUtils.object2ParseObject(obj, item);

            if (obj.soldier) {
                let parseSoldier = Soldier.fromObject(parseUtils.fixObject(obj.soldier));
                item.set('soldier', parseSoldier);
                item.set('position', parseSoldier.get('position'));
                item.set('positionCode', parseSoldier.get('positionCode'));
                item.set('rankCode', parseSoldier.get('rankCode'));
                item.set('enlistedAt', parseSoldier.get('enlistedAt'));
            }
            if (obj.organization) {
                let parseOrganization = Organization.fromObject(parseUtils.fixObject(obj.organization));
                item.set('organization', parseOrganization);
                item.set('orgCode', parseOrganization.get('orgCode'));
            }
            if (obj.availableCourses) {
                let parseAvailableCourses = parseUtils.fixObjectArray(Course, obj.availableCourses);
                item.set('availableCourses', parseAvailableCourses);
            }
            if (obj.availableCourses) {
                let parseAvailableAssistCourses = parseUtils.fixObjectArray(Course, obj.availableAssistCourses);
                item.set('availableAssistCourses', parseAvailableAssistCourses);
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
            return ['soldier', 'organization', 'availableCourses', 'availableAssistCourses'];
        },
        simplify: function(obj) {
            if (obj.organization) {
                obj.organization = {
                    objectId: obj.organization.objectId,
                    name: obj.organization.name,
                    shortName: obj.organization.shortName,
                    displayName:obj.organization.displayName,
                };
            }
            if (obj.availableCourses) {
                obj.availableCourses = obj.availableCourses.map(item => ({
                    objectId: item.objectId,
                    name: item.name,
                    seq:item.seq
                }))
            }
            if (obj.availableAssistCourses) {
                obj.availableAssistCourses = obj.availableAssistCourses.map(item => ({
                    objectId: item.objectId,
                    name: item.name,
                    seq:item.seq
                }))
            }

            return obj;
          }
    });

module.exports = Trainer;
