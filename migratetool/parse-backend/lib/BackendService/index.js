import '../Client/parse-init';
import Parse from '../Client/parse';
import Client from '../Client';
import _ from 'lodash';
import { ResultCode, RoleId, StandardState,AdminOrganization, OrgSequence, IsZhiDui, IsDaDui, OrgType, RoleName, InServiceStatus, SubmitState, ApproveState} from '../Constants';
import parseUtils from '../utils/parseUtils';
import OrgService from './OrgService';
import SoldierService from './SoldierService';
import FileService from './FileService';
import UserService from './UserService';
import CourseService from './CourseService';
import OfficeReportService from './OfficeReportService';
import ReportService from './ReportService';
import HolidayService from './HolidayService';
import ReportCommonApi from './ReportCommonApi';
import SystemService from './SystemService';
import RegimentReportService from './RegimentReportService';
import QuarterReportService from './QuarterReportService';
import AssessEventService from './AssessEventService';
import ScoreService from './ScoreService';
import SportService from "./SportService";
import AnnualPlanService from './AnnualPlanService';
import StagePlanService from './StagePlanService';
import MonthPlanService from './MonthPlanService';
import WeeklyPlanService from './WeeklyPlanService';
import OfficeMonthPlanService from './OfficeMonthPlanService';
import StatisticAnalyzeService from "./StatisticAnalyzeService";
import AssessService from "./AssessService";
import ScoreAnalysis from "./ScoreAnalysis";

export class BackendService {
    constructor({
        appId = ''
    }) {
        this.baseServerUrl = 'http://localhost:1337/';
        this.appId = appId;
        this.currentUser = null;
        this.system = '';
        this.options = undefined;
        this.timerId = 0;
        this.systemTime = new Date();
        this.Client = Client;
        this.orgService = null;
        this.soldierService = null;
        this.FileService = null;
        this.UserService = null;
        this.courseService = null;
        this.reportService = null;
        this.officeReportService = null;
        this.holidayService = null;
        this.reportCommonApi = null;
        this.systemService = null;
        this.regimentReportService = null;
        this.quarterReportService = null;
        this.assessEventService = null;
        this.sportService = null;
        this.scoreService = null;
        this.annualPlanService = null;
        this.statisticAnalyzeService = null;
        this.assessService = null;
        this.scoreAnalysis = null;
    }

    async initialize(system) {
        try {
            Client.User.disableUnsafeCurrentUser();

            let user = undefined;
            let sessionToken = undefined;
            try {
                if(process.env.IS_BROWSER) {
                    user = JSON.parse(localStorage.getItem(`${system}_LoginUser`));
                    sessionToken = localStorage.getItem(`${system}_SessionToken`);
                }
            } catch (e) {}

            if (user && sessionToken) {
                // this.options = {sessionToken: user.getSessionToken()};
                // user = user.toJSON();
                this.options = {sessionToken: sessionToken};
            } else {
                user = undefined;
            }
            if (user && user.organization) {
                try {
                    let organization = new Client.Organization();
                    organization.id = user.organization.objectId;
                    organization = await organization.fetch();
                    user.organization = organization.toJSON();
                } catch (_) {
                    user = null;
                }
            }
            this.currentUser = user;
            this.system = system;

            this.orgService = new OrgService(this);
            this.soldierService = new SoldierService(this);
            this.FileService = new FileService(this);
            this.UserService = new UserService(this);
            this.courseService = new CourseService(this);
            this.reportService = new ReportService(this);
            this.officeReportService = new OfficeReportService(this);
            this.holidayService = new HolidayService(this);
            this.reportCommonApi = new ReportCommonApi(this);
            this.systemService = new SystemService(this);
            this.regimentReportService = new RegimentReportService(this);
            this.quarterReportService = new QuarterReportService(this);
            this.assessEventService = new AssessEventService(this);
            this.sportService = new SportService(this);
            this.scoreService = new ScoreService(this);
            this.annualPlanService = new AnnualPlanService(this);
            this.statisticAnalyzeService = new StatisticAnalyzeService(this);
            this.assessService = new AssessService(this);
            this.scoreAnalysis = new ScoreAnalysis(this);

            this.syncSystemTime();
            this.timerId = setInterval(this.syncSystemTime.bind(this), 60000);

            if (this.currentUser && !this.currentUser.organization) {
                try {
                    this.currentUser.organization = await this.orgService.getRootOrganization();
                } catch (_) {
                    user = null;
                }
            }

            return ResultCode.Ok;
        } catch (exception) {
            console.log('BackendService.initialize failed:', exception);
            return ResultCode.Error;
        }
    }

