import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import { DailySection,CourseCategory,OrgSequence, SubmitState, InServiceStatus, DayType, OrgType } from '../Constants';
import moment from 'moment';

export class ReportService {
    constructor(backend) {
        this.backendService = backend;
    }

    // 获取中队或应急班/特战排单位信息
    async getAllOrg(organization) {
        try {
            let result = {
                mainOrg: {},
                otherOrg: [],
                officeOrg: [],
            };
            const orgId = organization.objectId ? organization.objectId : organization;
            result.mainOrg = await this.backendService.fetchItem('Organization', orgId);
            const orgList = await this.backendService.orgService.getLocalOrganizations(organization);
            result.otherOrg = orgList.filter(item => item.orgCategory !== result.mainOrg.orgCategory && item.orgSequence > result.mainOrg.orgSequence);
            result.otherOrg = _.uniqBy(result.otherOrg, 'orgCategory');
            result.officeOrg = _.orderBy(orgList.filter(item => item.orgType === OrgType.LeaderOffice), ['orgCode'], 'asc');
            return result;
        } catch (exception) {
            console.log(`getAllOrg failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取中队或应急班/特战排指定月份日登记表添加状态
    async getExistedTableDateByOrgAndDate(org, date) {
        try {
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let reportState = [];
            let dateStart = new Date(date.getFullYear(), date.getMonth(), 1);
            let dateEnd = moment(dateStart).add(1, 'months').toDate();
            dateStart = moment(dateStart).subtract(7, 'days').toDate();
            let dailyReportQuery = new Client.Query(Client.DailyReport);
            dailyReportQuery.greaterThanOrEqualTo('date', dateStart);
            dailyReportQuery.lessThan('date', dateEnd);
            dailyReportQuery.equalTo('targetOrg', parseOrg);
            dailyReportQuery.addDescending('date');
            let reportResults = await this.backendService.queryListAll('DailyReport', dailyReportQuery);
            if (reportResults.list.length) {
                for (let info of reportResults.list) {
                    reportState.push({
                        date:info.date,
                        state: info.state,
                        timeout: info.timeout
                    });
                }
            }
            return reportState;
        } catch (exception) {
            console.log(`getExistedTableDateByOrgAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取中队或应急班/特战排指定年份月统计表添加状态(传入年份如2018)
    async getExistedTableMonthByOrgAndDate(org, year) {
        try {
            year = parseInt(year, 10);
            if (isNaN(year)) {
                throw '查询参数错误！';
            }
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let reportState = [];
            let reportQuery = new Client.Query(Client.MonthlyReportL1);
            reportQuery.equalTo('targetOrg', parseOrg);
            reportQuery.equalTo('year', year);
            reportQuery.addDescending('date');
            let reportResults = await this.backendService.queryListAll('MonthlyReportL1', reportQuery);
            if (reportResults.list.length) {
                for (let info of reportResults.list) {
                    reportState.push({
                        date: info.date,
                        state: info.state,
                        timeout: info.timeout
                    });
                }
            }
            return reportState;
        } catch (exception) {
            console.log(`getExistedTableMonthByOrgAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据单位、日期获取日登记表
    async getDailyReport(org, date) {
        try {
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            date = this.backendService.reportCommonApi.setDateToZero(date);
            let result = {};
            let dailyReportQuery = new Client.Query(Client.DailyReport);
            dailyReportQuery.equalTo('date', date);
            dailyReportQuery.equalTo('targetOrg', parseOrg);
            let reportResult = await dailyReportQuery.find(this.backendService.options);
            if (reportResult.length) {
                result = parseUtils.simplifyObject(reportResult[0].toJSON());
            }
            return result;
        } catch (exception) {
            console.log(`getDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据单位、日期获取月统计表
    async getMonthlyReportL1(org, date) {
        try {
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let year = date.getFullYear();
            let month = date.getMonth();
            let result = {};
            let reportQuery = new Client.Query(Client.MonthlyReportL1);
            reportQuery.equalTo('year', year);
            reportQuery.equalTo('month', month);
            reportQuery.equalTo('targetOrg', parseOrg);
            let reportResult = await reportQuery.find(this.backendService.options);
            if (reportResult.length) {
                result = parseUtils.simplifyObject(reportResult[0].toJSON());
                if (!result.state && result.month === 11) {
                    result.trainerStatistic = await this.backendService.reportCommonApi.getCompanyDecemberTrainerStatistic(result.targetOrg, result.date);
                    result.qualityStat = await this.backendService.reportCommonApi.getCompanyDecemberQualityStat(result.targetOrg, result.date);
                    result.placeStatistic = await this.backendService.reportCommonApi.getCompanyDecemberPlaceStatistic(result.targetOrg, result.date);
                    result = Client.MonthlyReportL1.fromObject(result);
                    await result.save(null, this.backendService.options);
                    result = parseUtils.simplifyObject(result.toJSON());
                }
            }
            return result;
        } catch (exception) {
            console.log(`getMonthlyReportL1 failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据单位、月份获取当月所有日登记表
    async getMonthDailyReports(org, date) {
        try {
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let dateStart = new Date(date.getFullYear(), date.getMonth(), 1);
            let dateEnd = moment(dateStart).add(1, 'months').toDate();
            let dailyReportQuery = new Client.Query(Client.DailyReport);
            dailyReportQuery.greaterThanOrEqualTo('date', dateStart);
            dailyReportQuery.lessThan('date', dateEnd);
            dailyReportQuery.equalTo('targetOrg', parseOrg);
            let result = await this.backendService.queryListAll('DailyReport', dailyReportQuery);
            return result.list;
        } catch (exception) {
            console.log(`getMonthDailyReports failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取最近的日登记表数据
    async getLastDailyReport(org) {
        try {
            let date = this.backendService.getSystemTime();
            date = this.backendService.reportCommonApi.setDateToZero(date);
            let orgId = org.objectId ? org.objectId : org;
            let result = await this.backendService.reportCommonApi.getLastReport(orgId , date, 'DailyReport');
            if (!result) {
                result ={}
            }
            return result;
        } catch (exception) {
            console.log(`getLastDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取最近的中队月统计表数据
    async getLastMonthlyL1Report(org) {
        try {
            let date = this.backendService.getSystemTime();
            date = moment(new Date(date.getFullYear(), date.getMonth(), 1)).add(1, 'months').subtract(1, 'days').toDate();
            let orgId = org.objectId ? org.objectId : org;
            let result = await this.backendService.reportCommonApi.getLastReport(orgId, date, 'MonthlyReportL1');
            if (!result) {
                result ={}
            }
            return result;
        } catch (exception) {
            console.log(`getLastMonthlyL1Report failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 初始化日登记表前日期及单位判断（不传入date则默认创建当天日登记表，不传入timeoutFlag则默认正常登记，正常登记只允许登记本周）
    // 抛异常/返回未创建日登记表的日期/返回{}
    async judgeOrgAndDateIsOk(organization, date, timeoutFlag) {
        try {
            // 单位信息处理
            let org = organization;
            if (_.isString(org)) {
                org = await this.backendService.fetchItem('Organization', org);
            }

            // 日期信息处理
            let today = this.backendService.getSystemTime();
            today = this.backendService.reportCommonApi.setDateToZero(today);
            if (!date) {
                date = today;
            } else {
                date = this.backendService.reportCommonApi.setDateToZero(date);
            }

            // 非中队（应急班/特战排）/连单位不允许创建日登记表
            if (org.orgSequence < OrgSequence.Company || org.orgSequence > OrgSequence.Squad) {
                throw '非中队（应急班/特战排）/连单位不允许创建日登记表！';
            }

            if (date.getTime() > today.getTime()) {
                throw '不允许创建日期超过今天的登记表！';
            }

            let result = {};

            // 只允许创建本周工作日的日登记表
            if (!timeoutFlag) {
                let weekday = today.getDay();
                if (weekday === 0) {
                    weekday = 7;
                }
                let dateEnd = moment(today).add(7 - weekday + 1, 'days').toDate();
                let dateStart = moment(today).subtract(weekday - 1, 'days').toDate();
                if (date.getTime() >= dateEnd.getTime() || date.getTime() < dateStart.getTime()) {
                    throw '日期非本周的登记表请通过补登记入口创建！';
                } else {
                    let parseOrg = new Client.Organization();
                    parseOrg.id = org.objectId;
                    let dailyReportQuery = new Client.Query(Client.DailyReport);
                    dailyReportQuery.lessThanOrEqualTo('date', date);
                    dailyReportQuery.greaterThanOrEqualTo('date', dateStart);
                    dailyReportQuery.equalTo('targetOrg', parseOrg);
                    let reportResult = await dailyReportQuery.find(this.backendService.options);
                    let thisWeek = [];
                    for (let day = dateStart; day <= date; day = moment(day).add(1, 'days').toDate()) {
                        thisWeek.push(day.toDateString());
                    }
                    if (thisWeek.length > reportResult.length) {
                        let list = reportResult.map(item => parseUtils.simplifyObject(item.toJSON()));
                        let dates = [];
                        for (let info of list) {
                            dates.push(info.date.toDateString());
                        }
                        for (let workday of thisWeek) {
                            if (dates.indexOf(workday) === -1) {
                                result.date = new Date(workday);
                                date = result.date;
                                break;
                            }
                        }
                    }
                }
            }
            //  else {
            //     // let dateBegin = moment(today).subtract(1, 'months').toDate();
            //     if (date.getTime() < moment().startOf('year').toDate()) {
            //         throw '不允许补登记当年之前的日登记表！';
            //     }
            // }

            // let dayType = await this.backendService.holidayService.getDayType(date);
            // if (dayType !== DayType.Workday) {
            //     throw '不允许创建非工作日的日登记表！';
            // }

            return result;
        } catch (exception) {
            console.log(`judgeOrgAndDateIsOk failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 初始化日登记表信息（不传入date则默认创建当天日登记表）
    async makeInitialDailyReport(organization, date) {
        try {
            // 单位信息处理
            let org = organization;
            if (_.isString(org)) {
                org = await this.backendService.fetchItem('Organization', org);
            }

            // 日期信息处理
            let today = this.backendService.getSystemTime();
            today = this.backendService.reportCommonApi.setDateToZero(today);
            if (!date) {
                date = today;
            } else {
                date = this.backendService.reportCommonApi.setDateToZero(date);
            }

            // 查询日登记表是否已创建，已创建则直接返回查询数据
            let queryResult = await this.getDailyReport(org, date);
            if (!(_.isEmpty(queryResult))) {
                return queryResult;
            }

            // 获取中队表格信息
            let report = await this.backendService.reportCommonApi.getTableInfoByOrgAndDate(org, date);
            if (org.orgSequence > OrgSequence.Company) {
                report.mainFlag = false;
                report.organization = await this.backendService.fetchItem('Organization', org.parentId);
            } else {
                report.mainFlag = true;
                report.organization = org;
            }
            console.log(111, report)

            // 获取中队主管--中队长
            report.commander = await this.backendService.reportCommonApi.getSoldierNameByPosition(org.objectId, '中队长');

            /******************获取中队周计划默认课程***********************/
            let list = await this.getLessensbyWeeklyPlan(report.targetOrg,report.date);
            if (!_.isEmpty(list)) {
                report.timeStat[0].hoursInDay = list[0].hoursInDay;
                report.timeStat[0].hoursAtNight = list[0].hoursAtNight;
                report.timeStat[0].totalHoursInDay += list[0].hoursInDay;
                report.timeStat[0].totalHoursAtNight += list[0].hoursAtNight;
                let planLessons = list[0].lessons;
                planLessons.forEach(ele => {
                    if (_.isEmpty(ele.courses) || (ele.category !== CourseCategory.Train && ele.category !== CourseCategory.Sport)) return;
                    if(ele.section === DailySection.EarlyMoring)
                        ele.courses.forEach(item => report.contentStat.earlyMoring.push(item.name));
                    else if(ele.section === DailySection.Morning)
                        ele.courses.forEach(item => (!report.contentStat.morning.includes(item.name)) && report.contentStat.morning.push(item.name));
                    else if(ele.section === DailySection.Afternoon && ele.category !== CourseCategory.Sport)
                        ele.courses.forEach(item => (!report.contentStat.afternoon.includes(item.name)) && report.contentStat.afternoon.push(item.name));
                    else if(ele.section === DailySection.Afternoon && ele.category === CourseCategory.Sport)
                        ele.courses.forEach(item => (!report.contentStat.sport.includes(item.name)) && report.contentStat.sport.push(item.name));
                    else if(ele.section === DailySection.Night)
                        ele.courses.forEach(item => report.contentStat.night.push(item.name))
                });
            }
            return report;
        } catch (exception) {
            console.log(`makeInitialDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 添加或修改/提交日登记表（根据提交状态码state判断保存或提交）
    async addOrUpdateDailyReport(report) {
        try {
            if (!report) {
                throw '日登记表参数错误！';
            } else {
                // 统一日期样式
                report.date = this.backendService.reportCommonApi.setDateToZero(report.date);

                // 获取原登记表数据
                let oldReport = await this.getDailyReport(report.targetOrg, report.date);

                if (oldReport.objectId) {
                    report.objectId = oldReport.objectId;
                }

                // 判断是否重复提交
                if (oldReport.state) {
                    if (report.state) {
                        throw '请不要重复提交！';
                    } else {
                        throw '已提交的数据不能修改！';
                    }
                }

                let targetOrgId = report.targetOrg.objectId ? report.targetOrg.objectId : report.targetOrg;
                let parseOrg = new Client.Organization();
                parseOrg.id = targetOrgId;

                // if (report.state) {
                //     let unsubmitReportQuery = new Client.Query(Client.DailyReport);
                //     unsubmitReportQuery.equalTo('targetOrg', parseOrg);
                //     unsubmitReportQuery.equalTo('state', SubmitState.Initial);
                //     unsubmitReportQuery.lessThan('date', report.date);
                //     let unsubmitResult = await unsubmitReportQuery.find(this.backendService.options);
                //     if (unsubmitResult.length) {
                //         throw '此日期之前还有未提交的登记表，请按顺序提交！';
                //     }
                // }

                // 添加父组织关联单位
                let orgId = report.organization.objectId ? report.organization.objectId : report.organization;
                let org = await this.backendService.fetchItem('Organization', orgId);
                report.parentOrg = org.parentId;

                report.weekday = report.date.getDay();

                // 更新弹药人员信息
                report.bulletStat.map(item => {
                    if (item.trainAverage) {
                        item.soldierNumber = (Number(item.train) / Number(item.trainAverage)).toFixed(4)
                    }
                });

                let result = await this.backendService.addOrUpdateItem("DailyReport",report);

                // 更新日登记表
                await this.queryAndupdateDailyReport(oldReport, result);

                // 更新月统计表
                await this.updateMonthlyReport(result);

                // 添加操作记录
                await this.backendService.addOperateRecord({
                    tblName: 'DailyReport',
                    targetId: result.objectId,
                    operateType: report.objectId ? '修改' : '创建',
                    description: ''
                });

                return result;
            }
        } catch (exception) {
            console.log(`addOrUpdateDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteDailyReport(organization, date) {
        try {
            if (!organization || !date) {
                throw '输入信息有误，请提供正确的单位和日期信息！'
            }
            date = this.backendService.reportCommonApi.setDateToZero(date);
            let today = this.backendService.getSystemTime();
            today = this.backendService.reportCommonApi.setDateToZero(today);
            let aMonthAgo = moment(today).subtract(1, 'months').toDate();
            if (date.getTime() < aMonthAgo.getTime()) {
                throw '仅支持删除最近一个月的日登记表';
            }
            // 单位信息处理
            let org = organization;
            if (_.isString(org)) {
                org = await this.backendService.fetchItem('Organization', org);
            }
            let result = await this.getDailyReport(org, date);
            if (Number(result.state) === 0) {
                let newResult = {
                    date: result.date,
                    targetOrg: result.targetOrg,
                    contentStat: {
                        earlyMoring: [],
                        morning: [],
                        afternoon: [],
                        sport: [],
                        night: []
                    },
                    timeStat: [],
                    bulletStat: [],
                    motorStat: []
                };
                result.timeStat.map(time => {
                    newResult.timeStat.push({
                        type: time.type,
                        hoursInDay: 0,
                        hoursAtNight: 0
                    });
                });
                result.bulletStat.map(bullet => {
                    newResult.bulletStat.push({
                        type: bullet.type,
                        trainAverage: 0,
                        train: 0,
                        others: 0
                    });
                });
                result.motorStat.map(motor => {
                    newResult.motorStat.push({
                        type: motor.type,
                        count: 0
                    });
                });
                let parseReport = new Client.DailyReport();
                parseReport.id = result.objectId;
                await parseReport.destroy(this.backendService.options);
                await this.queryAndupdateDailyReport(result, newResult);
            } else {
                throw '仅支持删除未提交的日登记表';
            }
            await this.updateMonthlyReport(result);
            return result;
        } catch (exception) {
            console.log(`deleteDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 操作（增删改）日登记表后更新之后的日登记表
    async queryAndupdateDailyReport(oldResult, result) {
        try {
            let targetOrgId = result.targetOrg.objectId ? result.targetOrg.objectId : result.targetOrg;
            let parseOrg = new Client.Organization();
            parseOrg.id = targetOrgId;
            let dailyReportQuery = new Client.Query(Client.DailyReport);
            dailyReportQuery.lessThan('date', new Date(result.date.getFullYear()+1,0));
            dailyReportQuery.greaterThan('date', result.date);
            dailyReportQuery.equalTo('targetOrg', parseOrg)
            let updateResults = await this.backendService.queryListAll('DailyReport', dailyReportQuery);
            if (updateResults.list.length) {
                await this.backendService.reportCommonApi.updateDailyReport(oldResult, result, updateResults.list);
            }
        } catch (exception) {
            console.log(`queryAndupdateDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 操作（增删改）日登记表后更新月统计表
    async updateMonthlyReport(result) {
        try {
            let targetOrgId = result.targetOrg.objectId ? result.targetOrg.objectId : result.targetOrg;
            let parseOrg = new Client.Organization();
            parseOrg.id = targetOrgId;
            // 更新本月中队月统计表
            let allDailyReportResults = await this.getMonthDailyReports(targetOrgId, result.date);
            await this.backendService.reportCommonApi.updateMonthlyL1Report(result, allDailyReportResults);

            // 更新之后的中队月统计表
            let monthL1ReportQuery = new Client.Query(Client.MonthlyReportL1);
            monthL1ReportQuery.equalTo('targetOrg', parseOrg);
            monthL1ReportQuery.equalTo('year', result.date.getFullYear());
            monthL1ReportQuery.greaterThan('month', result.date.getMonth());
            let updateMonthL1Results = await this.backendService.queryListAll('MonthlyReportL1', monthL1ReportQuery);
            if (updateMonthL1Results.list.length) {
                for (let info of updateMonthL1Results.list) {
                    let dailyResults = await this.getMonthDailyReports(targetOrgId, info.date);
                    await this.backendService.reportCommonApi.updateMonthlyL1Report(info, dailyResults);
                }
            }

            // 更新支队当年月统计表 (中队没这个权限去改支队的东西)
            // let monthL1Date = moment(new Date(result.date.getFullYear(), result.date.getMonth(), 1)).add(1, 'months').toDate();
            // let parseParentOrg = new Client.Organization();
            // parseParentOrg.id = result.parentOrg.objectId ? result.parentOrg.objectId : result.parentOrg;
            // let monthL2ReportQuery = new Client.Query(Client.MonthlyReportL2);
            // monthL2ReportQuery.greaterThanOrEqualTo('date', monthL1Date);
            // monthL2ReportQuery.equalTo('organization', parseParentOrg);
            // let updateMonthL2Results = await this.backendService.queryListAll('MonthlyReportL2', monthL2ReportQuery);
            // if (updateMonthL2Results.list.length) {
            //     await this.backendService.reportCommonApi.updateMonthlyL2Report(updateMonthL2Results.list);
            // }
        } catch (exception) {
            console.log(`updateMonthlyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 修改保存或提交中队月统计表（根据提交状态码state判断保存或提交）
    async addOrUpdateMonthlyL1Report(monthly1Report) {
        try {
            let today = await this.backendService.getSystemTime();
            today = this.backendService.reportCommonApi.setDateToZero(today);
            monthly1Report.year = parseInt(monthly1Report.year, 10);
            monthly1Report.month = parseInt(monthly1Report.month, 10);
            let dateStart = new Date(monthly1Report.year, monthly1Report.month, 1);
            monthly1Report.date = moment(dateStart).add(1, 'months').subtract(1, 'days').toDate();
            let targetOrgId = monthly1Report.targetOrg.objectId ? monthly1Report.targetOrg.objectId : monthly1Report.targetOrg;
            let parseOrg = new Client.Organization();
            parseOrg.id = targetOrgId;

            let oldReport = await this.getMonthlyReportL1(monthly1Report.targetOrg, monthly1Report.date);

            if (oldReport.objectId) {
                monthly1Report.objectId = oldReport.objectId;
            }

            if (oldReport.state) {
                if(monthly1Report.state) {
                    throw '请不要重复提交！'
                } else {
                    throw '已提交的数据不能修改！';
                }
            }

            if (monthly1Report.state) {
                if (today.getTime() < moment(monthly1Report.date).add(1, 'days').toDate().getTime()) {
                    throw '请于下月1-3号提交本月月统计表！';
                }

                let unsubmitReportQuery = new Client.Query(Client.MonthlyReportL1);
                unsubmitReportQuery.equalTo('targetOrg', parseOrg);
                unsubmitReportQuery.equalTo('state', SubmitState.Initial);
                unsubmitReportQuery.lessThan('date', monthly1Report.date);
                let unsubmitResult = await unsubmitReportQuery.find(this.backendService.options);
                if (unsubmitResult.length) {
                    throw '此日期之前还有未提交的月统计表，请按顺序提交！';
                }

                let query1 = new Client.Query(Client.DailyReport);
                query1.greaterThanOrEqualTo('date', dateStart);
                query1.lessThanOrEqualTo('date', monthly1Report.date);
                query1.equalTo('targetOrg', parseOrg);
                query1.equalTo('state', SubmitState.Initial);
                let query1Result = await this.backendService.queryListAll('DailyReport', query1);
                if (query1Result.list.length) {
                    throw '您还有未提交的日登记表，请先提交当前月份的所有日登记表！';
                }
            }

            let orgId = monthly1Report.organization.objectId ? monthly1Report.organization.objectId : monthly1Report.organization;
            monthly1Report.mainFlag = (targetOrgId === orgId);

            let org = await this.backendService.fetchItem('Organization', orgId);
            let parentId = org.parentId;
            let parentOrg = await this.backendService.fetchItem('Organization', parentId);
            if (parentOrg.orgType !== '部队') {
                parentId = parentOrg.parentId;
            }
            monthly1Report.parentOrg = parentId;

            let parseReport = Client.MonthlyReportL1.fromObject(monthly1Report);
            let result = await parseReport.save(null, this.backendService.options);
            result = parseUtils.simplifyObject(result.toJSON());

            return result;
        } catch (exception) {
            console.log(`addOrUpdateMonthlyL1Report failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    //中队根据周计划获取课程以及训练时间
    async getLessensbyWeeklyPlan(org,date){
        try {
            let query = new Client.Query(Client.DailyLesson);
            query.equalTo('organization', this.backendService.getParseObject('Organization', org.objectId));
            query.equalTo('date', date);
            let result = await this.backendService.queryListAll('DailyLesson', query)
            return result.list
        }catch (exception) {
            console.log(`getLessensbyWeeklyPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
}

export default ReportService;
