import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import { OrgSequence, IsZhiDui, SubmitState, InServiceStatus } from '../Constants';
import moment from 'moment';

export class RegimentReportService {
    constructor(backend) {
        this.backendService = backend;
    }

    // 获取指定支队指定年份月统计表添加状态(传入年份如2018)
    async getExistedTableMonthByOrgAndDate(org, year) {
        try {
            year = parseInt(year, 10);
            if (isNaN(year)) {
                throw '查询参数有误！';
            }
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let reportState = [];
            let dailyReportQuery = new Client.Query(Client.MonthlyReportL2);
            dailyReportQuery.equalTo('organization', parseOrg);
            dailyReportQuery.equalTo('year', year);
            dailyReportQuery.addDescending('date');
            let reportResults = await this.backendService.queryListAll('MonthlyReportL2', dailyReportQuery);
            if (reportResults.list.length) {
                for (let info of reportResults.list) {
                    reportState.push({
                        date: info.date,
                        state: info.state,
                        timeout: info.timeout
                    });
                }
            }
            console.log(reportState);
            return reportState;
        } catch (exception) {
            console.log(`getExistedTableMonthByOrgAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler)  this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据单位、日期获取月统计表
    async getMonthlyL2Report(org, date) {
        try {
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let year = date.getFullYear();
            let month = date.getMonth();
            let result = {};
            let dailyReportQuery = new Client.Query(Client.MonthlyReportL2);
            dailyReportQuery.equalTo('year', year);
            dailyReportQuery.equalTo('month', month);
            dailyReportQuery.equalTo('organization', parseOrg);
            let reportResult = await dailyReportQuery.find(this.backendService.options);
            if (reportResult.length) {
                result = parseUtils.simplifyObject(reportResult[0].toJSON());
            }
            console.log(result);
            return result;
        } catch (exception) {
            console.log(`getMonthlyL2Report failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler)  this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取最近的月统计表数据(date不传默认当天）
    async getLastMonthlyL2Report(org, date) {
        try {
            let result = {};
            if (!date) {
                date = this.backendService.getSystemTime();
                date = moment(new Date(date.getFullYear(), date.getMonth(), 1)).add(1, 'months').subtract(1, 'days').toDate();
            }
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let reportQuery = new Client.Query(Client.MonthlyReportL2);
            reportQuery.lessThan('date', date);
            reportQuery.equalTo('year', date.getFullYear());
            reportQuery.equalTo('organization', parseOrg);
            reportQuery.addDescending('date');
            reportQuery.limit(1);
            let reportResult = await reportQuery.find(this.backendService.options);
            if (reportResult.length) {
                result = parseUtils.simplifyObject(reportResult[0].toJSON());
            }
            console.log(result);
            return result;
        } catch (exception) {
            console.log(`getLastMonthlyL2Report failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler)  this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 初始化月统计表前日期及单位判断(不传入日期则默认日期为上月最后一天）(本月只允许创建上月月统计表，其他为补登记）
    // 抛异常或返回未提交月统计表的中队单位信息数组或返回空数组
    async judgeOrgAndDateIsOk(organization, date, timeoutFlag) {
        try {
            let result = [];
            // 组织信息处理,非团/支队不允许创建
            let org = organization;
            if (_.isString(org)) {
                org = await this.backendService.fetchItem('Organization', org);
            }

            if (!IsZhiDui(org.orgSequence)) {
                return '非支队单位不允许创建月统计表！';
            }

            // date判断
            let today = this.backendService.getSystemTime();
            let dateEnd = moment(today).startOf('month').toDate();
            let dateStart = moment(dateEnd).subtract(1, 'days').toDate();

            if (!date) {
                date = dateStart;
            }

            date = moment(date).endOf('month').toDate();

            if ((date.getTime() > dateEnd.getTime()) && dateEnd.getMonth() !== 11) {
                return '只能创建本月之前的月统计表！';
            }
            // if (date.getFullYear() < dateEnd.getFullYear()) {
            //     return '只能补登记本年的月统计表！'
            // }

            // else if (date.getTime() < moment(dateEnd).subtract(1, 'months').toDate().getTime() && !timeoutFlag) {
            //     throw '本月只允许创建上月月统计表！';
            // }

            let month = date.getMonth();
            let year = date.getFullYear();
            date = moment(new Date(year, month, 1)).add(1, 'months').subtract(1, 'days').toDate();

            // 获取支队下需提交月统计表的分队总数
            let monthlyL1ReportInfo = await this.backendService.reportCommonApi.getAllCompanybyParentId(organization.objectId);

            // 获取已提交的所有分队月统计表
            let tableList = [];
            for (let org of monthlyL1ReportInfo.list) {
                let list = await this.backendService.reportCommonApi.getAllMonthlyL1ReportByParentOrgAndDate(org.objectId, date);
                tableList = tableList.concat(list.list);
            }
            const orgIds = tableList.map(item => item.targetOrg.objectId);

            return monthlyL1ReportInfo.list.filter(org => !orgIds.includes(org.objectId));
        } catch (exception) {
            console.log(`judgeOrgAndDateIsOk failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler)  this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 初始化支队月统计表信息
    async makeInitialMonthL2Report(organization, date) {
        try {
            let org = organization;
            if (_.isString(org)) {
                org = await this.backendService.fetchItem('Organization', org);
            }

            let dateEnd = moment([date.getFullYear(),date.getMonth()]).add(1,'months').subtract(1,'days').toDate();

            let queryResult = await this.getMonthlyL2Report(org, dateEnd);
            if (!(_.isEmpty(queryResult))) {
                console.log(111,queryResult);
                return queryResult;
            }

            // 获取支队表格信息
            let report = await this.backendService.reportCommonApi.getMonthlyL2ReportByOrgAndDate(org, dateEnd);
            // console.log(222,report);
            return report;
        } catch (exception) {
            console.log(`makeInitialDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler)  this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 修改保存或提交支队月统计表（根据提交状态码state判断保存或提交）
    async addOrUpdateMonthlyL2Report(monthly2Report) {
        try {
            if (_.isEmpty(monthly2Report)) {
                throw '参数错误！';
            }
            let today = this.backendService.getSystemTime();
            monthly2Report.year = parseInt(monthly2Report.year, 10);
            monthly2Report.month = parseInt(monthly2Report.month, 10);
            let dateStart = new Date(monthly2Report.year, monthly2Report.month, 1);
            // monthly2Report.date = moment(dateStart).add(1, 'months').subtract(1, 'days').toDate();
            monthly2Report.date = moment(dateStart).endOf('months').toDate();
            let orgId = monthly2Report.organization.objectId ? monthly2Report.organization.objectId : monthly2Report.organization;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;

            let oldReport = await this.getMonthlyL2Report(monthly2Report.organization, monthly2Report.date);

            if (oldReport.objectId) {
                monthly2Report.objectId = oldReport.objectId;
            }

            if (oldReport.state) {
                if(monthly2Report.state) {
                    throw '请不要重复提交！'
                } else {
                    throw '已提交的数据不能修改！';
                }
            }

            if (monthly2Report.state) {
                if (today.getTime() < moment(monthly2Report.date).add(1, 'days').toDate().getTime()) {
                    throw '只能创建本月之前的月统计表！';
                }
                let unsubmitReportQuery = new Client.Query(Client.MonthlyReportL2);
                unsubmitReportQuery.equalTo('organization', parseOrg);
                unsubmitReportQuery.equalTo('state', SubmitState.Initial);
                unsubmitReportQuery.lessThan('date', monthly2Report.date);
                let unsubmitResult = await unsubmitReportQuery.find(this.backendService.options);
                if (unsubmitResult.length) {
                    throw '此日期之前还有未提交的月统计表，请按顺序提交！';
                }
            }

            let org = await this.backendService.fetchItem('Organization', orgId);
            let parentId = org.parentId;
            let parentOrg = await this.backendService.fetchItem('Organization', parentId);
            if (parentOrg.orgType !== '部队') {
                parentId = parentOrg.parentId;
            }
            monthly2Report.parentOrg = parentId;

            if (monthly2Report.bulletStatOffice.trainAverage) {
                monthly2Report.bulletStatOffice.soldierNumber = Math.round(Number((Number(monthly2Report.bulletStatOffice.train) / Number(monthly2Report.bulletStatOffice.trainAverage)).toFixed(1)))
            }

            let parseReport = Client.MonthlyReportL2.fromObject(monthly2Report);
            let result = await parseReport.save(null, this.backendService.options);
            result = parseUtils.simplifyObject(result.toJSON());

            // 更新此日期之后的支队月统计表
            let monthL2ReportQuery = new Client.Query(Client.MonthlyReportL2);
            monthL2ReportQuery.greaterThan('date', result.date);
            monthL2ReportQuery.equalTo('organization', parseOrg);
            let updateMonthL2Results = await this.backendService.queryListAll('MonthlyReportL2', monthL2ReportQuery);
            if (updateMonthL2Results.list.length) {
                let monthL2List = updateMonthL2Results.list;
                await this.backendService.reportCommonApi.updateLeadOffice(oldReport, result, monthL2List, 'MonthlyReportL2');
            }

            console.log(result);
            return result;
        } catch (exception) {
            console.log(`addOrUpdateMonthlyL2Report failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler)  this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updateAllMonthReport(org,year) {
        try {
            let orgId = org.objectId ? org.objectId : org;

            let query = new Client.Query("MonthlyReportL2");
            query.equalTo('organization', this.backendService.getParseObject("Organization",orgId));
            query.equalTo('year', year);
            query.lessThanOrEqualTo('date', moment().endOf("year").toDate());
            let result = await this.backendService.queryListAll('MonthlyReportL2', query);

            if(result.total) {
                let sortedReports = _.sortBy(result.list, 'month');
                for(let monthReport of sortedReports) {

                    // 获取支队下需提交月统计表的分队总数
                    let result = await this.backendService.reportCommonApi.getAllCompanybyParentId(orgId);
                    // 获取已提交的所有分队月统计表
                    let tableList = [];
                    for (let org of result.list) {
                        let list = await this.backendService.reportCommonApi.getAllMonthlyL1ReportByParentOrgAndDate(org.objectId, moment(monthReport.date).startOf("day").toDate());
                        tableList = tableList.concat(list.list);
                    }
                    const orgIds = tableList.map(item => item.targetOrg.objectId);
                    let uncommittedOrgs = result.list.filter(org => !orgIds.includes(org.objectId));
                    if(!_.isEmpty(uncommittedOrgs)) {
                        throw uncommittedOrgs.map(org => org.displayName).join('、') + `${year}年${monthReport.month + 1}月` + '统计未提交';
                    }
                    let newRecord = await this.backendService.reportCommonApi.getMonthlyL2ReportByOrgAndDate(orgId, moment(monthReport.date).startOf("day").toDate());
                    let newMonthReport = {
                        objectId: monthReport.objectId,
                        //state: 0,
                        bulletStat: newRecord.bulletStat,
                        motorStat: newRecord.motorStat
                    };
                    if(monthReport.month === 11) {
                        newMonthReport.evaluatedScore = newRecord.evaluatedScore;
                        newMonthReport.trainerStatistic = newRecord.trainerStatistic;
                        newMonthReport.placeStatistic = newRecord.placeStatistic;
                    }

                    await this.backendService.addOrUpdateItem("MonthlyReportL2",newMonthReport);
                }

            }

        } catch (exception) {
            console.log(`updateAllMonthReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
}

export default RegimentReportService;
