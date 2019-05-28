import Client from '../Client';
import { PersonProperty, SubmitState, OrgSequence, OrgType, InServiceStatus, GunnerType, ScoreLevel } from '../Constants';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import moment from 'moment';

export class ReportCommonApi {
    constructor(backend) {
        this.backendService = backend;
    }

    getEnglishByGivenChinese(key, obj) {
        for (let type in obj) {
            if (obj.hasOwnProperty(type)) {
                if (obj[type] === key) {
                    return type;
                }
            }
        }
    }

    // 日期时分秒归零便于统一存储
    setDateToZero(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    init(obj) {
        obj.personStat = {};
        obj.contentStat = {};
        obj.timeStat = [];
        obj.bulletStat = [];
        obj.motorStat = [];
        return obj;
    }

    initMonthlyReport(obj) {
        obj.timeStat = [];
        obj.bulletStat = [];
        obj.motorStat = [];
        return obj;
    }

    initMonthlyL2Report(obj) {
        obj.trainContent = [];
        obj.timeStatistic ={};
        obj.bulletStatOffice = [];
        obj.bulletStat = [];
        obj.motorStat = [];
        return obj;
    }

    // 获取给定单位给定职务人员name
    async getSoldierNameByPosition(orgId, position) {
        try {
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let soldQuery = new Client.Query(Client.Soldier);
            soldQuery.equalTo('organization', parseOrg);
            soldQuery.equalTo('inserviceStatus', InServiceStatus.InService);
            soldQuery.equalTo('position', position);
            let result = await this.backendService.queryList('Soldier', soldQuery);
            // let soldierResult = await soldQuery.find(this.backendService.options);
            // if (soldierResult.length) {
            //     soldierResult = parseUtils.simplifyObject(soldierResult[0].toJSON());
            //     name = soldierResult.name;
            // }
            return (result.list[0]||{}).name;
        } catch (exception) {
            console.log(`getSoldierNameByPosition failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据登记表日期获取中队实力数(区分中队和应急班、特战排）
    async getCompanySoldierNumberByOrgIdAndDate(org, date) {
        try {
            let numberQuery = new Client.Query(Client.Soldier);
            numberQuery.equalTo('inserviceStatus', InServiceStatus.InService);
            // numberQuery.lessThan('joinedAt', date);
            numberQuery.include('organization');

            // const result = await this.backendService.queryListAll('Soldier', numberQuery);
            const result = await this.backendService.soldierService.querySoldierList({soldierQuery: numberQuery,orgId:org.objectId});
            const soldiers = result.list.filter(item => item.organization.orgCategory === org.orgCategory);
            return soldiers.length;
        } catch (exception) {
            console.log(`getCompanySoldierNumberByOrgIdAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据统计表日期及单位ID获取首长机关实力数
    async getOfficeSoldierNumberByOrgIdAndDate(orgId, date) {
        try {
            date = moment(date).add(1, 'days').toDate();
            let orgIds = [];
            let orglist = await this.backendService.orgService.getLocalOrganizations(orgId);
            orglist.map(item => {
                orgIds.push(item.objectId);
            });
            let numberQuery = new Client.Query(Client.Soldier);
            numberQuery.equalTo('personProperty', '警官');
            numberQuery.equalTo('inserviceStatus', InServiceStatus.InService);
            // numberQuery.lessThan('joinedAt', date);
            let orgQuery = new Client.Query(Client.Organization);
            orgQuery.containedIn('objectId', orgIds);
            numberQuery.matchesQuery('organization', orgQuery);
            let result = await this.backendService.queryListAll('Soldier', numberQuery);
            return result.list.length;
        } catch (exception) {
            console.log(`getOfficeSoldierNumberByOrgIdAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据组织类型（orgCategory）获取弹药/摩托要求
    async getRequirementByOrgCategory(key, orgCategory) {
        try {
            let numberQuery = new Client.Query(Client[key]);
            numberQuery.equalTo('orgCategory', orgCategory);
            let result = await this.backendService.queryListAll(key, numberQuery);
            return result.list;
        } catch (exception) {
            console.log(`getRequirementByOrgCategory failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    };

    // 根据组织及军械类型（ordnanceTypes）获取人员要求
    // async getNumberByOrgCategoryAndOrdnanceType(org, ordnanceTypes, numberInfo) {
    //     try {
    //         console.log(`getNumberByOrgCategoryAndOrdnanceType:`, ordnanceTypes);
    //         console.log(`getNumberByOrgCategoryAndOrdnanceType:`, numberInfo);
    //         let typeNumber = {};
    //         if (_.isEmpty(numberInfo)) {
    //             return typeNumber;
    //         }
    //         let soldierTypes = {};
    //         ordnanceTypes.map(item => {
    //             soldierTypes[item] = {};
    //             soldierTypes[item].personProperty =[];
    //         });
    //         let numberQuery = new Client.Query(Client.Course);
    //         numberQuery.containedIn('ordnanceTypes', ordnanceTypes);
    //         numberQuery.containedIn('orgCategories', [org.orgCategory]);
    //         let results = await this.backendService.queryListAll('Course', numberQuery);
    //         for (let result of  results.list) {
    //             for (let type of result.ordnanceTypes) {
    //                 if (soldierTypes[type]) {
    //                     for (let property of  result.personProperties) {
    //                         if (soldierTypes[type].personProperty.indexOf(property) === -1) {
    //                             soldierTypes[type].personProperty.push(property);
    //                         }
    //                     }
    //                     if (result.gunnerType) {
    //                         soldierTypes[type].gunnerType = result.gunnerType;
    //                     }
    //                 }
    //             }
    //         }
    //         for (let type in soldierTypes) {
    //             typeNumber[type] = 0;
    //             for (let personType of soldierTypes[type].personProperty) {
    //                 personType = this.getEnglishByGivenChinese(personType, PersonProperty);
    //                 if (soldierTypes[type].gunnerType) {
    //                     let gunnerType = this.getEnglishByGivenChinese(soldierTypes[type].gunnerType, GunnerType);
    //                     if (personType === 'Officer') {
    //                         typeNumber[type] += (parseInt(numberInfo[personType], 10) ? parseInt(numberInfo[personType], 10) : 0);
    //                     } else {
    //                         typeNumber[type] += (parseInt(numberInfo[personType][gunnerType], 10) ? parseInt(numberInfo[personType][gunnerType], 10) : 0);
    //                     }
    //                 } else {
    //                     if (personType === 'Officer') {
    //                         typeNumber[type] += (parseInt(numberInfo[personType], 10) ? parseInt(numberInfo[personType], 10) : 0);
    //                     } else {
    //                         typeNumber[type] += (parseInt(numberInfo[personType].Total, 10) ? parseInt(numberInfo[personType].Total, 10) : 0);
    //                     }
    //                 }
    //             }
    //         }
    //
    //         console.log(`getNumberByOrgCategoryAndOrdnanceType:`, typeNumber)
    //         return typeNumber;
    //     } catch (exception) {
    //         console.log(`getNumberByOrgCategoryAndOrdnanceType failed! exception:${exception}`);
    //         let result = parseUtils.getErrorMessage(exception);
    //         if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
    //         throw result;
    //     }
    // };

    // 获取最近的表数据(targetOrg)
    async getLastReport(orgId, date, key) {
        try {
            let report = null;
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let reportQuery = new Client.Query(Client[key]);
            reportQuery.lessThanOrEqualTo('date', date);
            reportQuery.equalTo('targetOrg', parseOrg);
            reportQuery.addDescending('date');
            reportQuery.limit(1);
            let reportResult = await reportQuery.find(this.backendService.options);
            if (reportResult.length) {
                let getReport = parseUtils.simplifyObject(reportResult[0].toJSON());
                if (getReport.date.getFullYear() === date.getFullYear()) {
                    report = getReport;
                }
            }
            return report;
        } catch (exception) {
            console.log(`getLastReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取日登记表原始数据
    async getTableInfoByOrgAndDate(org, date){
        try {
            // 查询中队上一个日登记表数据
            let lastReportInfo = await this.getLastReport(org.objectId, date, 'DailyReport');

            // 初始化表格信息
            let result = {};
            result = this.init(result);

            // 目标组织信息添加
            result.targetOrg = org;

            // 日期信息添加
            result.date = date;

            // 获取实力数
            let total = 0;
            if(org.orgSequence < OrgSequence.Battalion){
                total = await this.getOfficeSoldierNumberByOrgIdAndDate(org, date);
            }else{
                total = await this.getCompanySoldierNumberByOrgIdAndDate(org, date);
            }
            result.personStat = {
                total: total,
                present: 0,
                presentRate: 0,
                notes: ''
            };

            // 获取训练内容
            result.contentStat = {
                earlyMoring: [],
                morning: [],
                afternoon: [],
                sport: [],
                night: []
            };

            // 设置填写人
            result.createdBy = '';

            let index = -1;

            // 获取累计训练时间
            let timeStat = [];
            let soldierType = [PersonProperty.Soldier, PersonProperty.Officer, PersonProperty.Supporter];
            if(org.orgSequence < OrgSequence.Battalion){
                soldierType = [PersonProperty.Officer];
            }
            soldierType.map(ele =>
                lastReportInfo && (index = lastReportInfo.timeStat.findIndex(item => item.type === ele)) >= 0 ?
                timeStat.push({
                type: ele,
                hoursInDay: 0,
                hoursAtNight: 0,
                totalHoursInDay: Number(lastReportInfo.timeStat[index].totalHoursInDay),
                totalHoursAtNight: Number(lastReportInfo.timeStat[index].totalHoursAtNight)
            }) : timeStat.push({
                    type: ele,
                    hoursInDay: 0,
                    hoursAtNight: 0,
                    totalHoursInDay: 0,
                    totalHoursAtNight: 0
                }));

            result.timeStat = timeStat;

            // 获取训练弹药信息
            let resultBulletInfo = await this.getRequirementByOrgCategory('BulletRequirement', org.orgCategory);
            if(org.orgSequence < OrgSequence.Battalion){
                resultBulletInfo = await this.getRequirementByOrgCategory('BulletRequirement', !org.orgCategory.includes('首长机关') && org.orgCategory+"首长机关" || org.orgCategory);
            }
            let majorType = '其他勤务分队';
            if (org.serviceType === '看守看押勤务') {
                majorType = '“两看”勤务分队';
            }
            resultBulletInfo = resultBulletInfo.filter(function (ele) {
                return ele.majorType !== majorType;
            });

            let resultBulletTypes = [];
            for (let info of resultBulletInfo) {
                resultBulletTypes.push(info.ordnanceType);
            }

            // let soldierNumberInfo = await this.getNumberByOrgCategoryAndOrdnanceType(org, resultBulletTypes, resultNumberInfo);

            let bulletStat = [];
            resultBulletTypes.map(ele => {
                // let soldierNumber = soldierNumberInfo[ele] ? Number(soldierNumberInfo[ele]) : 0;
                // if(org.orgSequence < OrgSequence.Battalion){
                //     soldierNumber = total;
                // }
                // if (soldierNumber > 0) {
                lastReportInfo && (index = lastReportInfo.bulletStat.findIndex(item => item.type === ele)) >= 0 ?
                    bulletStat.push({
                        type: ele,
                        soldierNumber: 0,
                        trainAverage: 0,
                        train: 0,
                        others: 0,
                        totalTrainAverage: Number(Number(lastReportInfo.bulletStat[index].totalTrainAverage).toFixed(1)),
                        totalTrain: Number(lastReportInfo.bulletStat[index].totalTrain),
                        totalOthers: Number(lastReportInfo.bulletStat[index].totalOthers)
                    }) : bulletStat.push({
                    type: ele,
                    soldierNumber: 0,
                    trainAverage: 0,
                    train: 0,
                    others: 0,
                    totalTrainAverage: 0,
                    totalTrain: 0,
                    totalOthers: 0
                })
                // }
            });
            result.bulletStat = bulletStat;

            // 获取摩托（飞行）小时信息
            let resultMotorInfo = await this.getRequirementByOrgCategory('MotorRequirement', org.orgCategory);
            let motorStat = [];
            resultMotorInfo.map(ele =>
                lastReportInfo && (index = lastReportInfo.motorStat.findIndex(item => item.type === ele.motorType)) >= 0 ?
                motorStat.push({
                    type: ele.motorType,
                    unitType: ele.unitType,
                    count: 0,
                    total: Number(lastReportInfo.motorStat[index].total)
                }) : motorStat.push({
                    type: ele.motorType,
                    unitType: ele.unitType,
                    count: 0,
                    total: 0
                }));
            result.motorStat = motorStat;
            return result;
        } catch (exception) {
            console.log(`getTableInfoByOrgAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 更新日登记表数据
    async updateDailyReport(oldReport, newReport, list) {
        try {
            let result = {};
            let index = -1;
            if(_.isEmpty(oldReport)) {
                result = newReport;
            } else {
                result.timeStat = newReport.timeStat.map(time => {
                    if ((index = oldReport.timeStat.findIndex(ele => ele.type === time.type)) >= 0) {
                        return {
                            type: time.type,
                            hoursInDay: Number(time.hoursInDay) - Number(oldReport.timeStat[index].hoursInDay),
                            hoursAtNight: Number(time.hoursAtNight) - Number(oldReport.timeStat[index].hoursAtNight)
                        };
                    }
                    return {
                        type: time.type,
                        hoursInDay: Number(time.hoursInDay),
                        hoursAtNight: Number(time.hoursAtNight)
                    };
                });
                result.bulletStat = newReport.bulletStat.map(bullet => {
                    if ((index = oldReport.bulletStat.findIndex(ele => ele.type === bullet.type)) >= 0) {
                        return {
                            type: bullet.type,
                            train: Number(bullet.train) - Number(oldReport.bulletStat[index].train),
                            trainAverage: Number((Number(bullet.trainAverage) - Number(oldReport.bulletStat[index].trainAverage)).toFixed(1)),
                            others: Number(bullet.others) - Number(oldReport.bulletStat[index].others),
                        };
                    }
                    return {
                        type: bullet.type,
                        train: Number(bullet.train),
                        trainAverage: Number(Number(bullet.trainAverage).toFixed(1)),
                        others: Number(bullet.others),
                    };
                });
                result.motorStat = newReport.motorStat.map(motor => {
                    if ((index = oldReport.motorStat.findIndex(ele => ele.type === motor.type)) >= 0) {
                        return {
                            type: motor.type,
                            count: Number(motor.count) - Number(oldReport.motorStat[index].count)
                        };
                    }
                    return {
                        type: motor.type,
                        count: Number(motor.count)
                    };
                });
            }
            list.map(item => {
                item.timeStat.map(time => {
                    if ((index = result.timeStat.findIndex(ele => ele.type === time.type)) >= 0) {
                        time.totalHoursInDay = Number(time.totalHoursInDay) + Number(result.timeStat[index].hoursInDay);
                        time.totalHoursAtNight = Number(time.totalHoursAtNight) + Number(result.timeStat[index].hoursAtNight);
                    }
                });
                item.bulletStat.map(bullet => {
                    if ((index = result.bulletStat.findIndex(ele => ele.type === bullet.type)) >= 0) {
                        bullet.totalTrain = Number(bullet.totalTrain) + Number(result.bulletStat[index].train);
                        bullet.totalOthers =  Number(bullet.totalOthers) + Number(result.bulletStat[index].others);
                        bullet.totalTrainAverage = Number(bullet.totalTrainAverage) + Number(result.bulletStat[index].trainAverage);
                        // bullet.totalTrainAverage = bullet.soldierNumber ? Number((bullet.totalTrain / Number(bullet.soldierNumber)).toFixed(1))
                        //     : Number(bullet.totalTrainAverage) + Number(result.bulletStat[index].trainAverage);
                    }
                });
                item.motorStat.map(motor => {
                    if ((index = result.motorStat.findIndex(ele => ele.type === motor.type)) >= 0) {
                        motor.total =  Number(motor.total) + Number(result.motorStat[index].count);
                    }
                });
            });
            for (let table of list) {
                let parsetable = Client.DailyReport.fromObject(table);
                await parsetable.save(null, this.backendService.options);
            }
        } catch (exception) {
            console.log(`updateDailyReport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getCompanyDecemberTrainerStatistic(org, date) {
        try {
            date = moment(date).add(1, 'days').toDate();
            let trainerStatistic = {
                officerCount: 0,
                monitorCount: 0,
                otherCount: 0,
                standardCount: 0,
                standardRate: 0
            };
            let parseOrg = new Client.Organization();
            parseOrg.id = org.objectId;
            let trainerQuery = new Client.Query(Client.Trainer);
            let date = moment(date).add(1, 'days').toDate();
            trainerQuery.lessThan('joinedAt', date);
            trainerQuery.equalTo('organization', parseOrg);
            trainerQuery.equalTo('inserviceStatus', InServiceStatus.InService);
            let result = await this.backendService.queryListAll('Trainer', trainerQuery);
            if (result.list.length) {
                let total = result.total;
                let OfficerAndMonitorCount = 0;
                for (let trainer of result.list) {
                    if (trainer.soldier.personProperty === '警官' && trainer.soldier.position === '班长') {
                        OfficerAndMonitorCount++
                    }
                    if (trainer.soldier.personProperty === '警官') {
                        trainerStatistic.officerCount++
                    }
                    if (trainer.soldier.position === '班长') {
                        trainerStatistic.monitorCount++
                    }
                    if (trainer.level === '四会' || trainer.level === '总部优秀' || trainer.level === '总队优秀' || trainer.level === '标兵') {
                        trainerStatistic.standardCount++
                    }
                }
                trainerStatistic.otherCount = total - trainerStatistic.monitorCount - trainerStatistic.officerCount + OfficerAndMonitorCount;
                trainerStatistic.standardRate = Number((trainerStatistic.standardCount / total * 100).toFixed(1));
            }
            return trainerStatistic;
        } catch (exception) {
            console.log(`getCompanyDecemberTrainerStatistic failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getCompanyDecemberQualityStat(org, date) {
        try {
            let qualityStat = {
                excellentRate: 0,
                goodRate: 0,
                passRate: 0,
                evaluatedScore: 0
            };

            let qualityCount = {
                total: 0,
                excellent: 0,
                good: 0,
                pass: 0,
            };
            let year = date.getFullYear();
            let personScoreQuery = new Client.Query(Client.PersonAnnualScore);
            let orgQuery = new Client.Query(Client.Organization);
            orgQuery.containedIn('parentIds', [org.objectId]);
            personScoreQuery.matchesQuery('organization', orgQuery);
            personScoreQuery.equalTo('year', year);
            let personScoreResult = await this.backendService.queryListAll('PersonAnnualScore', personScoreQuery);
            personScoreResult.list.map(personScore => {
                if (personScore.organization.orgCategory === org.orgCategory) {
                    qualityCount.total++;
                    let score = Number(personScore.score);
                    if (score >= ScoreLevel.Excellent) {
                        qualityCount.excellent++;
                        qualityCount.good++;
                        qualityCount.pass++;
                    } else if (score >= ScoreLevel.Good) {
                        qualityCount.good++;
                        qualityCount.pass++;
                    } else if (score >= ScoreLevel.Pass){
                        qualityCount.pass++;
                    }
                }
            });
            if (qualityCount.total) {
                qualityStat.excellentRate = Number((qualityCount.excellent / qualityStat.total * 100).toFixed(1));
                qualityStat.goodRate = Number((qualityCount.good / qualityStat.total * 100).toFixed(1));
                qualityStat.passRate = Number((qualityCount.pass / qualityStat.total * 100).toFixed(1));
            }

            let uniforceScoreQuery = new Client.Query(Client.UnitForceAnnualScore);
            let parseOrg = new Client.Organization();
            parseOrg.id = org.objectId;
            uniforceScoreQuery.equalTo('organization', parseOrg);
            uniforceScoreQuery.equalTo('year', year);
            let uniforceScoreResult = await uniforceScoreQuery.find(this.backendService.options);
            if (uniforceScoreResult.length) {
                uniforceScoreResult = parseUtils.simplifyObject(uniforceScoreResult[0].toJSON());
                qualityStat.evaluatedScore = uniforceScoreResult.annualScore;
            }
            return qualityStat;
        } catch (exception) {
            console.log(`getCompanyDecemberQualityStat failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getPlaceRequirement(orgCategory) {
        try {
            let requiredPlaces = [];
            let query = new Client.Query(Client.PlaceRequirement);
            query.equalTo('orgCategory', orgCategory);
            let requirement = await query.find(this.backendService.options);
            if (requirement.length) {
                requirement = parseUtils.simplifyObject(requirement[0].toJSON());
                requiredPlaces = requirement.requiredPlaces;
            }
            return requiredPlaces;
        } catch (exception) {
            console.log(`getPlaceRequirement failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getCompanyDecemberPlaceStatistic(org, date) {
        try {
            let requiredPlaces = await this.getPlaceRequirement(org.orgCategory);
            let placeStatistic = {
                createdDetails: [],
                created: [],
                nonCreated: [],
                newCreated: [],
                passRate: 0
            };
            let simplePlaceTypes = [];
            let types = [];
            let createdPlaceTyps = [];
            let dateBegin = moment(date).subtract(6, 'months').toDate();
            let placeQuery = new Client.Query(Client.TrainPlace);
            let orgQuery = new Client.Query(Client.Organization);
            orgQuery.containedIn('parentIds', [org.objectId]);
            placeQuery.matchesQuery('organization', orgQuery);
            placeQuery.equalTo('internal', true);
            let placeResult = await this.backendService.queryListAll('TrainPlace', placeQuery);
            placeResult.list.map(place => {
                if (place.organization.orgCategory === org.orgCategory) {
                    if (place.builtStatus === 0) {
                        let requiredFlag = false;
                        place.placeTypes.map(item => {
                            if (requiredPlaces.indexOf(item) >= 0 && createdPlaceTyps.indexOf(item) === -1) {
                                requiredFlag = true;
                                createdPlaceTyps.push(item);
                                let type = '';
                                if (item[item.length - 1] !== '）') {
                                    type = item[item.length - 1];
                                } else {
                                    type = item.split('（馆）')[0][item.split('（馆）')[0].length - 1];
                                }
                                simplePlaceTypes.push(type);
                                if (types.indexOf(type) === -1) {
                                    types.push(type);
                                }
                            }
                        });
                        if (requiredFlag) {
                            placeStatistic.createdDetails.push(place.name + '(' + place.placeTypes.toString() + ')');
                            if (place.builtAt && place.builtAt.getTime() >= dateBegin.getTime()) {
                                placeStatistic.newCreated.push(place.name + '(' + place.placeTypes.toString() + ')');
                            }
                        }
                    }
                }
            });
            requiredPlaces.map(item => {
                if (createdPlaceTyps.indexOf(item) === -1) {
                    placeStatistic.nonCreated.push(item);
                }
            });
            let typesInfo = '';
            types.map(ele => {
                let number = 0;
                simplePlaceTypes.map(item => {
                    if (ele === item) {
                        number++
                    }
                });
                typesInfo += (number + ele);
            });
            placeStatistic.created.push(typesInfo);
            if (requiredPlaces.length) {
                placeStatistic.passRate = Number((createdPlaceTyps.length / requiredPlaces.length * 100).toFixed(1));
            }
            return placeStatistic;
        } catch (exception) {
            console.log(`getCompanyDecemberPlaceStatistic failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 中队保存/提交日登记表时更新中队月统计表数据
    async updateMonthlyL1Report(dailyReport, list) {
        try {
            // 初始化表格信息
            let result = {};
            result = this.initMonthlyReport(result);

            // 日期信息
            result.year = dailyReport.date.getFullYear();
            result.month = dailyReport.date.getMonth();
            result.date = moment(new Date(result.year, result.month, 1)).add(1, 'months').subtract(1, 'days').toDate();

            result.targetOrg = dailyReport.targetOrg;
            result.createdBy = '';
            result.organization = dailyReport.organization;
            result.commander = dailyReport.commander;
            result.mainFlag = dailyReport.mainFlag;
            result.parentOrg = dailyReport.organization.parentId;
            result.trainerStatistic = {
                officerCount: 0,
                monitorCount: 0,
                otherCount: 0,
                standardCount: 0,
                standardRate: 0
            };
            result.qualityStat = {
                excellentRate: 0,
                goodRate: 0,
                passRate: 0,
                evaluatedScore: 0
            };
            result.placeStatistic = {
                createdDetails: [],
                created: [],
                nonCreated: [],
                newCreated: [],
                passRate: 0
            };
            if (result.month === 11) {
                result.trainerStatistic = await this.getCompanyDecemberTrainerStatistic(result.targetOrg, result.date);
                result.qualityStat = await this.getCompanyDecemberQualityStat(result.targetOrg, result.date);
                result.placeStatistic = await this.getCompanyDecemberPlaceStatistic(result.targetOrg, result.date);
            }

            result.timeStat = [];
            result.bulletStat = [];
            result.motorStat = [];
            let timeStat = [];
            let bulletStat = [];
            let motorStat = [];
            // 获取人员、弹药、摩托小时类型
            list.map(item => {
                item.timeStat.map(time => {
                    if (timeStat.indexOf(time.type) === -1) {
                        timeStat.push(time.type);
                        result.timeStat.push({
                            type: time.type,
                            hoursInDay: 0,
                            hoursAtNight: 0,
                            totalHoursInDay: 0,
                            totalHoursAtNight: 0
                        })
                    }
                });
                item.bulletStat.map(bullet => {
                    if (bulletStat.indexOf(bullet.type) === -1) {
                        bulletStat.push(bullet.type);
                        result.bulletStat.push({
                            type: bullet.type,
                            soldierNumber: 0,
                            trainAverage: 0,
                            train: 0,
                            others: 0,
                            totalTrainAverage: 0,
                            totalTrain: 0,
                            totalOthers: 0
                        })
                    }
                });
                item.motorStat.map(motor => {
                    if (motorStat.indexOf(motor.type) === -1) {
                        motorStat.push(motor.type);
                        result.motorStat.push({
                            type: motor.type,
                            unitType: motor.unitType,
                            count: 0,
                            total: 0
                        })
                    }
                });
            });
            // 获取统计数据
            // let date = new Date(result.year, result.month, 1).getTime();
            list.map(item => {
                item.timeStat.map(time => {
                    result.timeStat.map(ele => {
                        if (time.type === ele.type) {
                            ele.hoursInDay += Number(time.hoursInDay);
                            ele.hoursAtNight += Number(time.hoursAtNight);
                            ele.totalHoursInDay += Number(time.hoursInDay);
                            ele.totalHoursAtNight += Number(time.hoursAtNight);
                        }
                    });
                });
                item.motorStat.map(motor => {
                    result.motorStat.map(ele => {
                        if (motor.type === ele.type) {
                            ele.count += Number(motor.count);
                            ele.total += Number(motor.count);
                        }
                    });
                });
                item.bulletStat.map(bullet => {
                    result.bulletStat.map(ele => {
                        if (bullet.type === ele.type) {
                            // ele.soldierNumber += Number(bullet.soldierNumber);
                            ele.train += Number(bullet.train);
                            ele.others += Number(bullet.others);
                            ele.totalTrain += Number(bullet.train);
                            ele.totalOthers += Number(bullet.others);
                            ele.trainAverage += Number(bullet.trainAverage);
                            ele.totalTrainAverage += Number(bullet.trainAverage);
                            // if (item.date.getTime() >= date) {
                            //     date = item.date.getTime();
                            //     ele.soldierNumber = Number(bullet.soldierNumber);
                            // }
                        }
                    });
                });
            });
            result.bulletStat.map(item => {
                item.soldierNumber = 0;
                if (item.trainAverage > 0)
                    item.soldierNumber = Number((item.train / item.trainAverage).toFixed(4));
            });
            // 查询中队最近的月统计表数据
            let lastReportInfo = await this.getLastReport(dailyReport.targetOrg.objectId,new Date(result.year, result.month, 1), 'MonthlyReportL1');
            let currentReportInfo = await this.getLastReport(dailyReport.targetOrg.objectId, result.date, 'MonthlyReportL1');

            if (currentReportInfo) {
                if (currentReportInfo.month === result.month) {
                    result.objectId = currentReportInfo.objectId;

                    // result.bulletStat.map(bullet => {
                        // bullet.trainAverage = bullet.trainAverage;
                        // bullet.trainAverage = bullet.soldierNumber ? Number((bullet.train / bullet.soldierNumber).toFixed(1)) : 0;
                    //     bullet.totalTrainAverage = bullet.trainAverage;
                    // });
                 }} //else {
            if(lastReportInfo){
                    result.timeStat.map(ele => {
                        lastReportInfo.timeStat.map(item => {
                            if (timeStat.indexOf(item.type) === -1) {
                                result.timeStat.push(item);
                            } else {
                                if (ele.type === item.type) {
                                    ele.totalHoursInDay += Number(item.totalHoursInDay);
                                    ele.totalHoursAtNight += Number(item.totalHoursAtNight);
                                }
                            }
                        });
                    });
                    result.motorStat.map(ele => {
                        lastReportInfo.motorStat.map(item => {
                            if (motorStat.indexOf(item.type) === -1) {
                                result.motorStat.push(item);
                            } else {
                                if (ele.type === item.type) {
                                    ele.total += Number(item.total);
                                }
                            }
                        });
                    });
                    result.bulletStat.map(ele => {
                        lastReportInfo.bulletStat.map(item => {
                            if (bulletStat.indexOf(item.type) === -1) {
                                result.bulletStat.push(item);
                            } else {
                                if (ele.type === item.type) {
                                    ele.totalTrain += Number(item.totalTrain);
                                    ele.totalOthers += Number(item.totalOthers);
                                    // ele.trainAverage += Number(item.trainAverage);
                                    ele.totalTrainAverage += Number(item.totalTrainAverage);
                                    // ele.totalTrainAverage = ele.soldierNumber ? Number((ele.totalTrain / ele.soldierNumber).toFixed(1)) : 0;
                                }
                            }
                        });
                    });
                // }
             }
            // else {
            //     result.bulletStat.map(bullet => {
            //         bullet.trainAverage = bullet.soldierNumber ? Number((bullet.train / bullet.soldierNumber).toFixed(1)) : 0;
            //         bullet.totalTrainAverage = bullet.trainAverage;
            //     });
            // }
            let parseReport = Client.MonthlyReportL1.fromObject(result);
            await parseReport.save(null, this.backendService.options);
        } catch (exception) {
            console.log(`updateMonthlyL1Report failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 中队月统计表数据更新时更新支队月统计表 （这个我觉得不能用，中队没权限去修改支队的东西，应该是支队重新生成）
    async updateMonthlyL2Report(list) {
        try {
            let orgInfo = await this.getAllUnitForcebyParentId(list[0].organization.objectId);
            for (let report of list) {
                let lastReportInfo = await this.backendService.regimentReportService.getLastMonthlyL2Report(report.organization, report.date);
                let monthlyL1Reports = [];
                for(let org of orgInfo.list) {
                    let monthlyL1ReportsInfo = await this.getAllMonthlyL1ReportByParentOrgAndDate(org.objectId, report.date);
                    monthlyL1Reports = monthlyL1Reports.concat(monthlyL1ReportsInfo.list);
                }
                report.bulletStat = this.getBulletStatByMonthlyL1Reports(lastReportInfo, monthlyL1Reports);
                report.motorStat = this.getMotorStatByMonthlyL1ReportsAndOrg(lastReportInfo, monthlyL1Reports, orgInfo.list);
                let parseReport = Client.MonthlyReportL2.fromObject(report);
                await parseReport.save(null, this.backendService.options);
            }
        } catch (exception) {
            console.log(`updateMonthlyL2Report failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取支队下需提交月统计表的分队总数及详情
    async getAllUnitForcebyParentId(orgId) {
        try {
            let orgQuery = new Client.Query(Client.Organization);
            orgQuery.equalTo('parentIds', orgId);
            orgQuery.equalTo('orgType', OrgType.UnitForce);
            orgQuery.containedIn('orgSequence', [OrgSequence.Company, OrgSequence.Platoon, OrgSequence.Squad]);

            let results = await this.backendService.queryListAll('Organization', orgQuery);
            return results;
        } catch (exception) {
            console.log(`getAllUnitForcebyParentId failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    //获取支队下属所有中队
    async getAllCompanybyParentId(orgId) {
        try {
            let orgQuery = new Client.Query(Client.Organization);
            orgQuery.equalTo('parentIds', orgId);
            orgQuery.equalTo('orgType', OrgType.UnitForce);
            orgQuery.containedIn('orgSequence', [OrgSequence.Company]);

            let results = await this.backendService.queryListAll('Organization', orgQuery);
            return results;
        } catch (exception) {
            console.log(`getAllCompanybyParentId failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    // 获取总队下需提交月统计表的支队总数及详情
    async getAllRegimentByParentId(parentId) {
        try {
            let orgQuery = new Client.Query(Client.Organization);
            orgQuery.containedIn('orgSequence', [OrgSequence.Brigade, OrgSequence.Regiment]);
            orgQuery.equalTo('parentId', parentId);
            orgQuery.equalTo('orgType', OrgType.Troop);
            return await this.backendService.queryListAll('Organization', orgQuery);
        } catch (exception) {
            console.log(`getAllRegimentByParentId failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取支队下已提交的所有中队月统计表
    async getAllMonthlyL1ReportByParentOrgAndDate(orgId, date) {
        try {
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            let query = new Client.Query(Client.MonthlyReportL1);
            query.equalTo('targetOrg', parseOrg);
            query.equalTo('date', date);
            query.equalTo('state', SubmitState.Submited);
            return await this.backendService.queryListAll('MonthlyReportL1', query);
        } catch (exception) {
            console.log(`getAllMonthlyL1ReportByParentOrgAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取已提交的所有支队月统计表
    async getAllMonthlyL2ReportByParentOrgAndDate(orgId, date) {
        try {
            let parseOrg = new Client.Organization();
            parseOrg.id = orgId;
            // let dateStart = moment(date).add(1, 'days').subtract(3, 'months').toDate();
            // let year = date.getFullYear();
            let dateStart = moment(date).subtract(3, 'months').toDate();
            let year = dateStart.getFullYear();
            let query = new Client.Query(Client.MonthlyReportL2);
            query.equalTo('parentOrg', parseOrg);
            query.equalTo('year', year);
            query.greaterThan('date', dateStart);
            query.lessThan('date', date);
            query.equalTo('state', SubmitState.Submited);
            return await this.backendService.queryListAll('MonthlyReportL2', query);
        } catch (exception) {
            console.log(`getAllMonthlyL2ReportByParentOrgAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    // 根据支队月统计表获取总队训练弹药统计结果
    getBulletStatByMonthlyL2Reports(monthlyL2Reports){
        let bulletTypes = monthlyL2Reports.map(item => item.bulletStat.map(bullet => bullet.type));
        bulletTypes = _.uniq(_.flattenDeep(bulletTypes));

        let groupedObject = _.groupBy(monthlyL2Reports,'organization.objectId');
        //各支队单独季度统计
        let regimentQuarter = [];
        for(let key in groupedObject) {
            let orderedArray = _.orderBy(groupedObject[key], ['month'], ['desc']);
            let bulletStat = bulletTypes.map(type => {
                let result = orderedArray.reduce((prev, curr) => {
                    const stat = curr.bulletStat.find(item => item.type === type);
                    if (stat) {
                        prev.train += stat.train;
                        prev.trainAverage += stat.trainAverage;
                        prev.others += stat.others;
                    }
                    return prev;
                }, {
                    type,
                    train: 0,
                    trainAverage: 0,
                    soldierNumber: 0,
                    totalTrain: 0,
                    totalTrainAverage: 0,
                    totalSoldierNumber: 0,
                    others: 0,
                    totalOthers: 0
                });
                let temp = orderedArray[0].bulletStat.find(item => item.type === type);
                result.totalOthers = (temp && temp.totalOthers) ? temp.totalOthers : 0;
                result.totalTrainAverage = (temp && temp.totalTrainAverage) ? temp.totalTrainAverage : 0;
                result.totalTrain = (temp && temp.totalTrain) ? temp.totalTrain : 0;
                result.totalSoldierNumber = (temp && temp.totalSoldierNumber) ? temp.totalSoldierNumber : 0;
                if (result.trainAverage > 0) result.soldierNumber += +(result.train / result.trainAverage).toFixed(4);
                return result;
            });
            //把支队首长机关的手枪加到总队弹药统计进去，不包括（其他:others)
            let temp2 = {train:0,trainAverage:0};
            let pistolIndex = bulletStat.findIndex(item => item.type === '手枪');
            groupedObject[key].forEach(ele => {
                if (pistolIndex >= 0) {
                    bulletStat[pistolIndex].train += ele.bulletStatOffice.train;
                    temp2.train += ele.bulletStatOffice.train;
                    temp2.trainAverage += ele.bulletStatOffice.trainAverage;
                }
            });
            if (pistolIndex >= 0) {
                bulletStat[pistolIndex].trainAverage = (bulletStat[pistolIndex].train/(bulletStat[pistolIndex].soldierNumber + temp2.train/temp2.trainAverage)).toFixed(1);
                bulletStat[pistolIndex].totalTrain += orderedArray[0].bulletStatOffice.totalTrain;
                bulletStat[pistolIndex].totalTrainAverage =   (bulletStat[pistolIndex].totalTrain/(bulletStat[pistolIndex].totalSoldierNumber + orderedArray[0].bulletStatOffice.totalTrain/orderedArray[0].bulletStatOffice.totalTrainAverage)).toFixed(1);
                if (bulletStat[pistolIndex].trainAverage > 0) bulletStat[pistolIndex].soldierNumber = +(bulletStat[pistolIndex].train / bulletStat[pistolIndex].trainAverage).toFixed(4);
                if (bulletStat[pistolIndex].totalTrainAverage > 0) bulletStat[pistolIndex].totalSoldierNumber = +(bulletStat[pistolIndex].totalTrain / bulletStat[pistolIndex].totalTrainAverage).toFixed(4);
            }
            regimentQuarter.push(bulletStat);
        }

        let bulletStat = bulletTypes.map(type => {
            let result = regimentQuarter.reduce((prev, curr) => {
                const stat = curr.find(item => item.type === type);
                if(stat){
                    prev.soldierNumber += stat.soldierNumber;
                    prev.train += stat.train;
                    prev.others += stat.others;
                    prev.totalOthers += stat.totalOthers;
                    prev.totalSoldierNumber += stat.totalSoldierNumber;
                    prev.totalTrain += stat.totalTrain;
                }
                return prev;
            },{
                type,
                soldierNumber: 0,
                trainAverage: 0,
                train: 0,
                others: 0,
                totalSoldierNumber: 0,
                totalTrainAverage: 0,
                totalTrain: 0,
                totalOthers: 0
            });
            if (result.soldierNumber>0) result.trainAverage = +(result.train/result.soldierNumber).toFixed(1);
            if (result.totalSoldierNumber>0) result.totalTrainAverage = +(result.totalTrain/result.totalSoldierNumber).toFixed(1);
            return result;
        });
        return bulletStat;
    }


    // 根据中队月统计表获取支队训练弹药统计结果
    getBulletStatByMonthlyL1Reports(lastReportInfo, monthlyL1Reports){
        // let bulletTypes = [];
        // let bulletStat =[];
        // let thisMonthResult = [];
        // let result = [];

        let bulletTypes = monthlyL1Reports.map(item => item.bulletStat.map(bullet => bullet.type));
        bulletTypes = _.uniq(_.flattenDeep(bulletTypes));

        let bulletStat = bulletTypes.map(type => {
            let result = monthlyL1Reports.reduce((prev, curr) => {
                const stat = curr.bulletStat.find(item => item.type === type);
                if (stat) {
                    prev.soldierNumber += stat.soldierNumber;
                    prev.train += stat.train;
                    prev.others += stat.others;
                    if (stat.totalTrainAverage>0) prev.totalSoldierNumber += +(stat.totalTrain/stat.totalTrainAverage).toFixed(4);
                    prev.totalTrain += stat.totalTrain;
                    prev.totalOthers += stat.totalOthers;
                }
                return prev;
            }, {
                type,
                soldierNumber: 0,
                trainAverage: 0,
                train: 0,
                others: 0,
                totalSoldierNumber: 0,
                totalTrainAverage: 0,
                totalTrain: 0,
                totalOthers: 0
            });
            if (result.soldierNumber>0) result.trainAverage = +(result.train/result.soldierNumber).toFixed(1);
            if (result.totalSoldierNumber>0) result.totalTrainAverage = +(result.totalTrain/result.totalSoldierNumber).toFixed(1);
            return result;
        });

        return bulletStat;
    }

    // 根据支队月统计表获取总队季度统计表摩托类型统计结果
    getMotorStatByMonthlyL2Reports(lastReportInfo,monthlyL2Reports){
        let motorStats = [];
        monthlyL2Reports.map(item => {
            motorStats = motorStats.concat(item.motorStat);
        });
        let groupedObject = _.groupBy(motorStats,'type');
        let ret = [];
        for(let key in groupedObject){
            let motorType = groupedObject[key].map(ele => ele.motorInfo.map(item => item.type));
            motorType = _.uniq(_.flattenDeep(motorType));
            let temp = motorType.map(type => {
                let result = groupedObject[key].reduce((prev, curr) => {
                    const stat = curr.motorInfo.find(item => item.type === type);
                    if(stat){
                        prev.count += stat.count;
                        prev.unitType = stat.unitType;
                    }
                    return prev;
                },{
                    type,
                    unitType:'',
                    count:0,
                });
                return result;
            });
            ret.push({orgType:key, motorInfo:temp});
        }

        let teamTypes = monthlyL2Reports.map(item => item.motorStat.map(teamType => teamType.type));
        teamTypes = _.uniq(_.flattenDeep(teamTypes));
        let regimentStat = _.groupBy(monthlyL2Reports,'organization.objectId');
        let  stat = teamTypes.map(type => {
            let num = 0;
            let total = [];
            for(let key in regimentStat){
                let orderedArray = _.orderBy(regimentStat[key], ['month'], ['desc']);
                for(let ele of orderedArray){
                    let temp2 = ele.motorStat.find(item => item.type === type)
                    if(temp2){
                        total = total.concat(temp2.motorInfo);
                        num++;
                        break;
                    }
                }
            }

            let motorType = total.map(ele => ele.type);
            motorType = _.uniq(motorType);
            total = motorType.map( type => {
                let result =  total.reduce((prev, curr) => {
                    const stat = (curr.type === type)?curr:undefined;
                    if(stat){
                        prev.total += stat.total;
                    }
                    return prev;
                },{
                    type,
                    total:0
                });
                return result;
            });

            return {type,num,total};
        });

        ret = ret.map(ele => {
            let temp3 = stat.find(item => item.type === ele.orgType);
            if(temp3.num > 0){
                ele.motorInfo = ele.motorInfo.map(item => {
                    item.count = +(item.count / temp3.num).toFixed(1);
                    item.total = +(((temp3.total.find(motor => motor.type === item.type)).total) /temp3.num).toFixed(1);
                    return item;
                })
            }
            return ele;
        });

        return ret;
        // let thisMonthResult = this.getMotorStatisticsByAllMotorStats(motorStats);
        //
        // return this.getAllMotorByAllMotorStats(thisMonthResult, lastReportInfo);
    }

    // getMotorStatisticsByAllMotorStats(motorStats) {
    //     let motor = [];
    //     let orgTypes = [];
    //     let motorTypes = [];
    //     let motorStat = [];
    //     let MotorStat = [];
    //     let result = [];
    //     motorStats.map(item => {
    //         if (orgTypes.indexOf(item.type) === -1) {
    //             orgTypes.push(item.type);
    //             motorStat.push({
    //                 type: item.type,
    //                 motorInfo:[]
    //             })
    //         }
    //     });
    //
    //     motorStat.map(item => {
    //         motorStats.map(ele => {
    //             if (item.type === ele.type) {
    //                 item.motorInfo = item.motorInfo.concat(ele.motorInfo);
    //             }
    //         });
    //         item.motorInfo.map(info => {
    //             if (motorTypes.indexOf(info.type) === -1) {
    //                 motorTypes.push(info.type);
    //                 motor.push({
    //                     type: info.type,
    //                     unitType: info.unitType,
    //                     count: 0,
    //                     total: 0
    //                 })
    //             }
    //         });
    //         motor.map(result => {
    //             let number = 0;
    //             item.motorInfo.map(info => {
    //                 if (result.type === info.type) {
    //                     number++;
    //                     result = {
    //                         type: info.type,
    //                         unitType: info.unitType,
    //                         count: Number(result.count) + Number(info.count),
    //                         total: Number(result.total) + Number(info.count)
    //                     };
    //                 }
    //             });
    //             MotorStat.push({
    //                 type: result.type,
    //                 unitType: result.unitType,
    //                 count: number === 0 ? 0: Number((result.count / number).toFixed(1)),
    //                 total: result.total
    //             });
    //         });
    //         result.push({
    //             type: item.type,
    //             motorInfo: MotorStat
    //         });
    //         motorTypes = [];
    //         MotorStat = [];
    //         motor = [];
    //     });
    //     return result;
    // }
    //
    // getAllMotorByAllMotorStats(thisMonthResult, lastReportInfo) {
    //     if (!lastReportInfo) {
    //         return thisMonthResult;
    //     }
    //     // 汇总累计摩托小时
    //     let motorTypes = [];
    //     let motor = [];
    //     let MotorStat = [];
    //     let result = [];
    //     let index = -1;
    //     thisMonthResult.map(ele => {
    //         if ((index = lastReportInfo.motorStat.findIndex(item => item.type === ele.type)) >= 0) {
    //             ele.motorInfo = ele.motorInfo.concat(lastReportInfo.motorStat[index].motorInfo);
    //         }
    //         ele.motorInfo.map( info => {
    //             if (motorTypes.indexOf(info.type) === -1) {
    //                 motorTypes.push(info.type);
    //                 motor.push({
    //                     type: info.type,
    //                     unitType: info.unitType,
    //                     count: 0,
    //                     total: 0
    //                 })
    //             }
    //         });
    //         motor.map(result => {
    //             ele.motorInfo.map(info => {
    //                 if (result.type === info.type) {
    //                     result = {
    //                         type: info.type,
    //                         unitType: info.unitType,
    //                         count: Number(info.count),
    //                         total: Number(result.total) + Number(info.count)
    //                     };
    //                 }
    //             });
    //             MotorStat.push(result);
    //         });
    //         result.push({
    //             type: ele.type,
    //             motorInfo: MotorStat
    //         });
    //         motorTypes = [];
    //         MotorStat = [];
    //         motor = [];
    //     });
    //     index = -1;
    //     lastReportInfo.motorStat.map(ele => {
    //         if ((index = result.findIndex(item => item.type === ele.type)) === -1) {
    //             result.push(ele)
    //         }
    //     });
    //     return result;
    // }

    // 根据中队月统计表获取支队摩托类型统计结果
    getMotorStatByMonthlyL1ReportsAndOrg(lastReportInfo,monthlyL1Reports, orgList){
        let motor = [];
        let orgTypes = [];
        let motorTypes = [];
        let motorStat = [];
        let MotorStat = [];
        let thisMonthResult = [];
        let result = [];
        // 初始化所有分队类型
        orgList.map(item => {
            if (orgTypes.indexOf(item.orgCategory) === -1) {
                orgTypes.push(item.orgCategory);
                motorStat.push({
                    type: item.orgCategory,
                    motorInfo:[]
                })
            }
        });
        // 汇总当月摩托小时
        motorStat.map(ele => {
            monthlyL1Reports.map(item => {
                if (item.targetOrg && item.targetOrg.orgCategory === ele.type) {
                    ele.motorInfo = ele.motorInfo.concat(item.motorStat)
                }
            });
            ele.motorInfo.map(info => {
                if (motorTypes.indexOf(info.type) === -1) {
                    motorTypes.push(info.type);
                    motor.push({
                        type: info.type,
                        unitType: info.unitType,
                        count: 0,
                        total:0,
                    })
                }
            });
            motor.map(result => {
                let number = 0;
                ele.motorInfo.map(motor => {
                    if (result.type === motor.type) {
                        number++;
                        result = {
                            type: motor.type,
                            unitType: motor.unitType,
                            count: Number(result.count) + Number(motor.count),
                            total: Number(result.total) + Number(motor.total)
                        };
                    }
                });
                MotorStat.push({
                    type: result.type,
                    unitType: result.unitType,
                    count: number === 0 ? 0: Number((result.count / number).toFixed(1)),
                    total: number === 0 ? 0: Number((result.total / number).toFixed(1))
                });
            });
            thisMonthResult.push({
                type: ele.type,
                motorInfo: MotorStat
            });
            motorTypes = [];
            MotorStat = [];
            motor = [];
        });

        motor = [];
        orgTypes = [];
        motorTypes = [];
        MotorStat = [];

        // 汇总累计摩托小时
        // let index = -1;
        // let index2 = -1;
        thisMonthResult.map(ele => {
            // if (lastReportInfo && (index = lastReportInfo.motorStat.findIndex(item => item.type === ele.type)) >= 0) {
            //     ele.motorInfo = ele.motorInfo.map(info =>{
            //         if((index2 =lastReportInfo.motorStat[index].motorInfo.findIndex(item => item.type === info.type)) >= 0) {
            //             info.total = lastReportInfo.motorStat[index].motorInfo[index2].total + info.count;
            //         }
            //         return info;
            //     });
            //     // ele.motorInfo = ele.motorInfo.concat(lastReportInfo.motorStat[index].motorInfo);
            // }else{
            //     ele.motorInfo =  ele.motorInfo.map(info => {
            //         info.total = info.count;
            //         return info;
            //     })
            // }

            ele.motorInfo.map( info => {
                if (motorTypes.indexOf(info.type) === -1) {
                    motorTypes.push(info.type);
                    motor.push({
                        type: info.type,
                        unitType: info.unitType,
                        count: 0,
                        total: 0
                    })
                }
            });
            motor.map(result => {
                ele.motorInfo.map(info => {
                    if (result.type === info.type) {
                        result = {
                            type: info.type,
                            unitType: info.unitType,
                            count: Number(info.count),
                            total: Number(result.total) + Number(info.total)
                        };
                    }
                });
                MotorStat.push(result);
            });
            result.push({
                type: ele.type,
                motorInfo: MotorStat
            });
            motorTypes = [];
            MotorStat = [];
            motor = [];
        });
        // console.log(result);
        return result;
    }

    async getOfficeEvaluatedScore(org, year) {
        try {
            let evaluatedScore = 0;
            let orglist = await this.backendService.orgService.getLocalOrganizations(org.objectId);
            let officeOrg = orglist.filter(item => {
                return item.objectId !== org.objectId;
            });
            let officeScoreQuery = new Client.Query(Client.OfficeAnnualScore);
            let parseOfficeOrg = new Client.Organization();
            parseOfficeOrg.id = officeOrg[0].objectId;
            officeScoreQuery.equalTo('organization', parseOfficeOrg);
            officeScoreQuery.equalTo('year', year);
            let officeScoreResult = await officeScoreQuery.find(this.backendService.options);
            if (officeScoreResult.length) {
                officeScoreResult = parseUtils.simplifyObject(officeScoreResult[0].toJSON());
                evaluatedScore = officeScoreResult.annualScore;
            }
            return evaluatedScore;
        } catch (exception) {
            console.log(`getOfficeEvaluatedScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getMonthlyL2ReportByOrgAndDate(org, date, timeout=false) {
        try {
            if(_.isString(org)) {
                org = await this.backendService.fetchItem("Organization", org);
            }
            // 初始化表格信息
            let result = {};
            result = this.initMonthlyL2Report(result);

            // 日期信息
            result.year = date.getFullYear();
            result.month = date.getMonth();
            result.date = date;

            result.timeout = timeout;
            // 目标组织信息添加
            result.organization = org;
            result.orgCode = org.orgCode;
            result.parentOrg = org.parentId;

            // 设置填写人
            result.createdBy = '';

            // 获取支队主管--支队长
            result.commander = await this.getSoldierNameByPosition(org.objectId, '支队长');

            // 查询支队最近的月统计表数据
            let lastReportInfo = await this.backendService.regimentReportService.getLastMonthlyL2Report(org, result.date);
            if (_.isEmpty(lastReportInfo)) {
                lastReportInfo = null;
            }


            result.timeStatistic = {
                trainDays: 0,
                trainHours: 0,
                totalHours: lastReportInfo && lastReportInfo.timeStatistic ? Number(lastReportInfo.timeStatistic.totalHours) : 0
            };

            // 获取首长机关实力数
            // let LeaderOfficeNumber = await this.getOfficeSoldierNumberByOrgIdAndDate(org.objectId, date);

            // 获取训练弹药消耗(首长机关)
            result.bulletStatOffice = {
                type: '手枪',
                // soldierNumber: 0,
                trainAverage: 0,
                train: 0,
                totalTrainAverage: lastReportInfo && lastReportInfo.bulletStatOffice ? Number(lastReportInfo.bulletStatOffice.totalTrainAverage) : 0,
                totalTrain: lastReportInfo && lastReportInfo.bulletStatOffice ? Number(lastReportInfo.bulletStatOffice.totalTrain) : 0
            };



            let  officeStatistic = await this.getOfficeStatistic(lastReportInfo, org, date);

            result.trainContent = officeStatistic.trainContent;
            if(!_.isEmpty(officeStatistic.timeStatistic)) {
                result.timeStatistic = officeStatistic.timeStatistic;
            }
            if(!_.isEmpty(officeStatistic.bulletStatOffice)) {
                result.bulletStatOffice = officeStatistic.bulletStatOffice;
            }
            result.bulletStatOffice.type =  '手枪';

            // 获取所有分队信息
            let orgInfo = await this.getAllUnitForcebyParentId(org.objectId);

            // 获取所有分队月统计表
            let monthlyL1Reports = [];
            for(let ele of orgInfo.list) {
                let monthlyL1ReportsInfo = await this.getAllMonthlyL1ReportByParentOrgAndDate(ele.objectId, date);
                monthlyL1Reports = monthlyL1Reports.concat(monthlyL1ReportsInfo.list);
            }

            result.bulletStat = this.getBulletStatByMonthlyL1Reports(lastReportInfo, monthlyL1Reports);

            result.motorStat = this.getMotorStatByMonthlyL1ReportsAndOrg(lastReportInfo, monthlyL1Reports, orgInfo.list);

            result.evaluatedScore = 0;
            result.trainerStatistic = {
                passNumber: 0,
                passRate: 0
            };
            result.placeStatistic = {
                passNumber: 0,
                passRate: 0
            };

            if (result.month === 11) {
                result.evaluatedScore = await this.getOfficeEvaluatedScore(org, result.year);
                let total = 0;
                monthlyL1Reports.map(report => {
                    if (report.organization.objectId === report.targetOrg.objectId) {
                        total++;
                        if (report.placeStatistic.passRate === 100) {
                            result.placeStatistic.passNumber++;
                        }
                        if (report.trainerStatistic.standardRate === 100) {
                            result.trainerStatistic.passNumber++;
                        }
                    }
                });
                if (total) {
                    result.placeStatistic.passRate = Number((result.placeStatistic.passNumber / total * 100).toFixed(1));
                    result.trainerStatistic.passRate = Number((result.trainerStatistic.passNumber / total * 100).toFixed(1));
                }
            }
            return result;
        } catch (exception) {
            console.log(`getMonthlyL2ReportByOrgAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler)  this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updateLeadOffice(oldReport, newReport, list, key) {
        try {
            let result = {
                timeStatistic:{}
            };
            if(_.isEmpty(oldReport)) {
                // return;
                 result = newReport;
            } else {
                result.timeStatistic.trainHours = Number(newReport.timeStatistic.trainHours) - Number(oldReport.timeStatistic.trainHours);
                result.bulletStatOffice = {
                    train: Number(newReport.bulletStatOffice.train) - Number(oldReport.bulletStatOffice.train),
                    trainAverage: Number(newReport.bulletStatOffice.trainAverage) - Number(oldReport.bulletStatOffice.trainAverage)
                };
            }
            list.map(report => {
                // let soldierNumber = report.bulletStatOffice.soldierNumber ? Number(report.bulletStatOffice.soldierNumber) : 0;
                report.timeStatistic.totalHours = Number(report.timeStatistic.totalHours) + Number(result.timeStatistic.trainHours);
                report.bulletStatOffice.totalTrain = Number(report.bulletStatOffice.totalTrain) + Number(result.bulletStatOffice.train);
                report.bulletStatOffice.totalTrainAverage = Number(report.bulletStatOffice.totalTrainAverage) + Number(result.bulletStatOffice.trainAverage);
                // report.bulletStatOffice.totalTrainAverage = soldierNumber === 0 ? Number(result.bulletStatOffice.trainAverage) :
                //     Number((Number(report.bulletStatOffice.totalTrain) / soldierNumber).toFixed(1));
            });
            for (let info of list) {
                let parseReport = Client[key].fromObject(info);
                await parseReport.save(null, this.backendService.options);
            }
        } catch (exception) {
            console.log(`updateLeadOffice failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }

    }

    async getQuarterReportByOrgAndDate(judgeResult, refresh = 0) {
        try {
            // 初始化表格信息
            let result = {};
            result = this.initMonthlyL2Report(result);

            // 日期信息
            result.year = judgeResult.year;
            result.month = judgeResult.month;
            result.quarter = judgeResult.quarter;
            result.date = moment(judgeResult.date).subtract(1, 'days').toDate();

            // 目标组织信息添加
            if(_.isString(judgeResult.organization)) {
                result.organization = await this.backendService.fetchItem("Organization", judgeResult.organization);
            }else {
                result.organization = judgeResult.organization;
            }
            let parseOrg = new Client.Organization();
            parseOrg.id = result.organization.objectId;

            // 设置填写人
            result.createdBy = '';

            // 获取总队主管
            result.commander = '';

            // 查询总队最近的季度统计表数据
            let lastReportInfo = await this.backendService.quarterReportService.getLastQuarterReport(result.organization, judgeResult.date, refresh);
            if (_.isEmpty(lastReportInfo)) {
                lastReportInfo = null;
            }

            result.trainContent = [];
            result.timeStatistic = {
                trainDays: 0,
                trainHours: 0,
                totalHours: lastReportInfo && lastReportInfo.timeStatistic ? Number(lastReportInfo.timeStatistic.totalHours) : 0
            };

            // 获取首长机关实力数
            // let LeaderOfficeNumber = await this.getOfficeSoldierNumberByOrgIdAndDate(result.organization.objectId, result.date);

            // 获取训练弹药消耗(首长机关)
            result.bulletStatOffice = {
                type: '手枪',
                soldierNumber: 0,
                trainAverage: 0,
                train: 0,
                totalTrainAverage: lastReportInfo && lastReportInfo.bulletStatOffice ? Number(lastReportInfo.bulletStatOffice.totalTrainAverage) : 0,
                totalTrain: lastReportInfo && lastReportInfo.bulletStatOffice ? Number(lastReportInfo.bulletStatOffice.totalTrain) : 0
            };


            let  officeStatistic = await this.getQuarterOfficeStatistic(result.organization , result.date,lastReportInfo);

            result.trainContent = officeStatistic.trainContent;
            if(!_.isEmpty(officeStatistic.timeStatistic)) {
                result.timeStatistic = officeStatistic.timeStatistic;
            }
            if(!_.isEmpty(officeStatistic.bulletStatOffice)) {
                result.bulletStatOffice = officeStatistic.bulletStatOffice;
            }
            result.bulletStatOffice.type =  '手枪';

            // 获取所有支队月统计表
            let monthlyL2ReportsInfo = await this.getAllMonthlyL2ReportByParentOrgAndDate(result.organization.objectId, judgeResult.date);
            let monthlyL2Reports = monthlyL2ReportsInfo.list;

            result.bulletStat = this.getBulletStatByMonthlyL2Reports(monthlyL2Reports);
            // result.bulletStat = this.getBulletStatByMonthlyL1Reports(lastReportInfo, monthlyL2Reports);

            result.motorStat = this.getMotorStatByMonthlyL2Reports(lastReportInfo, monthlyL2Reports);

            result.evaluatedScore = 0;
            result.trainerStatistic = {
                passNumber: 0,
                passRate: 0
            };
            result.placeStatistic = {
                passNumber: 0,
                passRate: 0
            };
            let total = 0;
            if (result.month === 11) {
                result.evaluatedScore = await this.getOfficeEvaluatedScore(result.organization, result.year);
                if (monthlyL2Reports.length) {
                    monthlyL2Reports.map(report => {
                        if (report.month === 11) {
                            total++;
                            if (report.placeStatistic.passRate === 100) {
                                result.placeStatistic.passNumber++;
                            }
                            if (report.trainerStatistic.passRate === 100) {
                                result.trainerStatistic.passNumber++;
                            }
                        }
                    });
                }
                if (total) {
                    result.placeStatistic.passRate = Number((result.placeStatistic.passNumber / total * 100).toFixed(1));
                    result.trainerStatistic.passRate = Number((result.trainerStatistic.passNumber / total * 100).toFixed(1));
                }
            }

            return result;
        } catch (exception) {
            console.log(`getQuarterReportByOrgAndDate failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 初始化季度统计表前日期及单位判断(不传入日期则默认日期为上季度最后一天）(本季度只允许创建上季度统计表，其他为补登记）
    // 抛异常或返回未提交月统计表的支队单位信息数组或返回空数组
    async judgeOrgAndDateIsOk(organization, year, quarter, timeoutFlag) {
        try {
            // 组织信息处理,非师/总队不允许创建
            let org = organization;
            if (_.isString(org)) {
                org = await this.backendService.fetchItem('Organization', org);
            }

            if (org.orgSequence !== OrgSequence.Division) {
                return '非师/总队单位不允许创建季度统计表！';
            }

            // date判断
            let today = this.backendService.getSystemTime();
            let thisYear = today.getFullYear();
            let thisMonth = today.getMonth();
            let thisQuarter = 0;  // 说明当前月份该统计的季度
            if (thisMonth < 3) {
                thisMonth = 2;
                thisQuarter = 4;
                thisYear--;
            } else if (thisMonth < 6) {
                thisMonth = 5;
                thisQuarter = 1;
            } else if (thisMonth < 9) {
                thisMonth = 8;
                thisQuarter = 2;
            } else {
                thisMonth = 11;
                thisQuarter = 3;
            }

            let month = 0;
            if (quarter === 1) {
                month = 2;
            } else if (quarter === 2) {
                month = 5;
            } else if (quarter === 3) {
                month = 8;
            } else if (quarter === 4) {
                month = 11;
            }
            if (!year || !quarter) {
                year = thisYear;
                month = thisMonth;
                quarter = thisQuarter;
            }
            if ((year > thisYear || (year === thisYear && quarter > thisQuarter)) && quarter !== 4) {
                return '请于下季度1-10号创建本季度的季度统计表！';
            }

            // if (year < thisYear || (year === thisYear && thisQuarter === 4)) {
            //     return '只能补登记本年的季度统计表';
            // }
            // if (year === thisYear && quarter > thisQuarter) {
            //     return '请于下季度1-10号创建本季度的季度统计表！';
            // }
            // if ((year < thisYear || (year === thisYear && quarter < thisQuarter)) && !timeoutFlag) {
            //     return '本季度只允许创建上季度的季度统计表，其他季度请通过补登记入口创建！';
            // }

            let date = moment(new Date(year, month, 1)).add(1, 'months').toDate();

            // 获取需提交月统计表的支队总数
            let monthlyL2ReportInfo = await this.getAllRegimentByParentId(organization.objectId);

            // 获取已提交的所有支队月统计表
            let tableInfo = await this.getAllMonthlyL2ReportByParentOrgAndDate(organization.objectId, date);

            let orgArr = monthlyL2ReportInfo.list.map(item => item.displayName);
            // console.log(orgArr);
            let arr1 = [], arr2 = [], arr3 = [];

            tableInfo.list.map(item => {
               if (item.month === month) {
                   arr1.push(item.organization.displayName);
               }
                if (item.month === month - 1) {
                    arr2.push(item.organization.displayName);
                }
                if (item.month === month - 2) {
                    arr3.push(item.organization.displayName);
                }
            });
            if (monthlyL2ReportInfo.total > Math.min(arr1.length, arr2.length, arr3.length)) {
                // let uncommittedOrgs = [];
                let uncommittedOrgs  = _.union(_.xor(orgArr, arr1), _.xor(orgArr, arr2),  _.xor(orgArr, arr3));

                // console.log(uncommittedOrgs.join('、') + '的' + `${year}年第${quarter}季度` + '月统计未提交完全');
                return uncommittedOrgs.join('、') + '的' + `${year}年第${quarter}季度` + '月统计未提交完全';
                // return '请先提交所有的支队月统计表！';
            }
            return {
                organization: org,
                year: year,
                month: month,
                quarter: quarter,
                date: date
            };
        } catch (exception) {
            console.log(`judgeOrgAndDateIsOk failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    //根据总队首长机关日登记获取其季度统计数据 （date传入该季度的最后一天）
    async getQuarterOfficeStatistic(org, date,lastReportInfo){
        try{
            let temp = [];
            let ret = {
                trainContent:[],
                timeStatistic:{},
                bulletStatOffice:{}
            };
            let query = new Client.Query(Client.DailyReport);
            query.equalTo('organization',this.backendService.getParseObject('Organization',org.objectId));
            query.lessThan('date',new Date(date.getFullYear(),date.getMonth()+1));
            query.greaterThanOrEqualTo('date',new Date(date.getFullYear(),date.getMonth()-2));
            query.addDescending('date');
            let result = await this.backendService.queryListAll('DailyReport',query);
            if(result.total){
                result.list.forEach(ele => {
                    temp = temp.concat(ele.contentStat.earlyMoring, ele.contentStat.morning, ele.contentStat.afternoon, ele.contentStat.night);
                });
                ret.trainContent = _.uniq(temp);
                //统计当季度机关训练用时
                ret.timeStatistic.trainDays = result.total;
                ret.timeStatistic.trainHours = result.list.reduce((prev, curr) => {
                    prev += (curr.timeStat[0].hoursAtNight + curr.timeStat[0].hoursInDay);
                    return prev;
                }, 0);
                if (lastReportInfo && lastReportInfo.timeStatistic.totalHours) {
                    ret.timeStatistic.totalHours = lastReportInfo.timeStatistic.totalHours + ret.timeStatistic.trainHours;
                } else {
                    ret.timeStatistic.totalHours = ret.timeStatistic.trainHours;
                }
                // ret.timeStatistic.totalHours =  result.list[0].timeStat[0].totalHoursInDay + result.list[0].timeStat[0].totalHoursAtNight;
                ret.bulletStatOffice.type = '手枪';
                //统计当季机关手枪情况
                ret.bulletStatOffice.train = result.list.reduce((prev, curr) => {
                    prev += curr.bulletStat[0].train;
                    return prev;
                }, 0);
                ret.bulletStatOffice.trainAverage = result.list.reduce((prev, curr) => {
                    prev += curr.bulletStat[0].trainAverage;
                    return prev;
                },0);
                if (lastReportInfo && lastReportInfo.bulletStatOffice.totalTrain) {
                    ret.bulletStatOffice.totalTrain = lastReportInfo.bulletStatOffice.totalTrain + ret.bulletStatOffice.train;
                    ret.bulletStatOffice.totalTrainAverage = lastReportInfo.bulletStatOffice.totalTrainAverage + ret.bulletStatOffice.trainAverage;
                } else {
                    ret.bulletStatOffice.totalTrain = ret.bulletStatOffice.train;
                    ret.bulletStatOffice.totalTrainAverage = ret.bulletStatOffice.trainAverage;
                }
                // ret.bulletStatOffice.totalTrain = result.list[0].bulletStat[0].totalTrain;
                // ret.bulletStatOffice.totalTrainAverage = result.list[0].bulletStat[0].totalTrainAverage;
            }
            return ret;
        }catch(exception){
            console.log(`getQuarterOfficeStatistic failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler)  this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    //根据支队首长机关日登记获取其月统计数据
    async getOfficeStatistic(lastReportInfo, org, date){
        try{
            let temp = [];
            let ret = {
                trainContent:[],
                timeStatistic:{},
                bulletStatOffice:{}
            };
            let query = new Client.Query(Client.DailyReport);
            query.equalTo('organization',this.backendService.getParseObject('Organization',org.objectId));
            query.lessThan('date',new Date(date.getFullYear(),date.getMonth()+1));
            query.greaterThanOrEqualTo('date',new Date(date.getFullYear(),date.getMonth()));
            query.addDescending('date');
            let result = await this.backendService.queryListAll('DailyReport',query);
            if(result.total) {
                //统计当月机关训练内容
                result.list.forEach(ele => {
                    temp = temp.concat(ele.contentStat.earlyMoring, ele.contentStat.morning, ele.contentStat.afternoon, ele.contentStat.night);
                });
                ret.trainContent = _.uniq(temp);
                //统计当月机关训练用时
                ret.timeStatistic.trainDays = result.total;
                ret.timeStatistic.trainHours = result.list.reduce((prev, curr) => {
                    prev += (curr.timeStat[0].hoursAtNight + curr.timeStat[0].hoursInDay);
                    return prev;
                }, 0);
                if (lastReportInfo && lastReportInfo.timeStatistic.totalHours) {
                    ret.timeStatistic.totalHours = lastReportInfo.timeStatistic.totalHours + ret.timeStatistic.trainHours;
                } else {
                    ret.timeStatistic.totalHours = ret.timeStatistic.trainHours;
                }
                ret.bulletStatOffice.type = '手枪';
                //统计当月机关手枪情况
                ret.bulletStatOffice.train = result.list.reduce((prev, curr) => {
                    prev += curr.bulletStat[0].train;
                    return prev;
                }, 0);
                ret.bulletStatOffice.trainAverage = result.list.reduce((prev, curr) => {
                   prev += curr.bulletStat[0].trainAverage;
                   return prev;
                },0);



                if (lastReportInfo && lastReportInfo.bulletStatOffice.totalTrain) {
                    ret.bulletStatOffice.totalTrain = lastReportInfo.bulletStatOffice.totalTrain + ret.bulletStatOffice.train;
                    ret.bulletStatOffice.totalTrainAverage = lastReportInfo.bulletStatOffice.totalTrainAverage + ret.bulletStatOffice.trainAverage;
                } else {
                    ret.bulletStatOffice.totalTrain = ret.bulletStatOffice.train;
                    ret.bulletStatOffice.totalTrainAverage = ret.bulletStatOffice.trainAverage;
                }

                //  ret.bulletStatOffice.totalTrainAverage = Math.round(ret.bulletStatOffice.totalTrain / soldiers.length);
                // ret.bulletStatOffice.totalTrain = result.list[0].bulletStat[0].totalTrain;
                // ret.bulletStatOffice.totalTrainAverage = result.list[0].bulletStat[0].totalTrainAverage;
            }
            return ret;
        }catch (exception) {
            console.log(`getOfficeTimeStatistic failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler)  this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
}

export default ReportCommonApi;
