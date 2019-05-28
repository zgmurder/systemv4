import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import {CourseCategory, DailySection, OrgSequence, PersonProperty, SubmitState} from '../Constants';
import moment from 'moment';


export class OfficeReportService {
    constructor(backend) {
        this.backendService = backend;
    }

// 初始化日登记表信息（不传入date则默认创建当天日登记表）
    async getInitialDailyReport(organization, date) {
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

            if (date.getTime() > today.getTime()) {
                throw '不允许创建日期超过今天的登记表！';
            }
            // if (date.getTime() < moment().startOf('year').toDate()) {
            //     throw '不允许补登记当年之前的日登记表！';
            // }


            // 查询日登记表是否已创建，已创建则直接返回查询数据
            let queryResult = await this.getDailyReport(org, date);
            if (!(_.isEmpty(queryResult))) {
                return queryResult;
            }

            // 获取首长机关表格信息
            let report = await this.backendService.reportCommonApi.getTableInfoByOrgAndDate(org, date);
            report.mainFlag = true;
            report.organization = org;


            // 获取首长机关--支队长or司令员
           // report.commander = await this.backendService.reportCommonApi.getSoldierNameByPosition(org.objectId, '中队长');


            return report;
        } catch (exception) {
            console.log(`getInitialDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    // 根据单位、日期获取日登记表
    async getDailyReport(org, date) {
        try {
            if (_.isEmpty(org)) {
                org = this.backendService.getCurrentOrganization();
            }
            let orgId = _.isString(org)?org:org.objectId;
            let parseOrg =  this.backendService.getParseObject('Organization', orgId);
            date = this.backendService.reportCommonApi.setDateToZero(date);
            let query = new Client.Query(Client.DailyReport);
            query.equalTo('date', date);
            query.equalTo('organization', parseOrg);
            let result = await this.backendService.queryListAll('DailyReport', query);
            return result.list;
        } catch (exception) {
            console.log(`getDailyReport failed! exception:${exception}`);
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
                let oldReport = await this.getDailyReport(report.organization, report.date);
                if(_.isEmpty(oldReport)){
                    oldReport = {}
                }else{
                    oldReport = oldReport[0];
                }
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

                //判断改日前是否还有未提交表，按顺序提交
                let parseOrg = {};
                if (_.isString(report.organization)) {
                    parseOrg =  this.backendService.getParseObject('Organization', report.organization);
                }else{
                    parseOrg =  this.backendService.getParseObject('Organization', report.organization.objectId);
                }
                // if (report.state) {
                //     let query = new Client.Query(Client.DailyReport);
                //     query.equalTo('organization', parseOrg);
                //     query.equalTo('state', SubmitState.Initial);
                //     query.lessThan('date', report.date);
                //     let unSubmitted = await this.backendService.queryListAll('DailyReport', query);
                //     if (unSubmitted.total) {
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

                // 判断此日期之后是否有已创建或提交的日登记表,更新之后的登记表
                let query2 = new Client.Query(Client.DailyReport);
                query2.lessThan('date', new Date(result.date.getFullYear()+1,0));
                query2.greaterThan('date', result.date);
                query2.equalTo('organization', parseOrg);
                let updateResults = await this.backendService.queryListAll('DailyReport', query2);
                if (updateResults.list.length) {
                    await this.backendService.reportCommonApi.updateDailyReport(oldReport, result, updateResults.list);
                }

                let query = new Client.Query(Client.MonthlyReportL2);
                query.equalTo('year', result.date.getFullYear());
                query.equalTo('month', result.date.getMonth());
                query.equalTo('organization', parseOrg);
                let updateMonthResult = await  this.backendService.queryListAll('MonthlyReportL2',query);
                if(updateMonthResult.total){
                    await this.updateOfficeMonthReport(result);
                }

                query = new Client.Query(Client.QuarterReport);
                query.equalTo('year', result.date.getFullYear());
                query.equalTo('quarter', Math.floor(result.date.getMonth()/3)+1);
                query.equalTo('organization', parseOrg);
                let updateQuarterResult = await  this.backendService.queryListAll('QuarterReport',query);
                if(updateQuarterResult.total){
                    await this.updateOfficeQuarterReport(result);
                }

              //  console.log(result);
                return result;
            }
        } catch (exception) {
            console.log(`addOrUpdateDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    async updateOfficeQuarterReport(result){
        try{
            let targetOrgId = result.targetOrg.objectId ? result.targetOrg.objectId : result.targetOrg;
            let thisQuarter = Math.floor(result.date.getMonth()/3)+1;
            let quarterOfficeStatistic = await this.backendService.reportCommonApi.getQuarterOfficeStatistic(result.organization,new Date(result.date.getFullYear(),thisQuarter*3-1));
            let reportInfo = await this.backendService.quarterReportService.getQuarterReport(result.organization, result.date.getFullYear(),thisQuarter);
            let temp = _.cloneDeep(reportInfo);
            reportInfo.trainContent = quarterOfficeStatistic.trainContent;
            reportInfo.timeStatistic = quarterOfficeStatistic.timeStatistic;
            reportInfo.bulletStatOffice = quarterOfficeStatistic.bulletStatOffice;
            await this.backendService.addOrUpdateItem('QuarterReport',reportInfo);
            let increment = {
                time:reportInfo.timeStatistic.totalHours - temp.timeStatistic.totalHours,
                train:reportInfo.bulletStatOffice.totalTrain - temp.bulletStatOffice.totalTrain,
                average:reportInfo.bulletStatOffice.totalTrainAverage - temp.bulletStatOffice.totalTrainAverage
            };

            // 更新之后的总队季度统计表
            let query = new Client.Query(Client.QuarterReport);
            query.equalTo('organization', this.backendService.getParseObject('Organization',targetOrgId));
            query.equalTo('year', result.date.getFullYear());
            query.greaterThan('quarter', thisQuarter);
            query.addAscending('quarter');
            let updateQuarterResults = await this.backendService.queryListAll('QuarterReport', query);
            if (updateQuarterResults.total) {
                for (let info of updateQuarterResults.list) {
                    info.timeStatistic.totalHours += increment.time;
                    info.bulletStatOffice.totalTrain += increment.train;
                    info.bulletStatOffice.totalTrainAverage += increment.average;
                    // console.log(8888,info);
                }
                await this.backendService.addOrUpdateList('QuarterReport',updateQuarterResults.list);
            }
        }catch (exception) {
            console.log(`updateOfficeQuarterReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    //支队首长机关日登记表数据变化更新其对应月统计表
    async updateOfficeMonthReport(result){
        try{
            let targetOrgId = result.targetOrg.objectId ? result.targetOrg.objectId : result.targetOrg;

            // 更新本月支队月统计表
            // 查询支队最近的月统计表数据
            let lastReportInfo = await this.backendService.regimentReportService.getLastMonthlyL2Report(result.organization, result.date);
            if (_.isEmpty(lastReportInfo)) {
                lastReportInfo = null;
            }
            let officeStatistic = await this.backendService.reportCommonApi.getOfficeStatistic(lastReportInfo,result.organization,result.date);
            let reportInfo = await this.backendService.regimentReportService.getMonthlyL2Report(result.organization, result.date);
            let temp = _.cloneDeep(reportInfo);
            reportInfo.trainContent = officeStatistic.trainContent;
            reportInfo.timeStatistic = officeStatistic.timeStatistic;
            reportInfo.bulletStatOffice = officeStatistic.bulletStatOffice;
            await this.backendService.addOrUpdateItem('MonthlyReportL2',reportInfo);

            let increment = {
                time:reportInfo.timeStatistic.totalHours - temp.timeStatistic.totalHours,
                train:reportInfo.bulletStatOffice.totalTrain - temp.bulletStatOffice.totalTrain,
                average:reportInfo.bulletStatOffice.totalTrainAverage - temp.bulletStatOffice.totalTrainAverage
            };
            // 更新之后的支队月统计表
            let monthL2ReportQuery = new Client.Query(Client.MonthlyReportL2);
            monthL2ReportQuery.equalTo('organization', this.backendService.getParseObject('Organization',targetOrgId));
            monthL2ReportQuery.equalTo('year', result.date.getFullYear());
            monthL2ReportQuery.greaterThan('month', result.date.getMonth());
            monthL2ReportQuery.addAscending('month');
            let updateMonthL2Results = await this.backendService.queryListAll('MonthlyReportL2', monthL2ReportQuery);
            if (updateMonthL2Results.total) {
                for (let info of updateMonthL2Results.list) {
                    info.timeStatistic.totalHours += increment.time;
                    info.bulletStatOffice.totalTrain += increment.train;
                    info.bulletStatOffice.totalTrainAverage += increment.average;
                // console.log(8888,info);
                }
                await this.backendService.addOrUpdateList('MonthlyReportL2',updateMonthL2Results.list);
            }
        }catch(exception){
            console.log(`updateOfficeMonthReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
}
export default OfficeReportService;
