import Client from '../Client';
import { ResultCode, RoleId, StandardState, OrgSequence, OrgType, RoleName, InServiceStatus, PersonProperty, SpecialForce } from '../Constants';
import parseUtils from '../utils/parseUtils';
import versionUtils from '../utils/versionUtils';
import _ from 'lodash';

export class SoldierService {
    constructor(backend) {
        this.backendService = backend;
    }

    async deleteSoldier(soldierId,personId, solider){
        try{
            let result = await Client.Cloud.run('deleteSoldier', {soldierId: soldierId,personId: personId, solider}, this.backendService.options);
            console.log(result);
            // return result;
        }catch (exception) {
            console.log(`deleteSoldier failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 添加或修改军人信息
    async addOrUpdateSoldier(soldierObj) {
        try {
            if (_.isString(soldierObj.organization)) soldierObj.organization = await this.backendService.fetchItem('Organization', soldierObj.organization);
            soldierObj = versionUtils.formatSoldier(soldierObj);

            let result = await Client.Cloud.run('addOrUpdateSoldier', {soldierObj}, this.backendService.options);
            if (result.organization && result.organization.id) {
                result.organization = parseUtils.simplifyObject(result.organization.toJSON());
            }
            console.log(result);
            return result;
        } catch (exception) {
            console.log(`addOrUpdateSoldier failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 人员退役接口
    async retireSoldier(soldierId) {
        try {
            let result = await Client.Cloud.run('retireSoldier', {soldierId: soldierId}, this.backendService.options);
            console.log(result);
            return result;
        } catch (exception) {
            console.log(`retireSoldier failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 人员退役接口
    async tmpRemoveSoldier(soldierId) {
        try {
            let result = await Client.Cloud.run('tmpRemoveSoldier', {soldierId: soldierId}, this.backendService.options);
            console.log(result);
            return result;
        } catch (exception) {
            console.log(`retireSoldier failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 人员恢复接口
    async restoreSoldier(soldierId) {
        try {
            let result = await Client.Cloud.run('restoreSoldier', {soldierId: soldierId}, this.backendService.options);
            console.log(result);
            return result;
        } catch (exception) {
            console.log(`restoreSoldier failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 人员调离接口
    async transferSoldier(soldierId, targetOrgId, targetPosition) {
        try {
            let result = await Client.Cloud.run('transferSoldier',
                {soldierId: soldierId, targetOrgId: targetOrgId, targetPosition: targetPosition},
                this.backendService.options);
            // console.log(result);
            return result;
        } catch (exception) {
            console.log(`transferSoldier failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }

    }

    // 查询某个单位本级及所有下级单位的完整军人信息列表，支持过滤和翻页
    async querySoldierList({soldierQuery, personQuery, orgId}) {
        try {
            if (!soldierQuery) {
                soldierQuery = new Client.Query(Client.Soldier);
            }
            // soldierQuery.equalTo('inserviceStatus', InServiceStatus.InService);

            // 查询人员基础信息表中的字段
            if (personQuery) {
                soldierQuery.matchesQuery('person', personQuery);
            }

            // 查询该单位下的所有人员，包括下级单位
            if (orgId) {
                let queryOrg = new Client.Query(Client.Organization);
                queryOrg.equalTo('parentIds', orgId);
                soldierQuery.matchesQuery('organization', queryOrg);
            }
            soldierQuery.addAscending('orgCode').addAscending('positionCode')
                        .addDescending('rankCode').addAscending('enlistedAt');

            let result = await this.backendService.queryList('Soldier', soldierQuery);

            return result;
        } catch (exception) {
            console.log(`querySoldierList failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取本级管理单位下的所有军人信息列表
    async getAllLocalSoldiers(organization) {
        try {
            if (_.isEmpty(organization)) {
                organization = this.backendService.getCurrentOrganization();
            }

            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) return [];

            console.log('getAllLocalSoldiers', organization);

            let soldierQuery = new Client.Query(Client.Soldier);
            let queryOrg = new Client.Query(Client.Organization);
            queryOrg.equalTo('parentIds', organization.objectId);
            if (organization.orgSequence < OrgSequence.Company) {
                queryOrg.equalTo('orgSequence', organization.orgSequence);
            }

            soldierQuery.matchesQuery('organization', queryOrg);
            soldierQuery.equalTo('inserviceStatus', InServiceStatus.InService);
            soldierQuery.addDescending('rankCode').addAscending(['positionCode', 'enlistedAt']);

            let result = await this.backendService.queryListAll('Soldier', soldierQuery);

            console.log('getAllLocalSoldiers', result.list);

            return result.list;
        } catch (exception) {
            console.log(`getAllLocalSoldiers failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    //
    async getAllLocalMasters(organization) {
        try {
            const soldiers = await this.getAllLocalSoldiers(organization);

            return soldiers.filter(item => item.isMaster || item.isCommander || item.position.includes('长'));
        } catch (exception) {
            console.log(`getAllLocalMasters failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
}

export default SoldierService;
