import Client from '../Client';
import { OrgSequence, OrgType, RoleName } from '../Constants';
import parseUtils from '../utils/parseUtils';
import versionUtils from '../utils/versionUtils';
import _ from 'lodash';

export class OrgService {
    constructor(backend) {
        this.backendService = backend;
    }

    async addOrUpdateOrganization({itemObj, parentObj}) {
        try {
            console.log(1111, parentObj)
            if (parentObj && parentObj.objectId) itemObj.parentId = parentObj.objectId;

            itemObj = versionUtils.formatOrganization(itemObj);

            let result = await Client.Cloud.run('addOrUpdateOrganization', {organization: itemObj}, this.backendService.options);

            return parseUtils.simplifyObject(result.organization);
        } catch (exception) {
            console.log(`addOrUpdateOrganization failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updateOrgCode(orgId, nodeCode) {
        try {
            // if (parentObj && parentObj.objectId) itemObj.parentId = parentObj.objectId;

            let result = await Client.Cloud.run('updateOrgCode', {objectId: orgId, nodeCode}, this.backendService.options);

            return parseUtils.simplifyObject(result.organization);
        } catch (exception) {
            console.log(`updateOrgCode failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async swapOrganizations(org1, org2) {
        try {
            let result = await Client.Cloud.run('swapOrganizations', {org1, org2}, this.backendService.options);

            return result;
        } catch (exception) {
            console.log(`swapOrganizations failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteOrganization(item) {
        try {
            let objectId = item.objectId || item;

            let result = await Client.Cloud.run('deleteOrganization', {objectId: objectId}, this.backendService.options);

            return parseUtils.simplifyObject(result.organization);
        } catch (exception) {
            console.log(`deleteOrganization failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addOrUpdateOrganizationLocal({itemObj, parentObj}) {
        try {
            let oldParent = undefined;

            // 保证先获得父单位信息
            if (!parentObj && itemObj.parentId) {
                parentObj = await this.backendService.fetchItem('Organization', itemObj.parentId);
            }

            // 根据本级name和父级parentName自动生成displayName
            if (!parentObj || itemObj.orgType === OrgType.Troop) {
                itemObj.displayName = itemObj.name;
            } else if (parentObj) {
                itemObj.displayName = `${parentObj.displayName}${itemObj.name}`
            }

            if (itemObj.objectId) {
                // 保存单位信息
                delete itemObj.orgCode;
                let targetObject = Client.Organization.fromObject(itemObj);
                let result = await targetObject.save(null, this.backendService.options);
                let organization = parseUtils.simplifyObject(result.toJSON());

                return organization;
            } else {
                itemObj.parentIds = [];
                if (parentObj) {
                    // 设置总队ID
                    itemObj.divisionId = parentObj.divisionId;
                    itemObj.parentId = parentObj.objectId;
                }
                if (!itemObj.divisionId) {
                    if (itemObj.orgSequence === OrgSequence.Division) {
                        itemObj.divisionId = itemObj.objectId;
                    }
                }

                // 保存单位信息
                let targetObject = Client.Organization.fromObject(itemObj);
                let result = await targetObject.save(null, this.backendService.options);

                // 设置上级单位ID （包括本级ID）
                targetObject = Client.Organization.createWithoutData(result.id);
                let parentIds = itemObj.parentIds;
                if (parentObj && parentObj.parentIds) {
                    parentIds = parentObj.parentIds.slice();
                }
                parentIds.push(result.id);
                targetObject.set('parentIds', parentIds);
                if (itemObj.orgSequence === OrgSequence.Division) {
                    targetObject.set('divisionId', result.id);
                }
                result = await targetObject.save(null, this.backendService.options);
                let organization = parseUtils.simplifyObject(result.toJSON());

                // 将新的单位ID加入父单位的childrenIds中
                if (parentObj && parentObj.objectId) {
                    let parseParent = Client.Organization.createWithoutData(parentObj.objectId);
                    parseParent = await parseParent.fetch();
                    let childrenIds = parseParent.get('childrenIds') || [];
                    childrenIds.push(organization.objectId);

                    parseParent.set('childrenIds', childrenIds);
                    parseParent = await parseParent.save(null, this.backendService.options);
                }

                // 查询上级单位对应的角色列表
                let parentRoles = undefined;
                if (parentObj && parentObj.parentIds) {
                    var roleQuery = new Client.Query(Client.Role);
                    roleQuery.containedIn('name', parentObj.parentIds);
                    parentRoles = await roleQuery.find(this.backendService.options);
                }

                // 添加本单位对应的角色, 将所有上级单位对应角色加入到本单位的子角色中
                var roleACL = new Client.ACL();
                roleACL.setPublicReadAccess(true);
                roleACL.setRoleWriteAccess(RoleName.Manager, true);
                var orgRole = new Client.Role(organization.objectId, roleACL);
                if (parentRoles) {
                    orgRole.getRoles().add(parentRoles);
                }
                orgRole = await orgRole.save(null, this.backendService.options);

                return organization;
            }
        } catch (exception) {
            console.log(`addOrUpdateOrganizationLocal failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 回收单位
    async deleteOrganizationLocal(item) {
        try {
            let objectId = item.objectId || item;

            let parseOrg = this.backendService.getParseObject('Organization', objectId);

            let soldierQuery = new Client.Query(Client.Soldier);
            soldierQuery.equalTo('organization', parseOrg);
            let result = await this.backendService.queryList('Soldier', soldierQuery);
            if (!_.isEmpty(result.list)) {
                throw '此单位下有在役人员，不允许删除！'
            }
            let placeQuery = new Client.Query(Client.TrainPlace);
            placeQuery.equalTo('organization', parseOrg);
            result = await this.backendService.queryList('TrainPlace', soldierQuery);
            if (!_.isEmpty(result.list)) {
                throw '此单位下有训练场地，不允许删除！'
            }

            //  对存在账号的单位做限制
            let userQuery = new Client.Query(Client.User);
            userQuery.equalTo('organization', parseOrg);
            let userResult = await this.backendService.queryList('User', userQuery);
            if (!_.isEmpty(userResult.list)){
                throw '该单位有账号，不可删除！';
            }

            let organization = await this.backendService.deleteItem('Organization', {objectId});

            try {
                // 将本单位从父级单位的childrenIds中删除
                if (organization.parentId) {
                    let parseParent = await this.backendService.fetchItem('Organization', organization.parentId);
                    let childrenIds = parseParent.childrenIds || [];
                    const index = childrenIds.indexOf(organization.parentId);
                    childrenIds.splice(index, 1);
                    let result = Client.Organization.fromObject(parseParent);
                    result.set('childrenIds', childrenIds);
                    await result.save(null, this.backendService.options);
                }
            } catch (_) {}

            try {
                var roleQuery = new Client.Query(Client.Role);
                roleQuery.equalTo('name', objectId);
                result = await this.backendService.queryList('Role', roleQuery);
                if (!_.isEmpty(result.list)) {
                    await this.backendService.deleteList('Role', result.list);
                }
            } catch (_) {}

            return organization;
        } catch (exception) {
            console.log(`deleteOrganization failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 恢复删除的单位
    async restoreOrganization(item) {
        try {
            let objectId = item.objectId || item;

            let targetObject = Client.OosOrganization.createWithoutData(objectId);
            targetObject.set('deleted', false);
            targetObject.set('deletedAt', null);
            let result = await targetObject.save(null, this.backendService.options);
            let organization = parseUtils.simplifyObject(result.toJSON());

            // 将本单位重新加入到父级单位的childrenIds中
            if (organization.parentId) {
                let parentObj = await this.backendService.fetchItem('Organization', organization.parentId);
                parentObj.childrenIds = parentObj.childrenIds || [];
                parentObj.childrenIds.push(organization.objectId);
                result = await this.backendService.addOrUpdateItem('Organization', parentObj);
            }

            return organization;
        } catch (exception) {
            console.log(`deleteOrganization failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 查询账号权限范围内的根节点
    async getRootOrganization(userScope=true) {
        try {
            let organization = this.backendService.getCurrentOrganization();

            if (userScope && !_.isEmpty(organization))  return organization;

            let query = new Client.Query(Client.Organization);
            query.containedIn('parentId', [undefined, '']);
            query.addAscending('nodeCode');
            let result = await this.backendService.queryListAll('Organization', query);

            return result.list[0];
        } catch (exception) {
            console.log(`getRootOrganization failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 查询父节点下的直接孩子节点
    async getChildOrganizationsByParentId(parentId) {
        try {
            if (!parentId) {
                let organization = this.backendService.getCurrentOrganization();
                parentId = organization&&organization.objectId;
            }
            let query = new Client.Query(Client.Organization);
            if (!parentId) {
                query.containedIn('parentId', [undefined, '']);
            } else {
                query.equalTo('parentId', parentId);
            }

            query.addAscending('orgCode');

            let result = await this.backendService.queryListAll('Organization', query);

			return result;
        } catch (exception) {
            console.log(`getChildOrganizationsByParentId failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取查询相应单位下的相同编制序列的单位列表，比如总队单位，查到的就是总队机关下的所有单位
    async getLocalOrganizations(organization) {
        try {

            if (_.isEmpty(organization)) {
                organization = this.backendService.getCurrentOrganization();
            }
            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) return [];

            let query = new Client.Query(Client.Organization);
            query.addAscending('orgCode');

            // 查询总部/总队/支队/大队本级及下属机关单位，或者查询中队本级及下属单位
            query.equalTo('parentIds', organization.objectId);
            if (organization.orgSequence < OrgSequence.Company) {
                query.equalTo('orgSequence', organization.orgSequence);
            }

            let result = await this.backendService.queryListAll('Organization', query);

			return result.list;
        } catch (exception) {
            console.log(`getLocalOrganizations failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getAllChildrenOrgs(parentId) {
        try {
            let query = new Client.Query(Client.Organization);
            query.addAscending('orgCode');

            if (parentId) {
                query.equalTo('parentIds', parentId);
            }

            let result = await this.backendService.queryListAll('Organization', query);

			return result.list;
        } catch (exception) {
            console.log(`getAllChildrenOrgs failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取完整的单位列表
    async getAllOrganizations(query) {
        try {
            if (!query) {
                query = new Client.Query(Client.Organization);
                query.addAscending('orgCode');
            }

            let result = await this.backendService.queryListAll('Organization', query);

			return result;
        } catch (exception) {
            console.log(`getAllOrganizations failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取当前单位的主单位, 主单位包括：中队、大队、支队、总队、总部
    async getMainOrgByChild(childOrg) {
        if (!childOrg) return this.backendService.getCurrentOrganization();
        const orgId = childOrg.objectId||childOrg;
        childOrg = await this.backendService.fetchItem('Organization', orgId);

        const orgSeq = childOrg.orgSequence;
        const orgType = childOrg.orgType;
        let matchSeqs = [OrgSequence.Army, OrgSequence.Division, OrgSequence.Brigade, OrgSequence.Regiment, OrgSequence.Battalion, OrgSequence.Company];
        if ((orgType === OrgType.Troop || orgType === OrgType.UnitForce) &&
            matchSeqs.findIndex(item => item === orgSeq) >= 0) return childOrg;
        if (!childOrg.parentIds) return undefined;

        // 从单位缓存中查询
        let parentIds = childOrg.parentIds.reverse().slice(1);
        for (let objectId of parentIds) {
            let orgObj = await this.backendService.fetchItem('Organization', objectId);
            if ((orgObj.orgType === OrgType.Troop || orgObj.orgType === OrgType.UnitForce) &&
                matchSeqs.findIndex(item => item === orgObj.orgSequence) >= 0) return orgObj;
        }

        return undefined;
    }
}

export default OrgService;
