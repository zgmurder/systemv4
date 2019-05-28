import Parse from '../Client/parse';
import { OrgSequence } from '../Constants';
import Client from '../Client';
import _ from 'lodash';

export default {
	object2ParseObject: (obj, parseObject) => {
		if (obj) {
			if (obj.objectId) {
				parseObject.id = obj.objectId;
			}
			Object.entries(obj).forEach(attr => {
				if (attr[0] !== 'objectId') parseObject.set(attr[0], attr[1]);
			});
		}
	},

	fixObject: (obj) => {
		if (obj === undefined || obj === null) return undefined;
		return obj.objectId ? {objectId: obj.objectId} : {objectId: obj};
	},

	fixObjectArray: (Obj, arr) => {
		if (arr === undefined || arr === null) return undefined;
		else if (arr.length === 0) return [];
		return arr.map((item) => item.objectId ? {objectId: item.objectId} : {objectId: item})
							.map((item) => Obj.fromObject(item));
	},

	fixParseDate: function (obj) {
		if (_.isEmpty(obj)) return obj;
		if (_.isDate(obj)||_.isString(obj)) return obj;

		if (_.isObject(obj)) {
 			const keys = _.keysIn(obj);
			for (let key of keys) {
				if (key === 'ACL') continue;
				if (obj[key]&&obj[key].__type === 'Date') {
					obj[key] = new Date(obj[key].iso);
				} else if (_.isObject(obj[key]||_.isArray(obj[key]))) {
					obj[key] = this.fixParseDate(obj[key]);
				}
			}
        } else if (_.isArray(obj)) {
			return obj.map(item => this.fixParseDate(item));
		}

        return obj;
	},

	simplifyObject: function (obj) {
		if (obj) {
		    // delete obj.createdAt;
            // delete obj.updatedAt;
			delete obj.ACL;
		}

		return this.fixParseDate(obj);
	},

	getParseObject: function(className, objectId) {
        let obj = new Client[className]();
        obj.id = objectId;
        return obj;
    },

	setACL: (parseItem, obj, {readRoles, writeRoles}) => {
        var acl = new Parse.ACL();
        if (readRoles && readRoles.length > 0) {
            readRoles.forEach(item => acl.setRoleReadAccess(item, true));
        }
        // acl.setRoleReadAccess(RoleName.Administrator, true);
        // acl.setRoleReadAccess(RoleName.Reader, true);
        if (obj.organization) {
            if (obj.organization.objectId) {
                acl.setRoleReadAccess(obj.organization.objectId, true);
            } else {
                acl.setRoleReadAccess(obj.organization, true);
            }
        }
        // acl.setRoleWriteAccess(RoleName.Operator, true);
        if (writeRoles && writeRoles.length > 0) {
            writeRoles.forEach(item => acl.setRoleWriteAccess(item, true));
        }

        parseItem.setACL(acl);
	},

	getErrorMessage: (parseError) => {
		let message = '';
		let result = {type: 'error', message: ''};

		if (typeof parseError === 'string') return {type: 'error', message: parseError};
		if (parseError.type) return parseError;

		if (typeof parseError.message === 'object') parseError = parseError.message;

		if (parseError.code == 141) return {type: 'warning', message: parseError.message};
		else if (parseError.code == 100) return {type: 'error', message: '连接后台接口服务器失败'};
		else if (parseError.code == 101) return {type: 'warning', message: '数据对象不存在'};
		else if (parseError.code == 102) return {type: 'warning', message: '查询条件存在不合理参数'};
		else if (parseError.code == 122) return {type: 'warning', message: '文件名称不合法(只能包含a-zA-Z0-9_中的字符并且在1到128个字符之间)'};
		else if (parseError.code == 124) return {type: 'warning', message: '访问请求超时'};
		else if (parseError.code == 200) return {type: 'warning', message: '用户名不能为空'};
		else if (parseError.code == 201) return {type: 'warning', message: '密码不能为空'};
		else if (parseError.code == 202) return {type: 'warning', message: '用户名已经被占用，请换一个试试'};
		else if (parseError.code == 203) return {type: 'warning', message: '邮件地址已经被占用，请换一个试试'};
		else if (parseError.code == 204) return {type: 'warning', message: '邮件地址不能为空'};
		else if (parseError.code == 205) return {type: 'warning', message: '该用户指定的邮件地址不存在'};
		else if (parseError.code == 206) return {type: 'warning', message: '用户未登陆，无权限修改其它数据'};
		else if (parseError.code == 207) return {type: 'warning', message: '请通过注册来创建用户'};
		else if (parseError.code == 209) return {type: 'warning', message: '用户登陆已过期，请重新登陆'};
		else return {type: 'error', message: `访问请求存在错误参数(${parseError.code})`};
	},
}
