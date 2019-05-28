import '../Client/parse-init';
import Client from '../Client';
import parseUtils from "../utils/parseUtils";
import _ from 'lodash';

export class UserService {
    constructor(backend) {
        this.backendService = backend;
    }
    async addOrUpdateUser(userInfo) {
        try {
            if (_.isEmpty(userInfo)) throw '参数不合法';

            // 保存用户信息时需要删除密码信息
            let forkUser = _.cloneDeep(userInfo);
            delete forkUser.passwordIsOk;
            if (forkUser.objectId) {
                delete forkUser.password;
            }
            let result = await Client.Cloud.run('addOrUpdateUser', {userInfo: forkUser}, this.backendService.options);
            if (result.organization && result.organization.id) {
                result.organization = parseUtils.simplifyObject(result.organization.toJSON());
            }
            console.log('addOrUpdateUser', result);
            return parseUtils.simplifyObject(result);
        } catch (exception) {
            console.log('addOrUpdateUser failed! exception:', exception);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    async deleteUser(username) {
        try {
            let result = await Client.Cloud.run('deleteUser', {username: username}, this.backendService.options);
            if (result.organization && result.organization.id) {
                result.organization = parseUtils.simplifyObject(result.organization.toJSON());
            }
            console.log(result);
            return parseUtils.simplifyObject(result);
        } catch (exception) {
            console.log('deleteUser failed! exception:', exception);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }

    }
}

export default UserService;
