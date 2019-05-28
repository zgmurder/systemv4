import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import { OrgSequence, OrgSequences, IsZhiDui, MapRankToLevel1, SubmitState, InServiceStatus, OrgType, DayType, StandardState, PersonProperty } from '../Constants';
import moment, { monthsShort } from 'moment';
import dateUtils from '../utils/dateUtils';

export class MonthPlanService {
    constructor(backend) {
        this.backendService = backend;

        this.holidays = [];

        this.annualPlanItems = [];
        this.stagePlanItems = [];
        this.courseTimeStatuses = [];
        this.updatedCTStatuses = [];

        this.monthPlan = null;

        this.unitForceTime = null;
        this.dailySchedule = null;
        this.officerCourseOptions = [];
        this.orgCourseOptions = [];
    }

    init() {
        this.holidays = [];

        this.annualPlanItems = [];
        this.stagePlanItems = [];
        this.courseTimeStatuses = [];
        this.updatedCTStatuses = [];

        this.monthPlan = null;

        this.unitForceTime = null;
        this.dailySchedule = null;
        this.officerCourseOptions = [];
        this.orgCourseOptions = [];
    }

    async getInitMonthPlanV2(annualPlan, year, month) {
        try {
            this.init();

            let {orgCategory, orgProperty, serviceReq, majors} = annualPlan;

            let organization = this.backendService.getCurrentOrganization();
            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) throw '未指定单位';
            if (!IsZhiDui(organization.orgSequence) && organization.orgSequence != OrgSequence.Battalion) throw '请指定支队级或大队级单位来创建该表';

            let categoryName = orgCategory;
            if (orgCategory.includes('应急')) {
                categoryName = '应急分队';
            } else if (categoryName.endsWith('分队')) {
                categoryName = orgProperty+'分队';
            }
            if (!_.isEmpty(majors)) {
                categoryName = `${categoryName}(${majors.join('、')})`;
            }

            let planName = `${year}年${month}月份${organization.name}${categoryName}训练计划`;
            if (!_.isEmpty(serviceReq)) {
                planName = `${year}年${month}月份${organization.name}${categoryName}(${serviceReq})训练计划`;
            }

            await this._fetchCommonRules(year);
            await this._fetchPlanItems(annualPlan, year, month, organization);

            this.unitForceTime = await this._getTimeReqByOrgCategory(orgCategory, PersonProperty.Soldier);
            this.dailySchedule = await this._getDailyScheduleByOrgCategory(orgCategory);

            let dailyHour = 4;
            // if (this.dailySchedule) dailyHour = this.dailySchedule.morning+this.dailySchedule.afternoon-this.dailySchedule.sport;
            if (this.unitForceTime) dailyHour = Math.max(dailyHour, this.unitForceTime.timeReq.hoursPerDay);

            let monthBegin = moment(new Date(year, month-1, 1)).startOf('month').toDate();
            let monthEnd = moment(new Date(year, month-1, 1)).endOf('month').toDate();

            let fromWeek = dateUtils.weekOfMonth(monthBegin);
            let toWeek = dateUtils.weekOfMonth(monthEnd);
            if (fromWeek.month != month) {
                fromWeek = dateUtils.weekOfMonth(moment(monthBegin).add(7, 'days').toDate());
            }
            if (toWeek.month != month) {
                toWeek = dateUtils.weekOfMonth(moment(monthEnd).subtract(7, 'days').toDate());
            }

            let monthPlan = undefined;
            let query = new Client.Query(Client.MonthPlan);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.equalTo('orgCategory', orgCategory);
            if (!_.isEmpty(serviceReq)) {
                query.equalTo('serviceReq', serviceReq);
            }
            if (!_.isEmpty(majors)) {
                query.equalTo('majors', majors[0]);
            }
            query.descending('createdAt').limit(1);

            let result = await this.backendService.queryList('MonthPlan', query);
            let lastMonthPlan = result.list[0];

            // query.equalTo('year', year);
            // query.equalTo('month', month);
            // result = await this.backendService.queryList('MonthPlan', query);
            // if (!_.isEmpty(result.list)) {
            //     throw `${planName}已经存在，请不要重复创建`;
            // } else
            {
                let days = this._calcTrainDays(fromWeek.weekStart, toWeek.weekEnd);
                // let hoursPerDay = this.unitForceTime && this.unitForceTime.hoursPerDay || 4;
                let hours = Math.floor(days * dailyHour);

                monthPlan = {
                    year,
                    month,
                    organization,
                    orgCategory,
                    orgProperty,
                    serviceReq,
                    majors,
                    name: planName,
                    orgCode: organization.orgCode,
                    state: 0,
                    annualPlanId: annualPlan.objectId,

                    fromDate: fromWeek.weekStart,
                    toDate: toWeek.weekEnd,
                    days: days,
                    officerHours: 0,
                    soldierHours: 0,

                    planItems: [],

                    activities: lastMonthPlan?lastMonthPlan.activities:'',
                    scoreReqs: lastMonthPlan?lastMonthPlan.activities:'',
                    groupType: lastMonthPlan?lastMonthPlan.activities:'',
                    methods: lastMonthPlan?lastMonthPlan.activities:'',
                    notes: lastMonthPlan?lastMonthPlan.activities:'',
                };

                for (let i = fromWeek.weekSeq; i <= toWeek.weekSeq; i++) {
                    let currWeek = dateUtils.weekOfMonth(moment(fromWeek.weekStart).add((i-1)*7, 'days').toDate());
                    let days = this._calcTrainDays(currWeek.weekStart, currWeek.weekEnd);
                    let rateAtNight = this.unitForceTime && this.unitForceTime.rateAtNight || 15;

                    let hours = Math.floor(days * dailyHour);
                    if (this.getTasks(currWeek.weekStart, currWeek.weekEnd).includes('应急')) {
                        hours = this._calcTrainHours(currWeek.weekStart, currWeek.weekEnd, dailyHour);
                    }

                    let hoursAtNight = Math.round(hours * rateAtNight / 100);

                    let planItem = {
                        year,
                        month,
                        weekSeq: i,
                        organization,
                        orgCategory,
                        orgProperty,
                        serviceReq,
                        majors,
                        name: planName,
                        orgCode: organization.orgCode,
                        state: 0,
                        annualPlanId: annualPlan.objectId,

                        fromDate: currWeek.weekStart,
                        toDate: currWeek.weekEnd,
                        days: days,
                        hours: hours,
                        hoursInDay: hours-hoursAtNight,
                        hoursAtNight: hoursAtNight,
                        actualHoursInDay: 0,
                        actualHoursAtNight: 0,
                        officerCourses: [],
                        orgCourses: [],
                    };

                    monthPlan.planItems.push(planItem);
                }
            }

            this.monthPlan = monthPlan;
            this._generateCourseOptions();

            console.log('getInitMonthPlan', monthPlan)

            return monthPlan;
        } catch (exception) {
            console.log(`getInitMonthPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    getTasks(fromDate, toDate) {
        let planItems = this.annualPlanItems.filter(item => {
            return (fromDate >= item.fromDate && fromDate <= item.toDate) ||
                ((toDate >= item.fromDate && toDate <= item.toDate))
        });

        return planItems.map(item => item.task);
    }

    // async getInitMonthPlan(stagePlan, year, month) {
    //     try {
    //         this.init();
    //
    //         let {year, orgCategory, orgProperty, serviceReq, majors} = stagePlan;
    //         let planOrg = stagePlan.organization;
    //
    //         let organization = this.backendService.getCurrentOrganization();
    //         if (_.isString(organization)) {
    //             organization = await this.backendService.fetchItem('Organization', organization);
    //         }
    //         if (_.isEmpty(organization)) throw '未指定单位';
    //         if (!IsZhiDui(organization.orgSequence) && organization.orgSequence != OrgSequence.Battalion) throw '请指定支队级或大队级单位来创建该表';
    //
    //         let categoryName = orgCategory;
    //         if (orgCategory.includes('应急')) {
    //             categoryName = '应急分队';
    //         } else if (categoryName.endsWith('分队')) {
    //             categoryName = orgProperty+'分队';
    //         }
    //         if (!_.isEmpty(majors)) {
    //             categoryName = `${categoryName}(${majors.join('、')})`;
    //         }
    //
    //         let planName = `${year}年${month}月份${organization.name}${categoryName}训练计划`;
    //         if (!_.isEmpty(serviceReq)) {
    //             planName = `${year}年${month}月份${organization.name}${categoryName}(${serviceReq})训练计划`;
    //         }
    //
    //         await this._fetchCommonRules(year);
    //         await this._fetchPlanItems(stagePlan, year, month, organization);
    //
    //         this.unitForceTime = await this._getTimeReqByOrgCategory(orgCategory, PersonProperty.Soldier);
    //         this.dailySchedule = await this._getDailyScheduleByOrgCategory(orgCategory);
    //
    //         let dailyHour = 4;
    //         if (this.dailySchedule) dailyHour = this.dailySchedule.morning+this.dailySchedule.afternoon-this.dailySchedule.sport;
    //         if (this.unitForceTime) dailyHour = Math.max(dailyHour, this.unitForceTime.timeReq.hoursPerDay);
    //
    //         let monthBegin = moment(new Date(year, month-1, 1)).startOf('month').toDate();
    //         let monthEnd = moment(new Date(year, month-1, 1)).endOf('month').toDate();
    //
    //         let fromWeek = dateUtils.weekOfMonth(monthBegin);
    //         let toWeek = dateUtils.weekOfMonth(monthEnd);
    //         if (fromWeek.month != month) {
    //             fromWeek = dateUtils.weekOfMonth(moment(monthBegin).add(7, 'days').toDate());
    //         }
    //         if (toWeek.month != month) {
    //             toWeek = dateUtils.weekOfMonth(moment(monthEnd).subtract(7, 'days').toDate());
    //         }
    //
    //         let monthPlan = undefined;
    //         let query = new Client.Query(Client.MonthPlan);
    //         query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
    //         query.equalTo('orgCategory', orgCategory);
    //         if (!_.isEmpty(serviceReq)) {
    //             query.equalTo('serviceReq', serviceReq);
    //         }
    //         if (!_.isEmpty(majors)) {
    //             query.equalTo('majors', majors[0]);
    //         }
    //         query.equalTo('year', year);
    //         query.equalTo('month', month);
    //         query.descending('month').limit(1);
    //         let result = await this.backendService.queryList('MonthPlan', query);
    //         if (!_.isEmpty(result.list)) {
    //             throw `${planName}已经存在，请不要重复创建`;
    //         } else {
    //             let days = this._calcTrainDays(fromWeek.weekStart, toWeek.weekEnd);
    //             // let hoursPerDay = this.unitForceTime && this.unitForceTime.hoursPerDay || 4;
    //             let hours = Math.floor(days * dailyHour);
    //
    //             monthPlan = {
    //                 year,
    //                 month,
    //                 organization,
    //                 orgCategory,
    //                 orgProperty,
    //                 serviceReq,
    //                 majors,
    //                 name: planName,
    //                 orgCode: organization.orgCode,
    //                 state: 0,
    //                 stagePlan: stagePlan,
    //
    //                 fromDate: fromWeek.weekStart,
    //                 toDate: toWeek.weekEnd,
    //                 days: days,
    //                 officerHours: 0,
    //                 soldierHours: hours,
    //
    //                 planItems: [],
    //
    //                 activities: '',
    //                 scoreReqs: (!_.isEmpty(this.stagePlanItems))?this.stagePlanItems[0].stagePlan.scoreReqs:'',
    //                 groupType: '',
    //                 methods: '',
    //                 notes: '',
    //             };
    //
    //             for (let i = fromWeek.weekSeq; i <= toWeek.weekSeq; i++) {
    //                 let currWeek = dateUtils.weekOfMonth(moment(fromWeek.weekStart).add((i-1)*7, 'days').toDate());
    //                 let days = this._calcTrainDays(currWeek.weekStart, currWeek.weekEnd);
    //                 // let hoursPerDay = this.unitForceTime && this.unitForceTime.hoursPerDay || 4;
    //                 let rateAtNight = this.unitForceTime && this.unitForceTime.rateAtNight || 15;
    //                 let hours = Math.floor(days * dailyHour);
    //                 let hoursAtNight = Math.round(hours * rateAtNight / 100);
    //
    //                 let planItem = {
    //                     year,
    //                     month,
    //                     weekSeq: i,
    //                     organization,
    //                     orgCategory,
    //                     orgProperty,
    //                     serviceReq,
    //                     majors,
    //                     name: planName,
    //                     orgCode: organization.orgCode,
    //                     state: 0,
    //
    //                     fromDate: currWeek.weekStart,
    //                     toDate: currWeek.weekEnd,
    //                     days: days,
    //                     hours: hours,
    //                     hoursInDay: hours-hoursAtNight,
    //                     hoursAtNight: hoursAtNight,
    //                     actualHoursInDay: 0,
    //                     actualHoursAtNight: 0,
    //                     officerCourses: [],
    //                     orgCourses: [],
    //                 };
    //
    //                 monthPlan.planItems.push(planItem);
    //             }
    //         }
    //
    //         this.monthPlan = monthPlan;
    //         this._generateCourseOptions();
    //
    //
    //         return monthPlan;
    //     } catch (exception) {
    //         console.log(`getInitMonthPlan failed! exception:${exception}`);
    //         let result = parseUtils.getErrorMessage(exception);
    //         if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
    //         throw result;
    //     }
    // }

    async addOrUpdateMonthPlan(monthPlan) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            let query = new Client.Query(Client.MonthPlan);
            query.equalTo('name', monthPlan.name);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            let result = await this.backendService.queryList('MonthPlan', query);
            let exists = result.list;
            if (monthPlan.objectId) {
                exists = exists.filter(item => item.objectId != monthPlan.objectId);
            }
            if (!_.isEmpty(exists)) throw '请不要创建重复标题的月度训练计划';

            let planItems = monthPlan.planItems;
            delete monthPlan.planItems;

            let resultPlan = await this.backendService.addOrUpdateItem('MonthPlan', monthPlan);
            if (!monthPlan.objectId) {
                planItems.forEach(item => {
                    item.monthPlan = resultPlan.objectId;
                });
            }

            await this.backendService.addOrUpdateList('MonthPlanItem', planItems);

            if (!_.isEmpty(this.updatedCTStatuses)) {
                this.updatedCTStatuses = this.updatedCTStatuses.map(item => {
                    item.annualPlanId = monthPlan.annualPlanId;
                    return item;
                });
                await this.backendService.addOrUpdateList('CourseTimeStatus', this.updatedCTStatuses);
            }

            // 添加操作记录
            await this.backendService.addOperateRecord({
                tblName: 'MonthPlan',
                targetId: resultPlan.objectId,
                operateType: monthPlan.objectId ? '修改' : '创建',
                description: ''
            });

            return await this.getMonthPlanDetails(resultPlan.objectId);
        } catch (exception) {
            console.log(`addOrUpdateMonthPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteMontPlan(planId) {
        try {
            // if (!this.backendService.isAdmin()) throw '本账号无权限删除月计划表';
            const currOrg = this.backendService.getCurrentOrganization();
            const plan = await this.backendService.fetchItem('MonthPlan', planId);
            if (currOrg && plan.organization && plan.organization.objectId != currOrg.objectId) throw '无权限删除其他单位创建的月计划表';

            await this.getMonthPlanDetails(planId);

            // 删除月计划时，先调整月计划里的课目已训课时
            for (let planItem of this.monthPlan.planItems) {
                if (!_.isEmpty(planItem.officerCourses)) {
                    let clonedCourses = [...planItem.officerCourses];
                    clonedCourses.map(courseItem => {
                        this.updateArrangedCourse({planItem, courseItem, isOfficer: true, isAdd: false});
                    })
                }

                if (!_.isEmpty(planItem.orgCourses)) {
                    let clonedCourses = [...planItem.orgCourses];
                    clonedCourses.map(courseItem => {
                        this.updateArrangedCourse({planItem, courseItem, isOfficer: false, isAdd: false});
                    })
                }
            }

            // 删除计划
            await this.backendService.deleteItem('MonthPlan', {objectId: planId});
            if (!_.isEmpty(this.monthPlan.planItems)) await this.backendService.deleteList('MonthPlanItem', this.monthPlan.planItems);

            if (!_.isEmpty(this.updatedCTStatuses)) {
                await this.backendService.addOrUpdateList('CourseTimeStatus', this.updatedCTStatuses);
            }
            this.monthPlan = undefined;
        } catch (exception) {
            console.log(`deleteMontPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getMonthPlanDetails(objectId) {
        try {
            this.init();

            let monthPlan = await this.backendService.fetchItem('MonthPlan', objectId);
            if (_.isEmpty(monthPlan)) throw '找不到对应的月计划表';

            let query = new Client.Query(Client.MonthPlanItem);
            query.equalTo('monthPlan', this.backendService.getParseObject('MonthPlan', objectId));
            query.addAscending('fromDate');
            let result = await this.backendService.queryListAll('MonthPlanItem', query);
            monthPlan.planItems = result.list;

            this.monthPlan = monthPlan;

            await this._fetchCommonRules(monthPlan.year);

            await this._fetchPlanItems(monthPlan, monthPlan.year, monthPlan.month, monthPlan.organization, false);

            this._generateCourseOptions();

            return monthPlan;
        } catch (exception) {
            console.log(`getMonthPlanDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取课目可选项
    getCourseOptions(planItem, isOfficer=false) {
        let officerCourses = [];
        let orgCourses = [];
        let fromDate = planItem.fromDate;
        let toDate = moment(planItem.fromDate).weekday(5); // 周五
        let stagePlanItems = this.stagePlanItems.filter(item =>
            (fromDate <= item.fromDate && toDate >= item.fromDate) ||
            (fromDate >= item.fromDate && toDate <= item.toDate) ||
            (fromDate <= item.toDate && toDate >= item.toDate)
        );
        if (_.isEmpty(stagePlanItems)) {
            stagePlanItems = this.stagePlanItems;
        }
        stagePlanItems.forEach(item => {
            officerCourses = officerCourses.concat(item.officerCourses);
            orgCourses = orgCourses.concat(item.orgCourses);
        });

        console.log("getCourseOptions: orgCourses=", orgCourses);

        if (isOfficer) {
            return _.intersectionBy(this.officerCourseOptions, officerCourses, 'courseId');
        } else {
            return _.intersectionWith(this.orgCourseOptions, orgCourses, (a, b) => a.courseId===b.courseId && ((_.isEmpty(a.major)&&_.isEmpty(b.major))||(a.major===b.major)));
        }
    }

    // _calcCourseHours(planItem) {
    //     let majors = _.uniq(planItem.orgCourses.map(item => item.major).filter(item => !_.isEmpty(item)));
    //     if (!_.isEmpty(majors)) {

    //     }
    // }

    _calcCourseHours(orgCourses) {
        let normalCourses = orgCourses.filter(item => _.isEmpty(item.major));
        let majorCourses = orgCourses.filter(item => !_.isEmpty(item.major));

        let actualHoursInDay = 0;
        let actualHoursAtNight = 0;
        if (!_.isEmpty(normalCourses)) {
            let gunnerCourses = normalCourses.filter(item => !_.isEmpty(item.gunnerType));
            normalCourses = normalCourses.filter(item => _.isEmpty(item.gunnerType));
            normalCourses.map(item => {
                if (item.name.includes('士官')) return;
                if (!_.isEmpty(item.ranks)&&MapRankToLevel1(item.ranks[0])==='士官') return;
                actualHoursInDay += item.hoursInDay;
                actualHoursAtNight += item.hoursAtNight;
            });

            if (!_.isEmpty(gunnerCourses)) {
                let groups = _.groupBy(gunnerCourses, 'gunnerType');
                let maxCourses = undefined;
                let maxHours = 0;
                for (let courses of _.values(groups)) {
                    let hours = courses.reduce((prev, curr) => {
                        prev += (curr.hoursInDay+curr.hoursAtNight);
                        return prev;
                    }, 0);
                    if (maxHours<hours) {
                        maxCourses = courses;
                        maxHours = hours;
                    }
                }

                if (maxCourses) {
                    maxCourses.map(item => {
                        actualHoursInDay += item.hoursInDay;
                        actualHoursAtNight += item.hoursAtNight;
                    });
                }
            }

        }
        if (!_.isEmpty(majorCourses)) {
            let majorGroups = _.groupBy(majorCourses, 'major');

            let maxCourses = undefined;
            let maxHours = 0;
            for (let courses of _.values(majorGroups)) {
                let hours = courses.reduce((prev, curr) => {
                    prev += (curr.hoursInDay+curr.hoursAtNight);
                    return prev;
                }, 0);
                if (maxHours<hours) {
                    maxCourses = courses;
                    maxHours = hours;
                }
            }

            if (maxCourses) {
                maxCourses.map(item => {
                    actualHoursInDay += item.hoursInDay;
                    actualHoursAtNight += item.hoursAtNight;
                });
            }
        }

        return {actualHoursInDay, actualHoursAtNight};
    }

    // 添加/删除课目安排
    updateArrangedCourse({planItem, courseItem, hoursInDay=0, hoursAtNight=0, isOfficer=false, isAdd=true}) {
        if (_.isEmpty(planItem) || _.isEmpty(courseItem)) return;

        if (_.isString(hoursInDay)) hoursInDay = 0;
        if (_.isString(hoursAtNight)) hoursAtNight = 0;

        let courses = planItem.orgCourses;
        if (isOfficer) courses = planItem.officerCourses;
        let ctStatus = this._getCourseTimeStatus(planItem, courseItem, isOfficer);

        if (isAdd) {
            if (!isOfficer) {
                let tmpCourses = _.concat(courses, [{...courseItem, hoursInDay, hoursAtNight}]);
                let stat = this._calcCourseHours(tmpCourses);
                if (stat.actualHoursInDay+stat.actualHoursAtNight>planItem.hours) {
                    if (this.backendService.errorHandler) this.backendService.errorHandler(0, {type: 'warning', message: `该周课时已经排满`});
                    return;
                }
            }

            let existed = courses.find(item => item.courseId===courseItem.courseId && ((_.isEmpty(item.major)&&_.isEmpty(courseItem.major))||(item.major===courseItem.major)));
            if (existed) {
                existed.hoursInDay += hoursInDay;
                existed.hoursAtNight += hoursAtNight;
            } else {
                let course = {
                    ...courseItem,
                    hoursInDay,
                    hoursAtNight,
                };
                delete course.allHoursInDay;
                delete course.allHoursAtNight;

                courses.push(course);

                courses = _.sortBy(courses, ['priority', 'major', 'seq']);
                if (isOfficer) planItem.officerCourses = courses;
                else planItem.orgCourses = courses;

            }

            if (ctStatus) {
                ctStatus.actualHoursInDay += hoursInDay;
                ctStatus.actualHoursAtNight += hoursAtNight;
            }


        } else {
            let removed = _.remove(courses, (item) => item.courseId === courseItem.courseId && ((_.isEmpty(item.major)&&_.isEmpty(courseItem.major))||(item.major===courseItem.major)));

            if (!_.isEmpty(removed)) {
                let removedCourse = removed[0];

                if (ctStatus) {
                    ctStatus.actualHoursInDay = Math.max(ctStatus.actualHoursInDay-removedCourse.hoursInDay, 0);
                    ctStatus.actualHoursAtNight = Math.max(ctStatus.actualHoursAtNight-removedCourse.hoursAtNight, 0);
                }
            }
        }

        let stat = this._calcCourseHours(planItem.orgCourses);
        planItem.actualHoursInDay = stat.actualHoursInDay;
        planItem.actualHoursAtNight = stat.actualHoursAtNight;

        this.monthPlan.soldierHours = this.monthPlan.planItems.reduce((prev, curr) => {
            prev += (curr.actualHoursInDay + curr.actualHoursAtNight);
            return prev;
        }, 0);

        this.monthPlan.officerHours = this.monthPlan.planItems.reduce((prev, curr) => {
            prev += curr.officerCourses.reduce((prev2, curr2) => {
                prev2 += ((curr2.hoursInDay||0) + (curr2.hoursAtNight||0));
                return prev2;
            }, 0);
            return prev;
        }, 0);

        console.log('updateArrangedCourse', this.monthPlan);

        this._generateCourseOptions(isOfficer);
    }

    // getMonthPlanQuery() {
    //     let organization = this.backendService.getCurrentOrganization();
    //
    //
    //     if (organization && organization.orgSequence === OrgSequence.Regiment) {
    //         // 支队
    //         let query1 = new Client.Query(Client.MonthPlan);
    //         query1.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
    //     } else if (organization && organization.orgSequence === OrgSequence.Battalion) {
    //         // 大队
    //     } else {
    //         // 其他
    //     }
    //
    //
    // }

    async queryMonthPlanList(year, selectOrg, query) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            if (_.isEmpty(query)) {
                query = new Client.Query(Client.MonthPlan);
                query.limit(100);
            }

            /*if (!_.isEmpty(selectOrg)) {
                selectOrg = await this.backendService.fetchItem('Organization', selectOrg.objectId);
            }*/

            // 在总部/总队/支队查询下级支队的月计划表
            if (!organization || organization.orgSequence <= OrgSequence.Regiment) {
                 if (!_.isEmpty(selectOrg) && selectOrg.orgSequence > OrgSequence.Battalion) {
                     // 大队以下单位
                     return [];
                 } else if (!_.isEmpty(selectOrg) && selectOrg.orgSequence === OrgSequence.Battalion) {
                     // 大队
                     query.equalTo('organization', this.backendService.getParseObject('Organization', selectOrg.objectId));
                 } else {
                     // 大队以上单位
                     let queryOrg = organization;
                     if (!_.isEmpty(selectOrg) && selectOrg.orgSequence <= OrgSequence.Regiment) {
                         queryOrg = selectOrg;
                     }
                     let orgQuery = new Client.Query(Client.Organization);
                     orgQuery.equalTo('parentIds', queryOrg.objectId);
                     query.matchesQuery('organization', orgQuery);
                 }

                // if (queryOrg&&queryOrg.orgSequence!=OrgSequence.Army) {
                //     let orgQuery = new Client.Query(Client.Organization);
                //     orgQuery.equalTo('parentIds', queryOrg.objectId);
                //     query.matchesQuery('organization', orgQuery);
                // }
            }
            // 大队以下单位，只显示上级支队或本大队发布的的月计划
            if (organization && organization.orgSequence > OrgSequence.Battalion) {
                let parseOrgs = organization.parentIds.map(item => this.backendService.getParseObject('Organization', item));
                query.containedIn('organization', parseOrgs);
            }
            // 大队本级只查自己的表
            if (organization && organization.orgSequence === OrgSequence.Battalion) {
                query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId))
            }
            // 非支队或大队，只查询已发布的表单
            if (!organization || !IsZhiDui(organization.orgSequence) && organization.orgSequence != OrgSequence.Battalion) {
                query.equalTo('state', SubmitState.Submited);
            }
            // 大队及以下分队，只显示对应分队的计划
            // if (organization && organization.orgSequence >= OrgSequence.Battalion) {
            //     let localOrgs = await this.backendService.orgService.getAllChildrenOrgs(organization.objectId);
            //     let orgCategories = _.uniq(localOrgs.map(item => item.orgCategory));
            //     if (!_.isEmpty(orgCategories)) {
            //         query.containedIn('orgCategory', orgCategories);
            //     }
            // }
            year && query.equalTo('year', year);
            query.addDescending(['year', 'month']).addAscending(['orgCode', 'orgCategory', 'serviceReq']);
            let result = await this.backendService.queryList('MonthPlan', query);

            return result;
        } catch (exception) {
            console.log(`queryMonthPlanList failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    fixMajorCourses(annualPlanItem) {
        if (!_.isEmpty(annualPlanItem.majorCoursesV2)) {
            let optionalCourses = annualPlanItem.majorCourses||[];
            annualPlanItem.majorCourses = annualPlanItem.majorCoursesV2.map(courseV2 => {
                const course = optionalCourses.find(item => (item||{}).objectId === courseV2.courseId);
                if (course) {
                    return {
                        ...course,
                        majorReq: courseV2.majorReq
                    };
                } else {
                    return undefined;
                }
            });
            annualPlanItem.majorCourses = annualPlanItem.majorCourses.filter(item => item);
        }
    }

    _getAnnualCourses(isOfficer) {
        let courseTimes = [];
        let courses = [];

        this.annualPlanItems.forEach(item => {
            this.fixMajorCourses(item);
            if (isOfficer) {
                courses = courses.concat(item.officerCourses||[]);
                courseTimes = courseTimes.concat(item.officerCourseTimes||[]);
            } else {
                courses = courses.concat(item.commonCourses||[], item.majorCourses||[]);
                courseTimes = courseTimes.concat(item.commonCourseTimes||[], item.majorCourseTimes||[]);
            }
        });

        return {courses, courseTimes};
    }

    _getCourseTimeStatus(planItem, courseItem, isOfficer) {
        let ctStatus = this.updatedCTStatuses.find(item => (item.course||{}).objectId === courseItem.courseId && ((_.isEmpty(item.major)&&_.isEmpty(courseItem.major))||(item.major===courseItem.major)));
        if (_.isEmpty(ctStatus)) {
            ctStatus = this.courseTimeStatuses.find(item => (item.course||{}).objectId === courseItem.courseId  && ((_.isEmpty(item.major)&&_.isEmpty(courseItem.major))||(item.major===courseItem.major)));
            if (ctStatus) this.updatedCTStatuses.push(ctStatus);
        }
        if (_.isEmpty(ctStatus)) {
            if (_.isEmpty(this.annualPlanItems)) return undefined;

            // let courseTimes = [];
            // let courses = [];
            // if (isOfficer) {
            //     courses = this.annualPlanItem.officerCourses||[];
            //     courseTimes = this.annualPlanItem.officerCourseTimes||[];
            // } else {
            //     courses = (this.annualPlanItem.commonCourses||[]).concat(this.annualPlanItem.majorCourses||[]);
            //     courseTimes = (this.annualPlanItem.commonCourseTimes||[]).concat(this.annualPlanItem.majorCourseTimes||[]);
            // }
            let {courses, courseTimes} = this._getAnnualCourses(isOfficer);
            let courseTime = courseTimes.find(item => (item.courseIds||[]).includes(courseItem.courseId) && ((_.isEmpty(item.majorReq)&&_.isEmpty(courseItem.major))||(item.majorReq===courseItem.major)));

            ctStatus = {
                year: planItem.year,
                course: courses.find(item => item.objectId === courseItem.courseId)||{objectId: courseItem.courseId},
                organization: planItem.organization,
                orgCode: planItem.orgCode,
                orgCategory: planItem.orgCategory,
                serviceReq: planItem.serviceReq,
                majors: planItem.majors,
                major: courseItem.major,
                orgProperty: planItem.orgProperty,
                realtedCourseIds: (courseTime&&courseTime.courseIds) || [],
                hoursInDay: (courseTime&&courseTime.hoursInDay) || 0,
                hoursAtNight: (courseTime&&courseTime.hoursAtNight) || 0,
                actualHoursInDay: 0,
                actualHoursAtNight: 0
            };
            if (ctStatus) this.updatedCTStatuses.push(ctStatus);
        }

        return ctStatus;
    }

    // 获取课目训练时间
    _getCourseHours(course, isOfficer) {
        let ctStatus = this.updatedCTStatuses.find(item => (item.course||{}).objectId === course.courseId && ((_.isEmpty(item.major)&&_.isEmpty(course.major))||(item.major===course.major)));
        if (_.isEmpty(ctStatus)) {
            ctStatus = this.courseTimeStatuses.find(item => (item.course||{}).objectId === course.courseId && ((_.isEmpty(item.major)&&_.isEmpty(course.major))||(item.major===course.major)));
        }
        if (_.isEmpty(ctStatus)) {
            let result = {
                hoursInDay: 0,
                hoursAtNight: 0,
                allHoursInDay: 0,
                allHoursAtNight: 0
            };
            if (_.isEmpty(this.annualPlanItems)) return result;

            // let courseTimes = [];
            // if (isOfficer) {
            //     courseTimes = this.annualPlanItem.officerCourseTimes||[];
            // } else {
            //     courseTimes = (this.annualPlanItem.commonCourseTimes||[]).concat(this.annualPlanItem.majorCourseTimes||[]);
            // }
            let {courses, courseTimes} = this._getAnnualCourses(isOfficer);
            let courseTime = courseTimes.find(item => (item.courseIds||[]).includes(course.courseId) && ((_.isEmpty(item.majorReq)&&_.isEmpty(course.major))||(item.majorReq===course.major)));
            if (courseTime) {
                result.allHoursInDay = courseTime.hoursInDay;
                result.allHoursAtNight = courseTime.hoursAtNight;
            }

            return result;
        } else {
            return {
                hoursInDay: ctStatus.actualHoursInDay,
                hoursAtNight: ctStatus.actualHoursAtNight,
                allHoursInDay: ctStatus.hoursInDay,
                allHoursAtNight: ctStatus.hoursAtNight
            };
        }
    }

    _generateCourseOptions(isOfficer) {
        let officerCourses = [];
        let orgCourses = [];
        this.stagePlanItems.forEach(item => {
            officerCourses = officerCourses.concat(item.officerCourses);
            orgCourses = orgCourses.concat(item.orgCourses);
        });

        // 对重复的课目进行课时合并
        officerCourses = _.uniqBy(officerCourses, 'courseId');
        orgCourses = _.uniqWith(orgCourses, (a, b) => a.courseId===b.courseId && ((_.isEmpty(a.major)&&_.isEmpty(b.major))||(a.major===b.major)));

        if (isOfficer===undefined||isOfficer===true) {
            // 设置警官课目可选项
            this.officerCourseOptions = officerCourses.map(course => {
                let timeStat = this._getCourseHours(course, true);

                return {
                    ...course,
                    ...timeStat
                };
            });
            // this.officerCourseOptions = _.sortBy(this.officerCourseOptions, ['priority', 'seq']);
        }

        if (isOfficer===undefined||isOfficer===false) {
            // 设置单位课目可选项
            this.orgCourseOptions = orgCourses.map(course => {
                let timeStat = this._getCourseHours(course, false);

                return {
                    ...course,
                    ...timeStat
                };
            });
            // this.orgCourseOptions = _.sortBy(this.orgCourseOptions, ['priority', 'major', 'seq']);
        }

        console.log("this.officerCourseOptions=", this.officerCourseOptions);
        console.log("this.orgCourseOptions=", this.orgCourseOptions);
    }

    _calcTrainDays(fromDate, toDate) {
        let holidays = this.holidays.filter(item => item.date>=fromDate && item.date<=toDate);

        let trainDays = 0;
        let days = moment(toDate).diff(moment(fromDate), 'days');
        for (let i = 0; i < days; i++) {
            let curr = moment(fromDate).add(i, 'days');
            let weekday = curr.weekday();
            let holiday = holidays.find(item => {
                return new Date(item.date).getTime() === curr.toDate().getTime();
            });
            if (!_.isEmpty(holiday)) {
                if (holiday.type === DayType.Workday) trainDays++;
            } else if (!dateUtils.isWeekend(weekday)) {
                if ([2,4,5].includes(weekday)) trainDays += 0.5;
                else trainDays += 1;
            }
        }

        return trainDays;
    }

    // 针对应急阶段计算课时
    _calcTrainHours(fromDate, toDate, dailyHours) {
        const holidays = this.holidays.filter(item => item.date>=fromDate && item.date<=toDate);
        const planItem = this.annualPlanItems.find(item => item.task === '应急');


        let trainHours = 0;
        let days = moment(toDate).diff(moment(fromDate), 'days');
        for (let i = 0; i < days; i++) {
            let tmpHours = dailyHours;
            let curr = moment(fromDate).add(i, 'days');
            let currDate = curr.toDate();
            // 在应急阶段时间内
            if (currDate >= planItem.fromDate && currDate <= planItem.toDate) tmpHours = 7;

            let weekday = curr.weekday();
            let holiday = holidays.find(item => item.date === currDate);
            if (!_.isEmpty(holiday)) {
                if (holiday.type === DayType.Workday) trainHours += tmpHours;
            } else if (!dateUtils.isWeekend(weekday)) {
                if ([2,4,5].includes(weekday)) trainHours += 0.5*tmpHours;
                else trainHours += tmpHours;
            }
        }

        return Math.floor(trainHours);
    }

    async _fetchCommonRules(year) {
        if (!_.isEmpty(this.holidays) && moment(this.holidays[0].date).year() != year) {
            this.holidays = [];
        }
        if (_.isEmpty(this.holidays)) {
            let query = new Client.Query(Client.Holiday);
            query.greaterThanOrEqualTo('date', moment().year(year).startOf('year').toDate());
            query.lessThanOrEqualTo('date', moment().year(year).endOf('year').toDate());
            query.addAscending('date');
            let result = await this.backendService.queryListAll('Holiday', query);
            this.holidays = result.list;
        }
    }

    async _fetchPlanItems(annualPlan, year, month, organization, isAnnualPlan = true) {
        const annualPlanId = isAnnualPlan ? annualPlan.objectId : annualPlan.annualPlanId;
        // 先获取阶段计划
        let monthBegin = moment(new Date(year, month-1, 1)).startOf('month').toDate();
        let monthEnd = moment(new Date(year, month-1, 1)).endOf('month').toDate();

        let fromWeek = dateUtils.weekOfMonth(monthBegin);
        let toWeek = dateUtils.weekOfMonth(monthEnd);
        if (fromWeek.month != month) {
            fromWeek = dateUtils.weekOfMonth(moment(monthBegin).add(7, 'days').toDate());
        }
        if (toWeek.month != month) {
            toWeek = dateUtils.weekOfMonth(moment(monthEnd).subtract(7, 'days').toDate());
        }
        let months = _.uniq([fromWeek.weekStart.getMonth()+1, fromWeek.weekEnd.getMonth()+1, toWeek.weekStart.getMonth()+1, toWeek.weekEnd.getMonth()+1]);

        let parseOrgs = organization.parentIds.map(item => this.backendService.getParseObject('Organization', item));

        let query = new Client.Query(Client.StagePlanItem);
        query.equalTo('year', year);
        query.containedIn('month', months);  // 获取跨月份的阶段计划课目
        query.containedIn('organization', parseOrgs);
        query.equalTo('orgCategory', annualPlan.orgCategory);
        if (!_.isEmpty(annualPlan.serviceReq)) {
            query.equalTo('serviceReq', annualPlan.serviceReq);
        }
        if (!_.isEmpty(annualPlan.majors)) {
            query.equalTo('majors', annualPlan.majors[0]);
        }

        let result = await this.backendService.queryListAll('StagePlanItem', query);

        // 针对12月份获取一整年的阶段计划
        if (_.isEmpty(result.list) && month === 12) {
            query = new Client.Query(Client.StagePlanItem);
            query.equalTo('year', year);
            query.containedIn('organization', parseOrgs);
            query.equalTo('orgCategory', annualPlan.orgCategory);
            if (!_.isEmpty(annualPlan.serviceReq)) {
                query.equalTo('serviceReq', annualPlan.serviceReq);
            }
            if (!_.isEmpty(annualPlan.majors)) {
                query.equalTo('majors', annualPlan.majors[0]);
            }

            result = await this.backendService.queryListAll('StagePlanItem', query);
        }
        if (_.isEmpty(result.list)) throw '请先联系支队创建相应的阶段训练计划';
        this.stagePlanItems = result.list.filter(item => item.annualPlanId === annualPlanId);

        // 获取年度计划
        query = new Client.Query(Client.UnitForceAnnualPlanItem);
        if (annualPlanId) {
            query.equalTo('annualPlan', this.backendService.getParseObject('UnitForceAnnualPlan', annualPlanId));
        } else {
            query.containedIn('organization', parseOrgs);
            query.equalTo('orgCategory', annualPlan.orgCategory);
            if (!_.isEmpty(annualPlan.serviceReq)) {
                query.equalTo('serviceReq', annualPlan.serviceReq);
            }
            if (!_.isEmpty(annualPlan.majors)) {
                query.equalTo('majors', annualPlan.majors[0]);
            }
        }

        result = await this.backendService.queryListAll('UnitForceAnnualPlanItem', query);
        this.annualPlanItems = result.list;

        // 获取课目时间状态
        query = new Client.Query(Client.CourseTimeStatus);
        query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
        query.equalTo('year', year);
        query.equalTo('orgCategory', annualPlan.orgCategory);
        if (!_.isEmpty(annualPlan.serviceReq)) {
            query.equalTo('serviceReq', annualPlan.serviceReq);
        }
        if (!_.isEmpty(annualPlan.majors)) {
            query.equalTo('majors', annualPlan.majors[0]);
        }
        result = await this.backendService.queryListAll('CourseTimeStatus', query);

        this.courseTimeStatuses = result.list.filter(item => item.annualPlanId === annualPlanId);
    }


    async _getTimeReqByOrgCategory(orgCategory, personProperty) {
        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);
        let query = new Client.Query(Client.TimeRequirement);
        query.matchesQuery('standard', standardQuery);
        query.equalTo('orgCategory', orgCategory);
        query.equalTo('personProperty', personProperty);
        let result = await this.backendService.queryListAll('TimeRequirement', query);
        return result.list[0];
    }

    async _getDailyScheduleByOrgCategory(orgCategory) {
        let query = new Client.Query(Client.DailySchedule);
        query.equalTo('orgCategories', orgCategory);
        let result = await this.backendService.queryListAll('DailySchedule', query);
        return result.list[0];
    }
}

export default MonthPlanService;
