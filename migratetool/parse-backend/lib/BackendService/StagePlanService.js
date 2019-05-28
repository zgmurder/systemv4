import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import { OrgSequence, OrgSequences, IsZhiDui, SubmitState, InServiceStatus, OrgType, DayType, StandardState, PersonProperty } from '../Constants';
import moment, { monthsShort } from 'moment';
import dateUtils from '../utils/dateUtils';

export class StagePlanService {
    constructor(backend) {
        this.backendService = backend;

        this.trainSteps = [];
        this.holidays = [];

        this.annualPlanItem = null;
        this.stagePlan = null;
        this.officerCourseOptions = [];
        this.orgCourseOptions = [];
    }

    getOfficerCourseOptions(planItem) {
        return _.differenceBy(this.officerCourseOptions, planItem.officerCourses, 'courseId');
    }

    getCourseOptions(planItem) {
        return _.differenceWith(this.orgCourseOptions, planItem.orgCourses, (a, b) => a.courseId===b.courseId && ((_.isEmpty(a.major)&&_.isEmpty(b.major))||(a.major===b.major)));
    }

    fixMajorCourses(annualPlanItem) {
        if (!_.isEmpty(annualPlanItem.majorCoursesV2)) {
            let optionalCourses = annualPlanItem.majorCourses;
            annualPlanItem.majorCourses = annualPlanItem.majorCoursesV2.map(courseV2 => {
                const course = optionalCourses.find(item => item.objectId === courseV2.courseId);
                if (course) {
                    const trainStep = this.trainSteps.find(item => item.name === course.trainStep);
                    course.priority = trainStep&&trainStep.priority || 0;

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

    async getInitStagePlan(annualPlan, annualPlanItem) {
        try {
            let {year, orgCategory, orgProperty, serviceReq, majors} = annualPlan;
            let {task, fromDate, toDate} = annualPlanItem;
            this.annualPlanItem = annualPlanItem;

            let organization = this.backendService.getCurrentOrganization();
            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) throw '未指定单位';
            if (!IsZhiDui(organization.orgSequence)) throw '请指定支队级单位来创建该表';

            let categoryName = orgCategory;
            if (orgCategory.includes('应急')) {
                categoryName = '应急分队';
            } else if (categoryName.endsWith('分队')) {
                categoryName = orgProperty+'分队';
            }
            if (!_.isEmpty(majors)) {
                categoryName = `${categoryName}(${majors.join('、')})`;
            }

            let planName = `${year}年${organization.displayName}${categoryName}${task}训练阶段训练计划`;
            if (!_.isEmpty(serviceReq)) {
                planName = `${year}年${organization.displayName}${categoryName}(${serviceReq})${task}训练阶段训练计划`;
            }

            await this._fetchCommonRules(annualPlan.year);

            this.fixMajorCourses(annualPlanItem);

            // let query = new Client.Query(Client.UnitForceAnnualPlanItem);
            // query.equalTo('annualPlan', this.backendService.getParseObject('UnitForceAnnualPlan', annualPlan.objectId));
            // query.equalTo('task', task);
            // let result = await this.backendService.queryListAll('UnitForceAnnualPlanItem', query);
            // if (_.isEmpty(result.list)) throw '未找到对应的年度训练计划';
            // this.annualPlanItem = result.list[0];

            let stagePlan = undefined;
            let query = new Client.Query(Client.StagePlan);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId))
                .equalTo('orgCategory', orgCategory)
                .equalTo('fromDate', fromDate)
                .equalTo('toDate', toDate)
                //.lessThanOrEqualTo('year', year)
                .descending('year').limit(1);
            if (!_.isEmpty(serviceReq)) {
                query.equalTo('serviceReq', serviceReq);
            }
            if (!_.isEmpty(majors)) {
                query.equalTo('majors', majors[0]);
            }

            let oldStagePlan = {};
            let result = await this.backendService.queryList('StagePlan', query);
            if (!_.isEmpty(result.list)) {
                oldStagePlan = result.list[0];
                // if (stagePlan.year === year) throw `${stagePlan.name}已存在，请不要重复创建`;

                // 拷贝去年的阶段计划
                // query = new Client.Query(Client.StagePlanItem);
                // query.equalTo('stagePlan', this.backendService.getParseObject('StagePlan', stagePlan.objectId));
                // result = await this.backendService.queryListAll('StagePlanItem', query);
                // stagePlan.planItems = result.list.map(item => {
                //     delete item.objectId;
                //     delete item.stagePlan;
                //     item.year = year;
                //     item.annualPlanId = annualPlan.objectId;
                //     return item;
                // });

                // 直接复制之前已经创建的表数据
                // stagePlan.planItems = [];
                // delete stagePlan.objectId;
                // stagePlan.year = year;
                // stagePlan.name = planName;
                // stagePlan.annualPlanItem = annualPlanItem;
                // stagePlan.annualPlanId = annualPlan.objectId;
                // stagePlan.state = SubmitState.Initial;
            }

            {
                stagePlan = {
                    year,
                    organization,
                    orgCategory,
                    orgProperty,
                    serviceReq,
                    majors,
                    name: planName,
                    orgCode: organization.orgCode,
                    createdOrg: this.backendService.getCurrentOrganization(),
                    state: 0,
                    annualPlanItem: annualPlanItem,
                    annualPlanId: annualPlan.objectId,

                    task,
                    subjects: annualPlanItem.subjects,
                    fromDate: annualPlanItem.fromDate,
                    toDate: annualPlanItem.toDate,
                    officerHours: 0,
                    soldierHours: annualPlanItem.hours,

                    planItems: [],

                    activities: oldStagePlan.activities || '',
                    scoreReqs: annualPlanItem.scoreReqs,
                    basicReqs: oldStagePlan.basicReqs || '',
                    methods: oldStagePlan.methods || '',
                    notes: oldStagePlan.notes || '',
                };

                // stagePlan.officerHours = annualPlanItem.officerCourseTimes.reduce((prev, curr) => {
                //     prev += curr.hoursInDay;
                //     prev += curr.hoursAtNight;
                //     return prev;
                // }, 0);

                let months = moment(stagePlan.toDate).month()-moment(stagePlan.fromDate).month()+1;
                for (let i = 0; i < months; i++) {
                    let fromMoment = moment(stagePlan.fromDate);
                    if (i != 0) {
                        fromMoment.add(i, 'months').startOf('month');
                    }

                    let toMoment = moment(fromMoment);
                    toMoment.endOf('month');
                    if (toMoment.toDate()>stagePlan.toDate) toMoment = moment(stagePlan.toDate);

                    let days = this._calcTrainDays(fromMoment.toDate(), toMoment.toDate());
                    let hoursPerDay = +((annualPlan.unitForceTime||{}).timeReq||{}).hoursPerDay || 4;
                    // 应急训练阶段统一按每日7小时计算
                    if (stagePlan.task === '应急') hoursPerDay = 7;

                    let rateAtNight = +((annualPlan.unitForceTime||{}).timeReq||{}).rateAtNight || 15;
                    let hours = days * hoursPerDay;
                    let hoursAtNight = Math.round(hours * rateAtNight / 100);

                    let planItem = {
                        year,
                        month: fromMoment.month()+1,
                        organization,
                        orgCategory,
                        orgProperty,
                        serviceReq,
                        majors,
                        orgCode: organization.orgCode,
                        annualPlanId: annualPlan.objectId,

                        fromDate: fromMoment.toDate(),
                        toDate: toMoment.toDate(),
                        days: days,
                        hours: hours,
                        hoursInDay: hours-hoursAtNight,
                        hoursAtNight: hoursAtNight,
                        officerCourses: [],
                        orgCourses: [],
                    };

                    // 只有一个月时，自动填入所有课目
                    if (months === 1) {
                        planItem.officerCourses = annualPlanItem.officerCourses.map(course => {
                            let trainStep = this.trainSteps.find(item => item.name === course.trainStep);

                            return {
                                seq: course.seq,
                                name: course.name,
                                courseId: course.objectId,
                                major: course.majorReq,
                                ranks: course.rankL2Reqs,
                                gunnerType: course.gunnerType,
                                trainStep: course.trainStep,
                                trainUnits: course.trainUnits,
                                priority: trainStep&&trainStep.priority || 0,
                                tasks: course.tasks,
                                serviceReq: course.serviceReq,
                            }
                        });

                        let orgCourses = annualPlanItem.commonCourses;
                        if (!_.isEmpty(annualPlanItem.majorCourses)) {
                            orgCourses = orgCourses.concat(annualPlanItem.majorCourses);
                        }
                        planItem.orgCourses = orgCourses.map(course => {
                            let trainStep = this.trainSteps.find(item => item.name === course.trainStep);

                            return {
                                seq: course.seq,
                                name: course.name,
                                courseId: course.objectId,
                                major: course.majorReq,
                                ranks: course.rankL2Reqs,
                                gunnerType: course.gunnerType,
                                trainStep: course.trainStep,
                                trainUnits: course.trainUnits,
                                priority: trainStep&&trainStep.priority || 0,
                                tasks: course.tasks,
                                serviceReq: course.serviceReq,
                            }
                        });
                    }

                    stagePlan.planItems.push(planItem);
                }
            }

            this.stagePlan = stagePlan;

            this._generateCourseOptions();


            return stagePlan;
        } catch (exception) {
            console.log(`getInitStagePlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addOrUpdateStagePlan(stagePlan) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            let query = new Client.Query(Client.StagePlan);
            query.equalTo('name', stagePlan.name);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            let result = await this.backendService.queryList('StagePlan', query);
            let exists = result.list;
            if (stagePlan.objectId) {
                exists = exists.filter(item => item.objectId != stagePlan.objectId);
            }
            if (!_.isEmpty(exists)) throw '请不要创建重复标题的阶段训练计划';

            let planItems = stagePlan.planItems;
            delete stagePlan.planItems;

            let resultPlan = await this.backendService.addOrUpdateItem('StagePlan', stagePlan);
            if (!stagePlan.objectId) {
                planItems.forEach(item => {
                    item.stagePlan = resultPlan.objectId;
                })
            }

            await this.backendService.addOrUpdateList('StagePlanItem', planItems);

            // 添加操作记录
            await this.backendService.addOperateRecord({
                tblName: 'StagePlan',
                targetId: resultPlan.objectId,
                operateType: stagePlan.objectId ? '修改' : '创建',
                description: ''
            });

            return await this.getStagePlanDetails(resultPlan.objectId);
        } catch (exception) {
            console.log(`addOrUpdateStagePlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteStagePlan(planId) {
        try {
            if (!this.backendService.isAdmin()) throw '本账号无权限删除阶段计划表';
            const currOrg = this.backendService.getCurrentOrganization();
            const plan = await this.backendService.fetchItem('StagePlan', planId);
            if (currOrg && plan.organization && plan.organization.objectId != currOrg.objectId) throw '无权限删除其他单位创建的阶段计划表';

            let query = new Client.Query(Client.MonthPlan);
            query.equalTo('stagePlan', this.backendService.getParseObject('StagePlan', planId));
            let result = await this.backendService.queryListAll('MonthPlan', query);
            if (!_.isEmpty(result.list)) throw '该阶段计划已经关联创建月计划，不能删除';

            query = new Client.Query(Client.StagePlanItem);
            query.equalTo('stagePlan', this.backendService.getParseObject('StagePlan', planId));
            result = await this.backendService.queryListAll('StagePlanItem', query);
            const planItems = result.list;

            await this.backendService.deleteItem('StagePlan', {objectId: planId});
            if (!_.isEmpty(planItems)) await this.backendService.deleteList('StagePlanItem', planItems);
        } catch (exception) {
            console.log(`deleteStagePlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getStagePlanDetails(objectId) {
        try {
            let stagePlan = await this.backendService.fetchItem('StagePlan', objectId);
            if (_.isEmpty(stagePlan)) throw '找不到对应的阶段计划表';

            let query = new Client.Query(Client.StagePlanItem);
            query.equalTo('stagePlan', this.backendService.getParseObject('StagePlan', objectId));
            query.ascending('month');
            let result = await this.backendService.queryListAll('StagePlanItem', query);
            stagePlan.planItems = result.list;

            this.stagePlan = stagePlan;

            await this._fetchCommonRules(stagePlan.year);

            query = new Client.Query(Client.UnitForceAnnualPlanItem);
            if (stagePlan.annualPlanId) {
                query.equalTo('annualPlan', this.backendService.getParseObject('UnitForceAnnualPlan', stagePlan.annualPlanId));
                query.equalTo('fromDate', stagePlan.fromDate);
            } else {
                query.equalTo('organization', this.backendService.getParseObject('Organization', stagePlan.organization.objectId));
                query.equalTo('orgCategory', stagePlan.orgCategory);
                query.equalTo('fromDate', stagePlan.fromDate);
                if (!_.isEmpty(stagePlan.serviceReq)) {
                    query.equalTo('serviceReq', stagePlan.serviceReq);
                }
                if (!_.isEmpty(stagePlan.majors)) {
                    query.equalTo('majors', stagePlan.majors[0]);
                }
            }

            result = await this.backendService.queryList('UnitForceAnnualPlanItem', query);
            this.annualPlanItem = result.list[0];
            this.fixMajorCourses(this.annualPlanItem);

            this._generateCourseOptions();

            return stagePlan;
        } catch (exception) {
            console.log(`getStagePlanDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 添加/删除课目安排
    updateArrangedCourses({planItem, courseItems, isOfficer=false, isAdd=true}) {
        courseItems.forEach(courseItem => {
            this.updateArrangedCourse({planItem, courseItem, isOfficer, isAdd});
        });
    }

    updateArrangedCourse({planItem, courseItem, isOfficer=false, isAdd=true}) {
        if (_.isEmpty(planItem) || _.isEmpty(courseItem)) return;
        let courseId = courseItem.courseId || courseItem;

        let courses = planItem.orgCourses;
        let courseOptions = this.orgCourseOptions;
        if (isOfficer) {
            courses = planItem.officerCourses;
            courseOptions = this.officerCourseOptions;
        }

        if (isAdd) {
            let existed = courses.find(item => item.courseId === courseId && ((_.isEmpty(item.major)&&_.isEmpty(courseItem.major))||(item.major===courseItem.major)));
            if (!existed) {
                // let course = courseOptions.find(item => item.courseId === courseId);
                // if (!course) return;

                courses.push(courseItem);
                courses = _.sortBy(courses, ['priority', 'major', 'seq']);
                if (isOfficer) planItem.officerCourses = courses;
                else planItem.orgCourses = courses;
            }
        } else {
            _.remove(courses, (item) => item.courseId === courseId && ((_.isEmpty(item.major)&&_.isEmpty(courseItem.major))||(item.major===courseItem.major)));
        }
    }

    async queryStagePlanList(year, selectOrg, query) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            if (_.isEmpty(query)) {
                query = new Client.Query(Client.StagePlan);
                query.limit(100);
            }

            /*if (!_.isEmpty(selectOrg)) {
                selectOrg = await this.backendService.fetchItem('Organization', selectOrg.objectId);
            }*/

            // 在总部/总队查询下级支队的阶段计划表
            if (!organization || organization.orgSequence <= OrgSequence.Division) {
                let queryOrg = organization;
                if (!_.isEmpty(selectOrg) && selectOrg.orgSequence <= OrgSequence.Regiment) {
                    queryOrg = selectOrg;
                }
                if (queryOrg&&queryOrg.orgSequence!=OrgSequence.Army) {
                    let orgQuery = new Client.Query(Client.Organization);
                    orgQuery.equalTo('parentIds', queryOrg.objectId);
                    query.matchesQuery('organization', orgQuery);
                }
            }

            // 支队以下单位，只显示本支队的表单
            if (organization && organization.orgSequence > OrgSequence.Division) {
                let parseOrgs = organization.parentIds.map(item => this.backendService.getParseObject('Organization', item));
                query.containedIn('organization', parseOrgs);
            }
            // 非支队，只查询已发布的表单
            if (!organization || !IsZhiDui(organization.orgSequence)) {
                query.equalTo('state', SubmitState.Submited);
            }
            // 大队及以下分队，只显示对应分队的计划
            if (organization && organization.orgSequence >= OrgSequence.Battalion) {
                let localOrgs = await this.backendService.orgService.getAllChildrenOrgs(organization.objectId);
                let orgCategories = _.uniq(localOrgs.map(item => item.orgCategory));
                if (!_.isEmpty(orgCategories)) {
                    query.containedIn('orgCategory', orgCategories);
                }
            }
            year && query.equalTo('year', year);
            query.addAscending(['orgCode', 'orgCategory', 'serviceReq',  'fromDate']);

            let result = await this.backendService.queryList('StagePlan', query);

            return result;
        } catch (exception) {
            console.log(`getStagePlanList failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    _generateCourseOptions(isOfficer) {
        if (!this.annualPlanItem) return;

        if (isOfficer===undefined||isOfficer===true) {
            // 设置警官课目可选项
            this.officerCourseOptions = this.annualPlanItem.officerCourses.map(course => {
                let trainStep = this.trainSteps.find(item => item.name === course.trainStep);

                return {
                    seq: course.seq,
                    name: course.name,
                    courseId: course.objectId,
                    major: course.majorReq,
                    ranks: course.rankL2Reqs,
                    gunnerType: course.gunnerType,
                    trainStep: course.trainStep,
                    trainUnits: course.trainUnits,
                    priority: trainStep&&trainStep.priority || 0,
                };
            });

            this.officerCourseOptions = _.sortBy(this.officerCourseOptions, ['priority', 'seq']);
        }

        if (isOfficer===undefined||isOfficer===false) {
            let orgCourses = this.annualPlanItem.commonCourses;
            if (!_.isEmpty(this.annualPlanItem.majorCourses)) {
                orgCourses = orgCourses.concat(this.annualPlanItem.majorCourses);
            }

            // 设置单位课目可选项
            this.orgCourseOptions = orgCourses.map(course => {
                let trainStep = this.trainSteps.find(item => item.name === course.trainStep);

                return {
                    seq: course.seq,
                    name: course.name,
                    courseId: course.objectId,
                    major: course.majorReq,
                    ranks: course.rankL2Reqs,
                    gunnerType: course.gunnerType,
                    trainStep: course.trainStep,
                    trainUnits: course.trainUnits,
                    priority: trainStep&&trainStep.priority || 0,
                };
            });

            this.orgCourseOptions = _.sortBy(this.orgCourseOptions, ['priority', 'major', 'seq']);
        }

    }

    _calcTrainDays(fromDate, toDate) {
        let holidays = this.holidays.filter(item => item.date>=fromDate && item.date<=toDate);

        let trainDays = 0;
        let days = moment(toDate).diff(moment(fromDate), 'days');
        for (let i = 0; i < days; i++) {
            let curr = moment(fromDate).add(i, 'days');
            let weekday = curr.weekday();
            let holiday = holidays.find(item => item.date === curr.toDate());
            if (!_.isEmpty(holiday)) {
                if (holiday.type === DayType.Workday) trainDays++;
            } else if (!dateUtils.isWeekend(weekday)) {
                if ([2,4,5].includes(weekday)) trainDays += 0.5;
                else trainDays += 1;
            }
        }

        return trainDays;
    }

    async _fetchCommonRules(year) {
        if (!_.isEmpty(this.holidays) && moment(this.holidays[0].date).year() != year) {
            this.holidays = [];
        }
        if (_.isEmpty(this.holidays)) {
            let query = new Client.Query(Client.Holiday);
            query.greaterThanOrEqualTo('date', moment().year(year).startOf('year').toDate());
            query.lessThanOrEqualTo('date', moment().year(year).endOf('year').toDate());
            let result = await this.backendService.queryListAll('Holiday', query);
            this.holidays = result.list;
        }

        if (_.isEmpty(this.trainSteps)) {
            let result = await this.backendService.queryListAll('TrainStep');
            this.trainSteps = result.list;
        }
    }
}

export default StagePlanService;