    createStagePlanService() {
        return new StagePlanService(this);
    }

    createMonthPlanService() {
        return new MonthPlanService(this);
    }

    createWeeklyPlanService() {
        return new WeeklyPlanService(this);
    }

    createOfficeMonthPlanService() {
        return new OfficeMonthPlanService(this);
    }

    setServerUrl(host) {
        this.baseServerUrl = `http://${host}:1337/`;
        Parse.serverURL = `http://${host}:1337/parse`;
    }

    getSystemTime() {
        return this.systemTime;
    }
    syncSystemTime() {
        this.systemService.getSystemTime().then(time => {
            this.systemTime = new Date(time);
        }).catch(() => {
            this.systemTime = new Date();
        })
    }

    getImageServerURL() {
        return `${this.baseServerUrl}image`;
    }

    getParseObject(className, objectId) {
        let obj = new Client[className]();
        obj.id = objectId;
        return obj;
    }
    setErrorHandler(handler) {
        this.errorHandler = handler;
    }
    getCurrentOrganization() {
        return this.currentUser && this.currentUser.organization || {}
    }

    isAdmin() {
        return this.currentUser&&this.currentUser.role<=RoleId.Manager;
    }
    isLogin() {
        // let currentUser = Client.User.current();
        // if (!currentUser) this.currentUser = null;
        return !!this.currentUser;
    }
    async login(userInfo) {
        try {
            let user = await Client.User.logIn(userInfo.username, userInfo.password);

            this.options = {sessionToken: user.getSessionToken()};
            this.currentUser = user.toJSON();
            console.log(`Login ${userInfo.username} succeeded!`);

            if (this.currentUser && this.currentUser.organization && !this.currentUser.organization.name) {
                this.currentUser.organization = await this.fetchItem('Organization', this.currentUser.organization.objectId);
            }

            if (this.currentUser.organization && this.currentUser.organization.deleted) reject('本账号关联单位已被删除，不允许再登陆');

            if (process.env.IS_BROWSER) {
                localStorage.setItem(`${this.system}_LoginUser`, JSON.stringify(this.currentUser));
                localStorage.setItem(`${this.system}_SessionToken`, this.options.sessionToken);
            }

            if (this.currentUser && !this.currentUser.organization) {
                try {
                    this.currentUser.organization = await this.orgService.getRootOrganization();
                } catch (_) {
                    user = null;
                }
            }
        } catch (exception) {
            this.currentUser = null;
            if(process.env.IS_BROWSER) {
                localStorage.removeItem(`${this.system}_LoginUser`);
                localStorage.removeItem(`${this.system}_SessionToken`);
            }

            console.log(`Login ${userInfo.username} failed! Reason:${exception}`);
            let result = {};
            if (exception.code == 101) result = {type: 'warning', message: '用户不存在或者密码错误'};
            else result = parseUtils.getErrorMessage(exception);

            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    logout() {
        return new Promise((resolve, reject) => {
            try {
                if(process.env.IS_BROWSER) {
                    localStorage.removeItem(`${this.system}_LoginUser`);
                    localStorage.removeItem(`${this.system}_SessionToken`);
                }
            } catch (_) {};

            this.currentUser = null;
            resolve(ResultCode.Ok);

            // Client.User.logOut()
            //     .then((user) => {
            //         this.currentUser = null;
            //         resolve(ResultCode.Ok)
            //     }).catch((reason) => {
            //         this.currentUser = null;
            //         reject(parseUtils.getErrorMessage(reason));
            //     });
        });
    }

    async resetPassword(userInfo) {
        try {
            if (this.currentUser.role <= RoleId.Manager && this.currentUser.role <= userInfo.role) {
                let parseUser = new Client.User();
                parseUser.id = userInfo.objectId;
                parseUser.setPassword('123456');
                await parseUser.save(null, this.options);

                return 0;
            } else {
                throw '无权限重置该用户密码';
            }
        } catch (exception) {
            console.log(`resetPassword failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updatePassword(userInfo, newPass) {
        try {
            let user = await Client.User.logIn(userInfo.username, userInfo.password);
            let parseUser = new Client.User();
            parseUser.id = userInfo.objectId;
            parseUser.setPassword(newPass);
            await parseUser.save(null, {sessionToken: user.getSessionToken()});

            return this.logout();
        } catch (exception) {
            console.log(`updatePassword failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据id查询单条数据详情接口
    fetchItem(target, objectId) {
        return new Promise((resolve, reject) => {
            let TargetObject = Client[target];

            if (!TargetObject) return reject(`Undefined schema for ${target}`);

            let targetObject = new TargetObject();
			targetObject.id = objectId;
            targetObject.fetch(this.options)
                .then((result) => {
                    let final = parseUtils.simplifyObject(result.toJSON());
                    resolve(final);
                }).catch((reason) => {
                    console.log(`fetchItem for target ${target} with id ${objectId} failed! Reason:${reason}`);
                    let result = parseUtils.getErrorMessage(reason);
                    if (this.errorHandler) this.errorHandler(reason.code, result);
                    reject(result);
                });
        });
    }

    async fetchAll(target, objectIds) {
        const parseObjects = objectIds.map(id => this.getParseObject(target, id));

        const parseResults = await Client.Object.fetchAll(parseObjects, this.options);

        const results = parseResults.map(parseObj => parseUtils.simplifyObject(parseObj.toJSON()));

        return results;
    }

    // 根据query条件查询数据列表接口
    queryList(target, query) {
        return new Promise((resolve, reject) => {
            let TargetObject = Client[target];

            if (!TargetObject) return reject(`Undefined schema for ${target}`);

            if (!query) {
                query = new Client.Query(TargetObject);
                query.addAscending('createdAt');
            }

            if (TargetObject.getIncludes) {
				let includes = TargetObject.getIncludes();
				if (includes) {
					includes.forEach(item => {
						query.include(item);
					});
				}
			}
			if (TargetObject.queryCondition) {
				TargetObject.queryCondition(query);
            }

            let total = 0;
            query.count(this.options)
                .then((count) => {
                    total = count;
                    return query.find(this.options);
                }).then((results) => {
                    let list = results.map(item => parseUtils.simplifyObject(item.toJSON()));
			        list = list || [];

                    // console.log(`After queryList for target ${target}`, {total, list});
                    resolve({total, list});
                }).catch((reason) => {
                    console.log(`queryList for target ${target} failed! Reason:${reason}`);
                    let result = parseUtils.getErrorMessage(reason);
                    if (this.errorHandler) this.errorHandler(reason.code, result);
                    reject(result);
                });
        });
    }

    async queryListAll(target, query) {
        let TargetObject = Client[target];

        if (!TargetObject) throw `Undefined schema for ${target}`;

        if (!query) {
            query = new Client.Query(TargetObject);
            query.addAscending('createdAt');
        }
        if (TargetObject.getIncludes) {
            let includes = TargetObject.getIncludes();
            if (includes) {
                includes.forEach(item => {
                    query.include(item);
                });
            }
        }
        if (TargetObject.queryCondition) {
            TargetObject.queryCondition(query);
        }


        try {
            let allResults = [];
			let total = await query.count(this.options);
			query.limit(1000);
			for (let skip = 0; skip < total;) {
				query.skip(skip);
				let results = await query.find(this.options);
				skip += results.length;
				allResults = allResults.concat(results);
			}

			let list = allResults.map(item => parseUtils.simplifyObject(item.toJSON()));
			list = list || [];

			// console.log('queryListAll', {total, list});

			return {total, list};
        } catch (exception) {
            console.log(`queryListAll for target ${target} failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 添加或修改单项数据接口
    addOrUpdateItem(target, item) {
        return new Promise((resolve, reject) => {
            let TargetObject = Client[target];

            if (!TargetObject) return reject(`Undefined schema for ${target}`);

            let targetObject = TargetObject.fromObject(item);
            targetObject.save(null, this.options)
                .then((result) => {
                    let final = parseUtils.simplifyObject(result.toJSON());
                    if (TargetObject.simplify) {
                        final = TargetObject.simplify(final);
                    }
                    resolve(final);
                }).catch((reason) => {
                    console.log(`addOrUpdateItem for target ${target} failed! Reason:${reason}`);
                    let result = parseUtils.getErrorMessage(reason);
                    if (this.errorHandler) this.errorHandler(reason.code, result);
                    reject(result);
                });
        });
    }

    // 添加或修改多项数据接口
    addOrUpdateList(target, list) {
        return new Promise((resolve, reject) => {
            let TargetObject = Client[target];
            let listResult = [];

            if (!TargetObject) return reject(`Undefined schema for ${target}`);

            let targetObjects = list.map(item => TargetObject.fromObject(item));
			Client.Object.saveAll(targetObjects, this.options)
                .then((results) => {
                    for (let result of results) {
                        let final = parseUtils.simplifyObject(result.toJSON());
                        if (TargetObject.simplify) {
                            final = TargetObject.simplify(final);
                        }
                        listResult.push(final);
                    }

                    resolve(listResult);
                }).catch((reason) => {
                    console.log(`addOrUpdateList for target ${target} failed! Reason:${reason}`);
                    let result = parseUtils.getErrorMessage(reason);
                    if (this.errorHandler) this.errorHandler(reason.code, result);
                    reject(result);
                });
        });
    }

    // 删除单项数据接口
    deleteItem(target, item) {
        return new Promise((resolve, reject) => {
            let TargetObject = Client[target];

            if (!TargetObject) return reject(`Undefined schema for ${target}`);

            let targetObject = new TargetObject();
			targetObject.id = item.objectId||item;
            targetObject.destroy(this.options)
                .then((result) => {
                    let final = parseUtils.simplifyObject(result.toJSON());
                    if (TargetObject.simplify) {
                        final = TargetObject.simplify(final);
                    }
                    resolve(final);
                }).catch((reason) => {
                    console.log(`deleteItem for target ${target} failed! Reason:${reason}`);
                    let result = parseUtils.getErrorMessage(reason);
                    if (this.errorHandler) this.errorHandler(reason.code, result);
                    reject(result);
                });
        });
    }

    // 删除多项数据接口
    deleteList(target, list) {
        return new Promise((resolve, reject) => {
            let TargetObject = Client[target];
            let listResult = [];

            if (!TargetObject) return reject(`Undefined schema for ${target}`);

            let targetObjects = list.map(item => {
				let targetObject = new TargetObject();
				targetObject.id = item.objectId||item;
				return targetObject;
			});
			Client.Object.destroyAll(targetObjects, this.options)
                .then((results) => {
                    for (let result of results) {
                        let final = parseUtils.simplifyObject(result.toJSON());
                        if (TargetObject.simplify) {
                            final = TargetObject.simplify(final);
                        }
                        listResult.push(final);
                    }

                    resolve(listResult);
                }).catch((reason) => {
                    console.log(`deleteList for target ${target} failed! Reason:${reason}`);
                    let result = parseUtils.getErrorMessage(reason);
                    if (this.errorHandler) this.errorHandler(reason.code, result);
                    reject(result);
                });
        });
    }

    // 查询某个单位本级及所有下级单位的完整信息列表，支持过滤和翻页
    async queryListByOrganization({className, query, organization, withLocal=false}, orgField='organization') {
        try {
            let TargetObject = Client[className];

            if (!query) {
                query = new Client.Query(TargetObject);
                query.addAscending('orgCode');
            }

            if (_.isEmpty(organization)) {
                organization = this.getCurrentOrganization();
            }
            if (_.isString(organization)) {
                organization = await this.fetchItem('Organization', organization);
            }

            // 查询该单位下的所有人员，包括下级单位
            let orgId = (organization && organization.objectId)?organization.objectId:organization;
            if (orgId) {
                // 获取本级
                let queryOrg = new Client.Query(Client.Organization);
                queryOrg.equalTo('parentIds', orgId);
                if (withLocal && organization.orgSequence < OrgSequence.Company) {
                    queryOrg.equalTo('orgSequence', organization.orgSequence);
                }
                query.matchesQuery(orgField, queryOrg);
            }

            if (TargetObject.getIncludes) {
                let includes = TargetObject.getIncludes();
                if (includes) {
                    includes.forEach(item => {
                        query.include(item);
                    });
                }
            }
            if (TargetObject.queryCondition) {
                TargetObject.queryCondition(query);
            }
            let total = await query.count(this.options);
            let results = await query.find(this.options);

            let list = results.map(item => parseUtils.simplifyObject(item.toJSON()));
			list = list || [];

			return {total, list};
        } catch (exception) {
            console.log(`queryListByOrganization failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) return this.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 查询某个单位本级的完整信息列表，支持过滤和翻页
    async queryListByOrganizationLocal({className, query, organization}) {
        if (!organization) {
            organization = this.getCurrentOrganization();
        }
        if (!organization) return {total: 0, list: []};

        return this.queryListByOrganization({className, query, organization, withLocal: true});
    }

    // 启用军事训练大纲接口
    async activateTrainStandard(objectId) {
        try {
            let targetObjects = [];
            let toUseItem = new Client.TrainStandard();
            toUseItem.id = objectId;
            toUseItem.set('state', StandardState.Using);
            toUseItem.set('startTime', new Date());
            targetObjects.push(toUseItem);

            let query = new Client.Query(Client.TrainStandard);
            query.equalTo('state', StandardState.Using);
            let usingItems = await query.find();
            if (usingItems && usingItems.length > 0) {
                let usingItem = usingItems[0];
                usingItem.set('state', StandardState.Stopped);
                usingItem.set('endTime', new Date());
                targetObjects.push(usingItem);
            }

            let results = await Client.Object.saveAll(targetObjects, this.options);

            let listResult = [];
            for (let result of results) {
                let final = parseUtils.simplifyObject(result.toJSON());
                if (Client.TrainStandard.simplify) {
                    final = TargetObject.simplify(final);
                }
                listResult.push(final);
            }

            return listResult;
        } catch (exception) {
            console.log(`activateTrainStandard failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据所选单位编制序列查询可选职务类型
    async queryPositionList(orgObj) {
        try {
            let mainOrgObj = await this.orgService.getMainOrgByChild(orgObj);
            if (_.isEmpty(mainOrgObj)) return {total: 0, list: []};

            // 先按照单位分类查询职务
            let query = new Client.Query(Client.Position2);
            query.equalTo('orgCategory', mainOrgObj.orgCategory);
            query.addAscending('sortCode');
            let result = await this.queryListAll('Position2', query);
            if (!_.isEmpty(result.list)) return result;

            // 先按照单位编制序列查询职务
            query = new Client.Query(Client.Position);
            query.equalTo('orgSequence', mainOrgObj.orgSequence);
            query.addAscending('sortCode');
            result = await this.queryListAll('Position', query);

			return result;
        } catch (exception) {
            console.log(`queryPositionList failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据所选单位编制序列查询下级可选职务类型
    async queryPositionListBelowOrg(orgObj) {
        try {
            if (_.isEmpty(orgObj)) return {total: 0, list: []};
            if (_.isString(orgObj)) orgObj = await this.fetchItem('Organization', orgObj);

            let options = [];
            // 先按照单位分类查询职务
            if (orgObj.orgSequence >= OrgSequence.Division || orgObj.orgCategory.startsWith('训练基地')) {
                let query = new Client.Query(Client.Position2);
                query.equalTo('orgCategory', orgObj.orgCategory);
                query.addAscending('sortCode');
                let result = await this.queryListAll('Position2', query);
                options = result.list;
            }


            // 先按照单位编制序列查询职务
            let query = new Client.Query(Client.Position);
            query.greaterThanOrEqualTo('orgSequence', orgObj.orgSequence);
            query.addAscending('sortCode');
            let result = await this.queryListAll('Position', query);
            options = options.concat(result.list);
            options = _.uniq(options.sort((a, b) => a.sortCode - b.sortCode).map(item => item.name));

            return options;
        } catch (exception) {
            console.log(`queryPositionList failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 提交表单，将表单状态设置为state=SubmitState.Submited
    async submitTable(className, objectId) {
        try {
            let obj = {
                objectId,
                state: SubmitState.Submited
            };
            const result = await this.addOrUpdateItem(className, obj);

            // 添加操作记录
            await this.addOperateRecord({
                tblName: className,
                targetId: objectId,
                operateType: '提交',
                description: ''
            });

            return result;
        }  catch (exception) {
            console.log(`submitTable failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 批量提交
    async submitTableBatch(className, objectIds) {
        try {
            const parseObjs = objectIds.map(objectId => {
                let parseObj = this.getParseObject(className, objectId);
                parseObj.set('state', SubmitState.Submited);
            });

            await Client.Object.saveAll(parseObjs, this.options);

            // 添加操作记录
            const operateRecords = objectIds.map(objectId => {
                return {
                    tblName: className,
                    targetId: objectId,
                    operateType: '提交',
                    operatedAt: this.getSystemTime(),
                    operatedBy: (this.currentUser||{}).username,
                    organization: (this.currentUser||{}).organization,
                    description: ''
                }
            });
            await this.addOrUpdateList('OperateRecord', operateRecords);
        }  catch (exception) {
            console.log(`submitTableBatch failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    async applyingTable(className, objectId) {
        return this._submitApproveState(className, objectId, ApproveState.Approving);
    }

    async approveTable(className, objectId, approvedBy) {
        return this._submitApproveState(className, objectId, ApproveState.Approved, approvedBy);
    }

    async rejectTable(className, objectId, description='') {
        return this._submitApproveState(className, objectId, ApproveState.Rejected, {}, description);
    }

    // 审核表单
    async _submitApproveState(className, objectId, state, approvedBy, description='') {
        try {
            if (state <= ApproveState.Initial || state > ApproveState.Approved) throw '审核状态不合法';
            let organization = this.getCurrentOrganization();
            if (_.isEmpty(organization)) throw '该账号无权限修改审核状态';

            let obj = await this.fetchItem(className, objectId);
            let mainOrg = await this.orgService.getMainOrgByChild(obj.organization);

            if (state === ApproveState.Approving) {
                if (mainOrg.objectId != organization.objectId) throw '该账号无权限提交审核该表';
            } else {
                if (!(IsZhiDui(organization.orgSequence) || IsDaDui(organization.orgSequence))) throw '该账号无权限审核该表';
            }

            let approveRecord = {
                tableName: className,
                state,
                organization,
                approvedBy,
                targetId: objectId,
                operatedAt: this.getSystemTime(),
                operatedBy: this.currentUser.username,
            };

            const approvedById = (approvedBy||{}).objectId || approvedBy;
            let approvedByName = (approvedBy||{}).name;
            let approvedByPosition = (approvedBy||{}).position;
            if (!_.isEmpty(approvedById) && _.isEmpty(approvedByName)) {
                const obj = await this.fetchItem('Soldier', approvedById);
                approvedByName = (obj||{}).name;
                approvedByPosition = (obj||{}).position;
            }

            await this.addOrUpdateItem('ApproveRecord', approveRecord);

            let operateType = '';
            let approveTargetOrgId = undefined;
            if (state === ApproveState.Approving) {
                operateType = '提交审批';
                approveTargetOrgId = (this.getCurrentOrganization()||{}).parentId;
            } else if (state === ApproveState.Approved) {
                operateType = '审批通过';
            } else if (state === ApproveState.Rejected) {
                operateType = '审批不通过';
            }

            // 设置审批人员
            let approval = {approvedBy, approvedByName, approvedByPosition};
            if (state === ApproveState.Approved || state === ApproveState.Rejected) {
                const currOrg = this.getCurrentOrganization();
                if (!_.isEmpty(currOrg)) {
                    let positionNames = [];
                    if (currOrg.orgSequence === OrgSequence.Brigade || currOrg.orgSequence === OrgSequence.Regiment) {
                        positionNames = ['参谋长'];
                    } else if (currOrg.orgSequence === OrgSequence.Battalion) {
                        positionNames = ['大队长', '教导员'];
                    }
                    if (!_.isEmpty(positionNames)) {
                        const soldierQuery = new Client.Query(Client.Soldier);
                        const queryOrg = new Client.Query(Client.Organization);
                        queryOrg.equalTo('orgSequence', currOrg.orgSequence);

                        soldierQuery.matchesQuery('organization', queryOrg);
                        soldierQuery.equalTo('inserviceStatus', InServiceStatus.InService);
                        soldierQuery.containedIn('position', positionNames);
                        soldierQuery.addDescending('rankCode').addAscending(['positionCode', 'enlistedAt']);

                        const result = await this.queryListAll('Soldier', soldierQuery);
                        const first = result.list.find(item => item.position === '参谋长' || item.position === '大队长');
                        let second = undefined;
                        if (currOrg.orgSequence === OrgSequence.Battalion) {
                            second = result.list.find(item => item.position === '教导员');
                        }
                        approval = {
                            approvedBy: first,
                            approvedByName: (first||{}).name,
                            approvedByPosition: (first||{}).position,
                            approvedBy2: second,
                            approvedByName2: (second||{}).name,
                            approvedByPosition2: (second||{}).position,
                        }
                    }
                }
            }

            const result = await this.addOrUpdateItem(className, {objectId, state, approveTargetOrgId, ...approval});

            // 添加操作记录
            await this.addOperateRecord({
                tblName: className,
                targetId: objectId,
                operateType,
                description
            });

            return result;
        }  catch (exception) {
            console.log(`submitTable failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    async fetchSoldiers(soldierIds) {
        try {
            if (_.isEmpty(soldierIds)) return [];

            let soldiers = await this.fetchAll('Soldier', soldierIds);
            const cardIds = soldiers.map(item => item.cardId);

            let query = new Client.Query(Client.Soldier);
            query.containedIn('cardId', cardIds);
            query.addAscending('orgCode').addDescending('rankCode').addAscending(['positionCode', 'enlistedAt']);

            const result = await this.queryListAll('Soldier', query);

            return result.list;
        } catch (exception) {
            console.log(`fetchSoldiers failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.errorHandler) this.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addOperateRecord(record) {
        record.operatedAt = this.getSystemTime();
        record.operatedBy = (this.currentUser||{}).username;
        record.organization = (this.currentUser||{}).organization;

        await this.addOrUpdateItem('OperateRecord', record);
    }
}

export default BackendService;
