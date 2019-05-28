import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import { OrgSequence, SubmitState, InServiceStatus } from '../Constants';
import moment from 'moment';

export class QuarterReportService {
    constructor(backend) {
        this.backendService = backend;
    }

    // 获取总队指定年份季度统计表添加状态(数字1~4）
    async getExistedTableQuarterByOrgAndDate(org, year) {
        try {
            year = parseInt(year, 10);
            if (isNaN(year)) {
                throw '查询参数有误！';
            }
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let reportState = [];
            let dailyReportQuery = new Client.Query(Client.QuarterReport);
            dailyReportQuery.equalTo('organization', parseOrg);
            dailyReportQuery.equalTo('year', year);
            dailyReportQuery.addDescending('date');
            let reportResults = await this.backendService.queryListAll('QuarterReport', dailyReportQuery);
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
            console.log(`getExistedTableQuarterByOrgAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据单位、日期获取季度统计表
    async getQuarterReport(org, year, quarter) {
        try {
            year = parseInt(year, 10);
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let result = {};
            let dailyReportQuery = new Client.Query(Client.QuarterReport);
            dailyReportQuery.equalTo('year', year);
            dailyReportQuery.equalTo('quarter', quarter);
            dailyReportQuery.equalTo('organization', parseOrg);
            let reportResult = await dailyReportQuery.find(this.backendService.options);
            if (reportResult.length) {
                result = parseUtils.simplifyObject(reportResult[0].toJSON());
            }
            console.log(result);
            return result;
        } catch (exception) {
            console.log(`getQuarterReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取最近的季度统计表数据(date不传默认当天）
    async getLastQuarterReport(org, date, refresh) {
        try {
            let result = {};
            if (!date) {
                date = this.backendService.getSystemTime();
                date = this.backendService.reportCommonApi.setDateToZero(date);
            }
            let orgId = org.objectId ? org.objectId : org;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let reportQuery = new Client.Query(Client.QuarterReport);
            reportQuery.lessThanOrEqualTo('date', date);
            if (refresh) {
                reportQuery.lessThanOrEqualTo('date', moment(date).subtract(1, 'months').toDate());
            }
            reportQuery.equalTo('year', date.getFullYear());

            if (moment(date).subtract(1, 'months').toDate().getMonth() > 10) {
                reportQuery.equalTo('year', date.getFullYear()-1);
            }

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
            console.log(`getLastQuarterReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 初始化支队月统计表信息
    async makeInitialQuarterReport(organization, year, quarter, timeoutFlag) {
        try {
            let judgeResult = await this.backendService.reportCommonApi.judgeOrgAndDateIsOk(organization, year, quarter, timeoutFlag);
            //
            // let org = organization;
            // if (_.isString(org)) {
            //     org = await this.backendService.fetchItem('Organization', org);
            // }
            //
            // let month = 0;
            // if (quarter === 1) {
            //     month = 2;
            // } else if (quarter === 2) {
            //     month = 5;
            // } else if (quarter === 3) {
            //     month = 8;
            // } else {
            //     month = 11;
            // }
            //
            // let date = moment(new Date(year, month, 1)).add(1, 'months').subtract(1, 'days').toDate();
            //
            // let judgeResult = {
            //     organization: org,
            //     year: year,
            //     month: month,
            //     quarter: quarter,
            //     date: date
            // };
            //
            if (typeof judgeResult === 'string') {
                throw judgeResult;
            }
            let queryResult = await this.getQuarterReport(judgeResult.organization, judgeResult.year, judgeResult.quarter);
            if (!(_.isEmpty(queryResult))) {
                console.log(queryResult);
                return queryResult;
            }

            let report = await this.backendService.reportCommonApi.getQuarterReportByOrgAndDate(judgeResult);

            console.log(report);
            return report;
        } catch (exception) {
            console.log(`makeInitialQuarterReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 修改保存或提交总队季度统计表（根据提交状态码state判断保存或提交）
    async addOrUpdateQuarterReport(quarterReport) {
        try {
            if (_.isEmpty(quarterReport)) {
                throw '参数错误！';
            }
            let today = this.backendService.getSystemTime();
            quarterReport.year = parseInt(quarterReport.year, 10);
            quarterReport.month = parseInt(quarterReport.month, 10);
            let dateStart = new Date(quarterReport.year, quarterReport.month, 1);
            // quarterReport.date = moment(dateStart).add(1, 'months').subtract(1, 'days').toDate();
            quarterReport.date = moment(dateStart).endOf("month").toDate();
            let parseOrg = new Client.Organization();
            parseOrg.id = quarterReport.organization.objectId ? quarterReport.organization.objectId : quarterReport.organization;

            let oldReport = await this.getQuarterReport(quarterReport.organization, quarterReport.year, quarterReport.quarter);

            if (oldReport.objectId) {
                quarterReport.objectId = oldReport.objectId;
            }

            if (oldReport.state) {
                if(quarterReport.state) {
                    throw '请不要重复提交！'
                } else {
                    throw '已提交的数据不能修改！';
                }
            }

            if (quarterReport.state) {
                if (today.getTime() < moment(quarterReport.date).add(1, 'days').toDate().getTime()) {
                    throw '请于下季度1-10号提交本季度的季度统计表！';
                }
                let unsubmitReportQuery = new Client.Query(Client.QuarterReport);
                unsubmitReportQuery.equalTo('organization', parseOrg);
                unsubmitReportQuery.equalTo('state', SubmitState.Initial);
                unsubmitReportQuery.lessThan('date', quarterReport.date);
                let unsubmitResult = await unsubmitReportQuery.find(this.backendService.options);
                if (unsubmitResult.length) {
                    throw '此日期之前还有未提交的季度统计表，请按顺序提交！';
                }
            }

            if (quarterReport.bulletStatOffice.trainAverage) {
                quarterReport.bulletStatOffice.soldierNumber = Math.round(Number((Number(quarterReport.bulletStatOffice.train) / Number(quarterReport.bulletStatOffice.trainAverage)).toFixed(1)))
            }

            let parseReport = Client.QuarterReport.fromObject(quarterReport);
            let result = await parseReport.save(null, this.backendService.options);
            result = parseUtils.simplifyObject(result.toJSON());

            // 更新此日期之后的总队季度统计表
            let quarterReportQuery = new Client.Query(Client.QuarterReport);
            quarterReportQuery.greaterThan('date', result.date);
            quarterReportQuery.equalTo('organization', parseOrg);
            let updateQuarterResults = await this.backendService.queryListAll('QuarterReport', quarterReportQuery);
            if (updateQuarterResults.list.length) {
                let quarterList = updateQuarterResults.list;
                await this.backendService.reportCommonApi.updateLeadOffice(oldReport, result, quarterList, 'QuarterReport');
            }

            console.log(result);
            return result;
        } catch (exception) {
            console.log(`addOrUpdateQuarterReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updateAllQuartReport(org,year) {
        try {
            let orgId = org.objectId ? org.objectId : org;

            let query = new Client.Query("QuarterReport");
            query.equalTo('organization', this.backendService.getParseObject("Organization",orgId));
            query.equalTo('year', year);
            query.lessThanOrEqualTo('date', moment().endOf("year").toDate());
            let result = await this.backendService.queryListAll('QuarterReport', query);

            if(result.total) {
                let sortedReports = _.sortBy(result.list, 'quarter');
                for(let quarterReport of sortedReports) {
                    let timeObj = {
                        organization: orgId,
                        year: year,
                        month: quarterReport.month,
                        quarter: quarterReport.quarter,
                        date:  moment(new Date(year, quarterReport.month, 1)).add(1, 'months').toDate()
                    };
                    // 获取需提交月统计表的支队总数
                    let monthlyL2ReportInfo = await this.backendService.reportCommonApi.getAllRegimentByParentId(timeObj.organization);

                    // 获取已提交的所有支队月统计表
                    let tableInfo = await this.backendService.reportCommonApi.getAllMonthlyL2ReportByParentOrgAndDate(timeObj.organization, timeObj.date);

                    let orgArr = monthlyL2ReportInfo.list.map(item => item.displayName);
                    // console.log(orgArr);
                    let arr1 = [], arr2 = [], arr3 = [];

                    tableInfo.list.map(item => {
                        if (item.month === timeObj.month) {
                            arr1.push(item.organization.displayName);
                        }
                        if (item.month === timeObj.month - 1) {
                            arr2.push(item.organization.displayName);
                        }
                        if (item.month === timeObj.month - 2) {
                            arr3.push(item.organization.displayName);
                        }
                    });
                    if (monthlyL2ReportInfo.total > Math.min(arr1.length, arr2.length, arr3.length)) {
                        // let uncommittedOrgs = [];
                        let uncommittedOrgs  = _.union(_.xor(orgArr, arr1), _.xor(orgArr, arr2),  _.xor(orgArr, arr3));

                        // console.log(uncommittedOrgs.join('、') + '的' + `${year}年第${quarter}季度` + '月统计未提交完全');
                        throw uncommittedOrgs.join('、') + '的' + `${year}年第${timeObj.quarter}季度` + '月统计未提交完全';
                        // return '请先提交所有的支队月统计表！';
                    }

                    let newRecord = await this.backendService.reportCommonApi.getQuarterReportByOrgAndDate(timeObj, 1); //1表示刷新操作的标注
                    let newQuarterReport = {
                        objectId: quarterReport.objectId,
                        // state: 0,
                        bulletStat: newRecord.bulletStat,
                        motorStat: newRecord.motorStat,
                    };
                    if(quarterReport.month === 11) {
                        newQuarterReport.evaluatedScore = newRecord.evaluatedScore;
                        newQuarterReport.trainerStatistic = newRecord.trainerStatistic;
                        newQuarterReport.placeStatistic = newRecord.placeStatistic;
                    }

                    await this.backendService.addOrUpdateItem("QuarterReport",newQuarterReport);
                }

            }
        } catch (exception) {
            console.log(`updateAllQuartReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

}

export default QuarterReportService;
