import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import dateUtils from '../utils/dateUtils';
import _ from 'lodash';
import { OrgSequence, OrgSequences, IsZhiDui, SubmitState, Departments, OrgType, StandardState, PersonProperty, DayType } from '../Constants';
import moment from 'moment';

export class AnnualPlanService {
    constructor(backend) {
        this.backendService = backend;

        this.leaderOfficeCourses = [];
        this.leaderOfficeCourseTimes = [];

        this.officerCourses = [];
        this.officerCourseTimes = [];
        this.soldierCourses = [];
        this.soldierCourseTimes = [];
        this.soldierCourseDists = [];
        this.trainSteps = [];
    }

    // 获取初始年度计划汇总表
    async getInitAnnualPlanSummary(organization, year) {
        try {
            if (typeof year === 'object') year = moment(year).year();

            if (_.isEmpty(organization)) {
                organization = this.backendService.getCurrentOrganization();
            }
            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) throw '未指定单位';
            if (organization.orgSequence != OrgSequence.Division) throw '请指定总队级单位来创建该表';

            let summary = undefined;
            let query = new Client.Query(Client.AnnualPlanSummary);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.lessThanOrEqualTo('year', year);
            query.descending('year').limit(1);
            let result = await this.backendService.queryList('AnnualPlanSummary', query);
            if (_.isEmpty(result.list)) {
                summary = {
                    name: `${year}年${organization.name}军事训练计划`,
                    year,
                    organization,
                    orgCode: organization.orgCode,
                    state: 0,
                    personReqs: '',
                    trainContents: '',
                    activities: '',
                    scoreReqs: '',
                    methods: '',
                    annualStages: []
                }
            } else {
                summary = result.list[0];

                query = new Client.Query(Client.AnnualStage);
                query.equalTo('annualSummary', this.backendService.getParseObject('AnnualPlanSummary', summary.objectId));
                result = await this.backendService.queryListAll('AnnualStage', query);
                summary.annualStages = result.list;
                // 已经存在，则直接返回
                if (summary.year === year) throw `${summary.name}已存在，请不要重复创建`;

                // 自动拷贝去年的年度计划数据
                delete summary.objectId;
                summary.year = year;
                summary.name = `${year}年${organization.name}军事训练计划`;
                summary.state = SubmitState.Initial;
                summary.annualStages = summary.annualStages.map(item => {
                    delete item.objectId;
                    delete item.annualSummary;
                    item.year = year;
                    item.stages = item.stages.map(stage => {
                        stage.fromDate = moment(stage.fromDate).year(year).toDate(),
                        stage.toDate = moment(stage.toDate).year(year).toDate()
                        return stage;
                    });
                    return item;
                });
            }

            return summary;
        } catch (exception) {
            console.log(`getInitAnnualPlanSummary failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 更新修改年度计划汇总表
    async addOrUpdateAnnualPlanSummary(summary) {
        try {
            let annualStages = summary.annualStages;
            delete summary.annualStages;

            let returnSummary = await this.backendService.addOrUpdateItem('AnnualPlanSummary', summary);
            if (returnSummary.objectId) {
                annualStages = annualStages.map(item => {
                    item.annualSummary = returnSummary.objectId;
                    item.organization = summary.organization;
                    item.orgCode = summary.orgCode;
                    item.year = summary.year;
                    if (_.isEmpty(item.name)) item.name = this.makeupStageName(item)
                    return item;
                })
            }

            await this.backendService.addOrUpdateList('AnnualStage', annualStages);

            // 添加操作记录
            await this.backendService.addOperateRecord({
                tblName: 'AnnualPlanSummary',
                targetId: returnSummary.objectId,
                operateType: summary.objectId ? '修改' : '创建',
                description: ''
            });

            return await this.getAnnualPlanSummary(returnSummary.objectId);
        } catch (exception) {
            console.log(`addOrUpdateAnnualPlanSummary failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    makeupStageName(stage) {
        let name = stage.orgCategory;
        if (!_.isEmpty(stage.majors)) {
            name = `${name}${_.join(stage.majors, '、')}`;
        }

        return name;
    }

    async deleteAnnualStage(stage) {
        try {
            let retStage = await this.backendService.deleteItem('AnnualStage', stage);

            return await this.getAnnualPlanSummary(stage.annualSummary.objectId);
        } catch (exception) {
            console.log(`deleteAnnualStage failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取年度计划汇总表详情
    async getAnnualPlanSummary2(year, organization) {
        try {
            if (typeof year === 'object') year = moment(year).year();

            if (_.isEmpty(organization)) {
                organization = this.backendService.getCurrentOrganization();
            }

            let query = new Client.Query(Client.AnnualPlanSummary);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.equalTo('year', year);
            query.descending('year').limit(1);
            let result = await this.backendService.queryList('AnnualPlanSummary', query);

            let summary = result.list[0];
            if (!_.isEmpty(summary)) {
                let query = new Client.Query(Client.AnnualStage);
                query.equalTo('annualSummary', this.backendService.getParseObject('AnnualPlanSummary', summary.objectId));
                result = await this.backendService.queryListAll('AnnualStage', query);
                summary.annualStages = result.list;
            }

            return summary;
        } catch (exception) {
            console.log(`getAnnualPlanSummary2 failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getAnnualPlanSummary(objectId) {
        try {
            let summary = await this.backendService.fetchItem('AnnualPlanSummary', objectId);
            if (_.isEmpty(summary)) throw '对应年度计划不存在';

            let query = new Client.Query(Client.AnnualStage);
            query.equalTo('annualSummary', this.backendService.getParseObject('AnnualPlanSummary', objectId));
            let result = await this.backendService.queryListAll('AnnualStage', query);
            summary.annualStages = result.list;

            return summary;
        } catch (exception) {
            console.log(`getAnnualPlanSummary failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async queryAnnualPlanSummary(year, selectOrg, query) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            if (_.isEmpty(query)) {
                query = new Client.Query(Client.AnnualPlanSummary);
                query.limit(100);
            }

            if (!_.isEmpty(selectOrg)) {
                selectOrg = await this.backendService.fetchItem('Organization', selectOrg.objectId||selectOrg);
            }

            // 在总部查询下级总队的年度计划表
            if (!organization || organization.orgSequence === OrgSequence.Army) {
                if (!_.isEmpty(selectOrg) && selectOrg.orgSequence === OrgSequence.Division) {
                    query.equalTo('organization', this.backendService.getParseObject('Organization', selectOrg.objectId));
                }
            }

            // 总部以下单位，只显示本总队的表单
            if (organization && organization.orgSequence > OrgSequence.Army) {
                let parseOrgs = organization.parentIds.map(item => this.backendService.getParseObject('Organization', item));
                query.containedIn('organization', parseOrgs);
            }
            // 非总队，只查询已发布的表单
            if (!organization || organization.orgSequence != OrgSequence.Division) {
                query.equalTo('state', SubmitState.Submited);
            }

            year && query.equalTo('year', year);

            let result = await this.backendService.queryList('AnnualPlanSummary', query);

            return result;
        } catch (exception) {
            console.log(`queryAnnualPlanSummary failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async _getCoursesByOrgCategory(orgCategory, personProperty, serviceReq, majors) {
        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);
        let query = new Client.Query(Client.TrainCourse);
        query.matchesQuery('standard', standardQuery);
        query.equalTo('orgCategories', orgCategory);
        query.equalTo('personProperties', personProperty);
        query.ascending('createdAt');
        let result = await this.backendService.queryListAll('TrainCourse', query);
        let courses = result.list;
        if (!_.isEmpty(serviceReq)) {
            courses = courses.filter(item => _.isEmpty(item.serviceReq) || item.serviceReq.includes(serviceReq));
        }
        if (!_.isEmpty(majors)) {
            courses = courses.filter(item => _.isEmpty(item.majorReq) || majors.includes(item.majorReq));
        }

        return courses;
    }

    async _getCourseTimesByOrgCategory(orgCategory, personProperty, serviceReq) {
        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);
        let query = new Client.Query(Client.CourseTime);
        query.matchesQuery('standard', standardQuery);
        query.equalTo('orgCategories', orgCategory);
        query.equalTo('personProperties', personProperty);
        query.ascending('createdAt');
        let result = await this.backendService.queryListAll('CourseTime', query);
        let courseTimes = result.list;
        if (!_.isEmpty(serviceReq)) {
            courseTimes = courseTimes.filter(item => _.isEmpty(item.serviceReq) || item.serviceReq.includes(serviceReq));
        }

        return courseTimes;
    }

    async _getCourseDistributionsByOrgCategory(orgCategory, personProperty, serviceReq) {
        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);
        let query = new Client.Query(Client.CourseDistribution);
        query.matchesQuery('standard', standardQuery);
        query.equalTo('orgCategories', orgCategory);
        query.equalTo('personProperties', personProperty);
        query.ascending('createdAt');
        let result = await this.backendService.queryListAll('CourseDistribution', query);
        let courseDists = result.list;
        if (!_.isEmpty(serviceReq)) {
            courseDists = courseDists.filter(item => _.isEmpty(item.serviceReq) || item.serviceReq === serviceReq);
        }

        return courseDists;
    }

    async _getCourseTimesByCourseId(courseId) {
        let query = new Client.Query(Client.CourseTime);
        query.equalTo('courses', this.backendService.getParseObject('Course', courseId));
        query.ascending('createdAt');
        let result = await this.backendService.queryListAll('CourseTime', query);

        return result.list;
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

    _statCourseTime(courseTimes) {
        return courseTimes.reduce((prev, curr) => {
            prev.hoursInDay += curr.hoursInDay;
            prev.hoursAtNight += curr.hoursAtNight;

            return prev;
        }, {hoursInDay: 0, hoursAtNight: 0});
    }

    async getInitOfficeAnnualPlan(year, organization, orgCategory) {
        try {
            if (typeof year === 'object') year = year.getFullYear();
            if (_.isEmpty(organization)) {
                organization = this.backendService.getCurrentOrganization();
            }
            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) throw '未指定单位';
            //if (organization.orgSequence != OrgSequence.Division) throw '请指定总队级单位来创建该表';
            if (orgCategory.includes('总部')) throw '不支持创建总部机关年度计划';

            // let query = new Client.Query(Client.OrgCategory);
            // query.equalTo('name', orgCategory);
            // let result = await this.backendService.queryList('OrgCategory', query);
            // let categoryObj = result.list[0];

            let categoryName = orgCategory;
            if (orgCategory.startsWith(organization.orgCategory)) {
                categoryName = categoryName.slice(organization.orgCategory.length);
            }
            categoryName = organization.name + categoryName;
            let planName = `${year}年${categoryName}军事训练计划`;

            let plan = undefined;
            let oldPlan = undefined;
            let query = new Client.Query(Client.OfficeAnnualPlan);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.equalTo('orgCategory', orgCategory);
            query.lessThanOrEqualTo('year', year);
            query.descending('year').limit(1);
            let result = await this.backendService.queryList('OfficeAnnualPlan', query);
            if (!_.isEmpty(result.list)) {
                oldPlan = result.list[0];
                if (oldPlan.year === year) throw `${plan.name}只能创建一张不能重复创建`;
            }

            {
                // 初始化表数据
                query = new Client.Query(Client.TrainStep);
                query.equalTo('orgType', OrgType.LeaderOffice);
                query.ascending('priority');
                result = await this.backendService.queryListAll('TrainStep', query);
                let trainSteps = result.list;

                this.leaderOfficeCourses = await this._getCoursesByOrgCategory(orgCategory, PersonProperty.Officer);
                this.leaderOfficeCourseTimes = await this._getCourseTimesByOrgCategory(orgCategory, PersonProperty.Officer);
                if (_.isEmpty(this.leaderOfficeCourses)) throw `请先录入${orgCategory}的相关训练课目`;

                plan = {
                    name: planName,
                    year,
                    organization,
                    orgCategory,
                    orgCode: organization.orgCode,
                    orgSequence: organization.orgSequence, //orgCategory.includes('总队首长机关')?OrgSequence.Division:OrgSequence.Regiment,
                    courses: [...this.leaderOfficeCourses],
                    timeReq: oldPlan ? oldPlan.timeReq : '',
                    activities: oldPlan ? oldPlan.activities : '',
                    scoreReqs: oldPlan ? oldPlan.scoreReqs : '',
                    methods: oldPlan ? oldPlan.methods : '',
                    notes: oldPlan ? oldPlan.notes : ''
                };

                // 按照表格格式进行排列
                plan.trainSteps = trainSteps.map(step => {
                    let matchedItems = this.leaderOfficeCourseTimes.filter(courseTime => {
                        return (!_.isEmpty(courseTime.courses) && courseTime.courses[0].trainStep === step.name);
                    });

                    // 公共课目
                    let commonItems = matchedItems.filter(item => _.isEmpty(item.courses[0].majorReq));
                    let commonCourses = [];
                    commonItems.map(item => {
                        commonCourses = commonCourses.concat(item.courses.map(cs => ({seq: cs.seq, name: cs.name, courseId: cs.objectId})));
                    });
                    // 统计课目时间
                    // let stats = this._statCourseTime(matchedItems);
                    let commonStats = this._statCourseTime(commonItems);
                    let stats = commonStats;
                    let majorStats = undefined;
                    let majorCourses = [];

                    // 专业课目
                    let majorItems = matchedItems.filter(item => !_.isEmpty(item.courses[0].majorReq));
                    if (!_.isEmpty(majorItems)) {
                        // (只统计同一个专业的课目训练时间，不同专业是并发训练的)
                        let first = majorItems[0];
                        let oneMajorItems = majorItems.filter(item => item.courses[0].majorReq===first.courses[0].majorReq);
                        if(!_.isEmpty(oneMajorItems)) {
                            majorStats = this._statCourseTime(oneMajorItems);
                            stats.hoursInDay += majorStats.hoursInDay;
                            stats.hoursAtNight += majorStats.hoursAtNight;
                        }

                        let allCourses = [];
                        majorItems.map(item => {
                            allCourses = allCourses.concat(item.courses);
                        })

                        // 按表格格式进行构建
                        let department = Departments.find(item => item.orgSeq === plan.orgSequence);
                        let departIndex = 0;
                        let majorIndex = 0;
                        for (let depart of department.departs) {
                            departIndex++;
                            for (let major of depart.majors) {
                                majorIndex++;
                                let items = allCourses.filter(item => item.majorReq === major);
                                if (!_.isEmpty(items)) {
                                    majorCourses = majorCourses.concat(items.map(item => ({
                                        seq: item.seq,
                                        name: item.name,
                                        courseId: item.objectId,
                                        departSeq: departIndex,
                                        depart: depart.name,
                                        majorSeq: majorIndex,
                                        major: major
                                    })));
                                }
                            }
                        }
                        console.log('majorCourses: ', majorCourses);
                    }

                    let stepItem = {
                        name: step.name,
                        ...stats,
                        commonCourses: commonCourses,
                        commonStats: commonStats
                    };

                    if (!_.isEmpty(majorCourses)) {
                        stepItem.majorCourses = majorCourses;
                        stepItem.majorStats = majorStats;
                    }

                    return stepItem;
                });
                plan.trainSteps = plan.trainSteps.filter(item => !_.isEmpty(item.commonCourses));
            }

            console.log('getInitOfficeAnnualPlan', plan);

            return plan;
        } catch (exception) {
            console.log(`getInitOfficeAnnualPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getOfficeAnnualPlanDetails(objectId) {
        try {
            let plan = await this.backendService.fetchItem('OfficeAnnualPlan', objectId);

            this.leaderOfficeCourses = await this._getCoursesByOrgCategory(plan.orgCategory, PersonProperty.Officer);
            this.leaderOfficeCourseTimes = await this._getCourseTimesByOrgCategory(plan.orgCategory, PersonProperty.Officer);

            return plan;
        } catch (exception) {
            console.log(`getOfficeAnnualPlanDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async queryLocalOfficeAnnualPlanList(year) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            let query = new Client.Query(Client.OfficeAnnualPlan);
            query.limit(100);

            if (!organization) return {total: 0, list: []};

            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            year && query.equalTo('year', year);
            query.addDescending(['year']);

            let result = await this.backendService.queryList('OfficeAnnualPlan', query);

            console.log('queryLocalOfficeAnnualPlanList', result)

            return result;
        } catch (exception) {
            console.log(`queryLocalOfficeAnnualPlanList failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async queryOfficeAnnualPlanList(year, selectOrg, query) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            if (_.isEmpty(query)) {
                query = new Client.Query(Client.OfficeAnnualPlan);
                query.limit(100);
            }

            //大队及以下分队
            if (organization && organization.orgSequence >= OrgSequence.Battalion) {
                return {total: 0, list: []};
            }

            if (!_.isEmpty(selectOrg)) {
                selectOrg = await this.backendService.fetchItem('Organization', selectOrg.objectId);
            }

            // 在总部/总队查询下级总队/支队的首长机关年度计划表
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

            // 非总队，只查询已发布的表单
            query.equalTo('state', SubmitState.Submited);
            year && query.equalTo('year', year);
            query.addAscending(['orgCode', 'orgCategory']);

            let result = await this.backendService.queryList('OfficeAnnualPlan', query);

            console.log('queryOfficeAnnualPlanList', result)

            return result;
        } catch (exception) {
            console.log(`queryOfficeAnnualPlanList failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteOfficeAnnualPlan(planId) {
        try {
            if (!this.backendService.isAdmin()) throw '本账号无权限删除年度计划表';
            const currOrg = this.backendService.getCurrentOrganization();
            const plan = await this.backendService.fetchItem('OfficeAnnualPlan', planId);
            if (currOrg && plan.organization && plan.organization.objectId != currOrg.objectId) throw '无权限删除其他单位创建的年度计划表';

            await this.backendService.deleteItem('OfficeAnnualPlan', {objectId: planId});
        } catch (exception) {
            console.log(`deleteOfficeAnnualPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    getOptionalCoursesForOfficeAnnualPlan(officeAnnualPlan) {
        // try {
        //     let {orgCategory} = officeAnnualPlan;
        //
        //     let courses = await this._getCoursesByOrgCategory(orgCategory, PersonProperty.Officer);
        //
        //     return _.differenceBy(courses, officeAnnualPlan.courses, 'objectId');
        // } catch (exception) {
        //     console.log(`getOptionalCoursesForOfficeAnnualPlan failed! exception:${exception}`);
        //     let result = parseUtils.getErrorMessage(exception);
        //     if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
        //     throw result;
        // }

        // console.log(this.leaderOfficeCourses, officeAnnualPlan)
        return _.differenceBy(this.leaderOfficeCourses, officeAnnualPlan.courses, 'objectId');
    }

    updateCoursesForOfficeAnnualPlan(annualPlan, courses, isAdd=true) {
        (courses||[]).forEach(course => {
            this.updateCourseForOfficeAnnualPlan(annualPlan, course, isAdd);
        })

        console.log('updateCoursesForOfficeAnnualPlan', annualPlan)
    }

    updateCourseForOfficeAnnualPlan(annualPlan, course, isAdd=true) {
        let courseId = course&&course.objectId || course;
        if (_.isEmpty(course)) throw '请指定课目';
        if (_.isString(course)) {
            // course = await this.backendService.fetchItem('Course', course);
            course = this.leaderOfficeCourses.find(item => item.objectId === course);
        }

        let stepItem = annualPlan.trainSteps.find(step => step.name === course.trainStep);
        if (_.isEmpty(stepItem)) throw '该课目未定义训练步骤';
        if (isAdd) {
            if (!_.isEmpty(stepItem.commonCourses)) {
                let found = stepItem.commonCourses.find(item => item.courseId === courseId);
                if (found) throw `课目${course.name}已经添加，请不要重复添加`;
            }
            if (!_.isEmpty(stepItem.majorCourses)) {
                let found = stepItem.majorCourses.find(item => item.courseId === courseId);
                if (found) throw `课目${course.name}已经添加，请不要重复添加`;
            }
        }

        // let courseTimes = await this._getCourseTimesByCourseId(courseId);
        // if (_.isEmpty(courseTimes)) throw `课目${course.name}没有录入时间参考表，不能添加`;
        // let courseTime = courseTimes[0];
        let courseTime = this.leaderOfficeCourseTimes.find(item => (item.courses||[]).findIndex(course => course.objectId===courseId)>=0);
        if (_.isEmpty(courseTime)) throw `课目${course.name}没有录入时间参考表，不能添加`;
        let major = course.majorReq;

        if (isAdd) {
            // 添加课目
            annualPlan.courses.push(course);
            if (_.isEmpty(major)) {
                stepItem.commonCourses = stepItem.commonCourses||[];

                // 检测课目时间表里是否有合并课目已经存在(针对多个课目共用一个时间的情况)
                let found = stepItem.commonCourses.find(item1 => {
                    return courseTime.courses.find(item2 => item2.objectId === item1.courseId);
                });

                stepItem.commonCourses.push({
                    seq: course.seq,
                    name: course.name,
                    courseId: course.objectId
                });
                stepItem.commonCourses = _.sortBy(stepItem.commonCourses, ['seq']);
                if (!found) {
                    stepItem.hoursInDay += courseTime.hoursInDay;
                    stepItem.hoursAtNight += courseTime.hoursAtNight;

                    if (!_.isEmpty(stepItem.commonStats)) {
                        stepItem.commonStats.hoursInDay += courseTime.hoursInDay;
                        stepItem.commonStats.hoursAtNight += courseTime.hoursAtNight;
                    }
                }
            } else {
                stepItem.majorCourses = stepItem.majorCourses||[];

                // 检测课目时间表里是否有合并课目已经存在(针对多个课目共用一个时间的情况)
                // let found = stepItem.majorCourses.find(item1 => {
                //     return courseTime.courses.find(item2 => item2.objectId === item1.courseId);
                // });

                let department = Departments.find(item => item.orgSeq === annualPlan.orgSequence);
                let departIndex = 0;
                for (let depart of department.departs) {
                    departIndex++;
                    let found = depart.majors.find(item => item === major);
                    let foundIndex = depart.majors.findIndex(item => item === major);
                    if (found) {
                        stepItem.majorCourses.push({
                            seq: course.seq,
                            name: course.name,
                            courseId: course.objectId,
                            departSeq: departIndex,
                            depart: depart.name,
                            majorSeq: foundIndex,
                            major: major
                        });
                        break;
                    }
                }

                stepItem.majorCourses = _.sortBy(stepItem.majorCourses, ['departSeq', 'majorSeq', 'seq']);
                // if (!found) {
                //     stepItem.hoursInDay += courseTime.hoursInDay;
                //     stepItem.hoursAtNight += courseTime.hoursAtNight;
                //     if (!_.isEmpty(stepItem.majorStats)) {
                //         stepItem.majorStats.hoursInDay += courseTime.hoursInDay;
                //         stepItem.majorStats.hoursAtNight += courseTime.hoursAtNight;
                //     }
                // }
            }
        } else {
            // 删除课目
            _.remove(annualPlan.courses, (item) => item.objectId === course.objectId);

            if (_.isEmpty(major)) {
                if (!_.isEmpty(stepItem.commonCourses)) {
                    _.remove(stepItem.commonCourses, item => item.courseId === course.objectId);

                    // 检测课目时间表里是否有合并课目已经存在(针对多个课目共用一个时间的情况)
                    let found = stepItem.commonCourses.find(item1 => {
                        return courseTime.courses.find(item2 => item2.objectId === item1.courseId);
                    });
                    if (!found) {
                        stepItem.hoursInDay -= courseTime.hoursInDay;
                        stepItem.hoursAtNight -= courseTime.hoursAtNight;

                        if (!_.isEmpty(stepItem.commonStats)) {
                            stepItem.commonStats.hoursInDay -= courseTime.hoursInDay;
                            stepItem.commonStats.hoursAtNight -= courseTime.hoursAtNight;
                        }
                    }
                }
            } else {
                if (!_.isEmpty(stepItem.majorCourses)) {
                    _.remove(stepItem.majorCourses, item => item.courseId === course.objectId);

                    // 检测课目时间表里是否有合并课目已经存在(针对多个课目共用一个时间的情况)
                    // let found = stepItem.majorCourses.find(item1 => {
                    //     return courseTime.courses.find(item2 => item2.objectId === item1.courseId);
                    // });
                    // if (!found) {
                    //     stepItem.hoursInDay -= courseTime.hoursInDay;
                    //     stepItem.hoursAtNight -= courseTime.hoursAtNight;
                    //
                    //     if (!_.isEmpty(stepItem.majorStats)) {
                    //         stepItem.majorStats.hoursInDay -= courseTime.hoursInDay;
                    //         stepItem.majorStats.hoursAtNight -= courseTime.hoursAtNight;
                    //     }
                    // }
                }
            }
        }

        return annualPlan;
    }

    async getOptionalAnnualStage(year, organization) {
        try {
            let orgId = organization&&organization.objectId || organization;
            let query = new Client.Query(Client.AnnualStage);
            query.equalTo('organization', this.backendService.getParseObject('Organization', orgId));
            query.equalTo('year', year);
            let result = await this.backendService.queryListAll('AnnualStage', query);
            return result.list;
        } catch (exception) {
            console.log(`getOptionalAnnualStage failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 分队年度计划表中警官可选课目
    getOptionalOfficerCourses(unitForceAnnualPlan) {
        // let selectedCourses = [];
        // if (unitForceAnnualPlan.planItems) {
        //     unitForceAnnualPlan.planItems.map(item => {
        //         selectedCourses = selectedCourses.concat(item.officerCourses);
        //     });
        // }

        // return _.differenceWith(this.officerCourses, selectedCourses, (a, b) => a.objectId === b.objectId);
        return this.officerCourses;
    }

    // 分队年度计划表中分队可选课目
    getOptionalUnitForceCourses(planItem) {
        // let {courses, courseTimes} = this.getAllUnitForceCoursesByStage(planItem);
        const returnItem = this.getAllUnitForceCoursesByStage2(planItem);
        let allCourses = returnItem.commonCourses;
        if (!_.isEmpty(returnItem.majorCourses)) allCourses = allCourses.concat(returnItem.majorCourses);

        let selectedCourses = planItem.commonCourses;
        if (!_.isEmpty(planItem.majorCourses)) selectedCourses = selectedCourses.concat(planItem.majorCourses);

        let results = _.differenceWith(allCourses, selectedCourses,
            (a, b) => a.objectId === b.objectId && ((_.isEmpty(a.majorReq) && _.isEmpty(b.majorReq)) || _.isEqual(a.majorReq, b.majorReq)));
        // if (!_.isEmpty(trainStep)) {
        //     courses = courses.filter(item => item.trainStep === trainStep);
        // }

        return results;
    }

    getAllUnitForceCoursesByStage(planItem) {
        let courseDists = this.soldierCourseDists.filter(item =>
            item.task === planItem.task
            // && _.intersection(item.subjects, planItem.subjects).length>0
        );

        let courseTimesWithTask = this.soldierCourseTimes.filter(item =>
            !_.isEmpty(item.tasks) && item.tasks.includes(planItem.task)
        );

        // let courses = this.soldierCourses.filter(item =>
        //     !_.isEmpty(item.tasks) && item.tasks.includes(planItem.task)
        // );
        let courses = this.soldierCourses;

        if (!_.isEmpty(courseDists)) {
            const tmpCourses = courseDists.map(item => item.course);
            courses = _.intersectionBy(courses, tmpCourses, 'objectId');
        } else {
            let tmpCourses = [];
            courseTimesWithTask.forEach(courseTime => {
                tmpCourses = tmpCourses.concat(courseTime.courses);
            });
            courses = _.intersectionBy(courses, tmpCourses, 'objectId');
        }

        // console.log(planItem.task, courses)

        // let courseTimes = _.intersectionWith(courseTimesWithTask, courses, (a, b) => a.courses.findIndex(course => course.objectId === b.objectId)>=0);
        let courseTimes = courseTimesWithTask.map(item => ({
            majorReq: planItem.orgCategory.includes('工兵分队')?item.major:(item.courses[0]||{}).majorReq,
            courseIds: (item.courses||[]).map(course => course.objectId),
            hoursInDay: item.hoursInDay,
            hoursAtNight: item.hoursAtNight
        }));
        if (!_.isEmpty(planItem.majors)) {
            courseTimes = courseTimes.filter(item => _.isEmpty(item.majorReq) || planItem.majors.includes(item.majorReq));
        }
        courseTimes = courseTimes.filter(item => !_.isEmpty(item.courseIds));


        // console.log(333, courseTimes)
        // let results = courseTimes.map(item => {
        //     let trainStepObj = this.trainSteps.find(step => step.name === item.course.trainStep);
        //     return {
        //         seq: item.course.seq,
        //         name: item.course.name,
        //         courseId: item.course.objectId,
        //         major: item.course.majorReq,
        //         trainStep: item.course.trainStep,
        //         priority: trainStepObj&&trainStepObj.priority || 0,
        //         trainUnits: item.course.trainUnits,
        //         hoursInDay: item.hoursInDay,
        //         hoursAtNight: item.hoursAtNight
        //     }
        // });
        // return _.sortBy(results, ['priority', 'seq']);
        return {courses, courseTimes};
    }

    getAllUnitForceCoursesByStage2(planItem) {
        let {courses, courseTimes} = this.getAllUnitForceCoursesByStage(planItem);
        let returnItem = {};

        returnItem.commonCourseTimes = courseTimes.filter(item => _.isEmpty(item.majorReq));
        returnItem.majorCourseTimes = courseTimes.filter(item => !_.isEmpty(item.majorReq));
        returnItem.commonCourses = [];
        returnItem.majorCourses = [];
        returnItem.commonCourseTimes.forEach(courseTime => {
            const tmpCourses = courseTime.courseIds.map(id => {
                const tmp = courses.find(item => item.objectId === id);
                if (!tmp) console.log('doesnt find course with id', id);
                return {...tmp};
            });
            returnItem.commonCourses = returnItem.commonCourses.concat(tmpCourses);
        });
        returnItem.majorCourseTimes.forEach(courseTime => {
            const tmpCourses = courseTime.courseIds.map(id => {
                const tmp = courses.find(item => item.objectId === id);
                return {
                    ...tmp,
                    majorReq: courseTime.majorReq
                };
            });
            returnItem.majorCourses = returnItem.majorCourses.concat(tmpCourses);
        });
        returnItem.commonCourses = returnItem.commonCourses.filter(item => item);
        returnItem.majorCourses = returnItem.majorCourses.filter(item => item);
        returnItem.majorCoursesV2 = returnItem.majorCourses.map(item => ({
            majorReq: item.majorReq,
            courseId: item.objectId
        }));

        return returnItem;
    }

    // updateCoursesForUnitForceAnnualPlan(planItem, courseIds, isOfficer=true, isAdd=true) {
    //     let allCourses = [];
    //     let allCourseTimes = [];
    //     if (isOfficer) {
    //         allCourses = this.officerCourses;
    //         allCourseTimes = this.officerCourseTimes;
    //     } else {
    //         let {courses, courseTimes} = this.getAllUnitForceCoursesByStage(planItem);
    //         allCourses = courses;
    //         allCourseTimes = courseTimes;
    //     }

    //     courseIds.forEach(courseId => {
    //         this.updateCourseForUnitForceAnnualPlan({planItem, courseId, isOfficer, isAdd, allCourses, allCourseTimes})
    //     })
    // }

    // updateCourseForUnitForceAnnualPlan({planItem, courseId, isOfficer=true, isAdd=true, allCourses, allCourseTimes}) {
    //     if (isAdd) {
    //         if (isOfficer) {
    //             if (planItem.officerCourses.findIndex(item => item.objectId === courseId)>=0) return;

    //             let course = allCourses.find(item => item.objectId === courseId);
    //             if (!course) return;

    //             planItem.officerCourses.push(course);
    //             planItem.officerCourses = _.sortBy(planItem.officerCourses, ['priority', 'seq']);
    //             let courseTime = planItem.officerCourseTimes.find(item => item.courseIds.includes(course.objectId));
    //             if (!courseTime) {
    //                 courseTime = allCourseTimes.find(courseTime => courseTime.courses.find(item => item.objectId === course.objectId));
    //                 if (courseTime) planItem.officerCourseTimes.push({
    //                     courseIds: courseTime.courses.map(item => item.objectId),
    //                     hoursInDay: courseTime.hoursInDay,
    //                     hoursAtNight: courseTime.hoursAtNight
    //                 });
    //             }
    //         } else {
    //             let course = allCourses.find(item => item.objectId === courseId);

    //             if (_.isEmpty(course.majorReq)) {
    //                 if (planItem.commonCourses.findIndex(item => item.objectId === courseId)>=0) return;

    //                 planItem.commonCourses.push(course);
    //                 planItem.commonCourses = _.sortBy(planItem.commonCourses, ['priority', 'seq']);

    //                 let foundCourseTime = planItem.commonCourseTimes.find(item => item.courseIds.includes(course.objectId));
    //                 if (!foundCourseTime) {
    //                     foundCourseTime = allCourseTimes.find(item => item.courseIds.includes(course.objectId));
    //                     if (foundCourseTime) {
    //                         planItem.commonCourseTimes.push(foundCourseTime);
    //                     } else {
    //                         console.log(`course ${course.name}'s coursetime is not found`);
    //                     }
    //                 }
    //             } else {
    //                 if (planItem.majorCourses.findIndex(item => item.objectId === courseId)>=0) return;

    //                 planItem.majorCourses.push(course);
    //                 planItem.majorCourses = _.sortBy(planItem.majorCourses, ['priority', 'seq']);

    //                 // 专业训练课目时间默认将一个专业的课时全部包含进去，不做修改统计
    //                 let foundCourseTime = planItem.majorCourseTimes.find(item => item.courseIds.includes(course.objectId));
    //                 if (!foundCourseTime) {
    //                     foundCourseTime = allCourseTimes.find(item => item.courseIds.includes(course.objectId));
    //                     if (foundCourseTime) {
    //                         planItem.majorCourseTimes.push(foundCourseTime);
    //                     } else {
    //                         console.log(`course ${course.name}'s coursetime is not found`);
    //                     }
    //                 }
    //             }
    //         }
    //     } else {
    //         if (isOfficer) {
    //             let course = _.remove(planItem.officerCourses, (item) => item.objectId === courseId);
    //             course = course[0];
    //             if (course) {
    //                 // 找到时间参考表进行删除
    //                 let courseTime = planItem.officerCourseTimes.find(item => item.courseIds.includes(course.objectId));
    //                 if (courseTime) {
    //                     let existed = planItem.officerCourses.find(item => courseTime.courseIds.includes(item.objectId));
    //                     if (!existed) {
    //                         _.remove(planItem.officerCourseTimes, (item) => item.courseIds === courseTime.courseIds);
    //                     }
    //                 }
    //             }
    //         } else {
    //             let course = _.remove(planItem.commonCourses, (item) => item.objectId === courseId);
    //             course = course[0];
    //             if (course) {
    //                 // 找到时间参考表进行删除
    //                 let courseTime = planItem.commonCourseTimes.find(item => item.courseIds.includes(course.objectId));
    //                 if (courseTime) {
    //                     let existed = planItem.commonCourses.find(item => courseTime.courseIds.includes(item.objectId));
    //                     if (!existed) {
    //                         _.remove(planItem.commonCourseTimes, (item) => item.courseIds === courseTime.courseIds);
    //                     }
    //                 }
    //             } else if (!_.isEmpty(planItem.majorCourses)){
    //                 course = _.remove(planItem.majorCourses, (item) => item.objectId === courseId);
    //                 course = course[0];
    //                 if (course) {
    //                     // 找到时间参考表进行删除
    //                     let courseTime = planItem.majorCourseTimes.find(item => item.courseIds.includes(course.objectId));
    //                     if (courseTime) {
    //                         let existed = planItem.majorCourses.find(item => courseTime.courseIds.includes(item.objectId));
    //                         if (!existed) {
    //                             _.remove(planItem.majorCourseTimes, (item) => item.courseIds === courseTime.courseIds);
    //                         }
    //                     }
    //                 }
    //             }

    //         }
    //     }
    // }

    updateCoursesForUnitForceAnnualPlan(planItem, courses, isOfficer=true, isAdd=true) {
        let allCourses = [];
        let allCourseTimes = [];
        if (isOfficer) {
            allCourses = this.officerCourses;
            allCourseTimes = this.officerCourseTimes;
        } else {
            const returnItem = this.getAllUnitForceCoursesByStage2(planItem);
            allCourses = returnItem.commonCourses.concat(returnItem.majorCourses);
            allCourseTimes = returnItem.commonCourseTimes.concat(returnItem.majorCourseTimes);
        }

        (courses||[]).forEach(course => {
            this.updateCourseForUnitForceAnnualPlan({planItem, course, isOfficer, isAdd, allCourses, allCourseTimes})
        })

        console.log('updateCoursesForUnitForceAnnualPlan', planItem)
    }

    updateCourseForUnitForceAnnualPlan({planItem, course, isOfficer=true, isAdd=true, allCourses, allCourseTimes}) {
        if (isAdd) {
            if (isOfficer) {
                if (planItem.officerCourses.findIndex(item => item.objectId === course.objectId)>=0) return;

                planItem.officerCourses.push(course);
                planItem.officerCourses = _.sortBy(planItem.officerCourses, ['priority', 'seq']);
                let courseTime = planItem.officerCourseTimes.find(item => item.courseIds.includes(course.objectId));
                if (!courseTime) {
                    courseTime = allCourseTimes.find(courseTime => courseTime.courses.find(item => item.objectId === course.objectId));
                    if (courseTime) planItem.officerCourseTimes.push({
                        courseIds: courseTime.courses.map(item => item.objectId),
                        hoursInDay: courseTime.hoursInDay,
                        hoursAtNight: courseTime.hoursAtNight
                    });
                }
            } else {
                if (_.isEmpty(course.majorReq)) {
                    if (planItem.commonCourses.findIndex(item => item.objectId === course.objectId)>=0) return;

                    planItem.commonCourses.push(course);
                    planItem.commonCourses = _.sortBy(planItem.commonCourses, ['priority', 'seq']);

                    let foundCourseTime = planItem.commonCourseTimes.find(item => item.courseIds.includes(course.objectId));
                    if (!foundCourseTime) {
                        foundCourseTime = allCourseTimes.find(item => item.courseIds.includes(course.objectId));
                        if (foundCourseTime) {
                            planItem.commonCourseTimes.push(foundCourseTime);
                        } else {
                            console.log(`course ${course.name}'s coursetime is not found`);
                        }
                    }
                } else {
                    if (planItem.majorCourses.findIndex(item => item.objectId === course.objectId && item.majorReq === course.majorReq)>=0) return;

                    planItem.majorCourses.push(course);
                    planItem.majorCourses = _.sortBy(planItem.majorCourses, ['priority', 'majorReq', 'seq']);
                    planItem.majorCoursesV2 = planItem.majorCourses.map(item => ({
                        majorReq: item.majorReq,
                        courseId: item.objectId
                    }));

                    // 专业训练课目时间默认将一个专业的课时全部包含进去，不做修改统计
                    let foundCourseTime = planItem.majorCourseTimes.find(item => item.courseIds.includes(course.objectId) && item.majorReq === course.majorReq);
                    if (!foundCourseTime) {
                        foundCourseTime = allCourseTimes.find(item => item.courseIds.includes(course.objectId) && item.majorReq === course.majorReq);
                        if (foundCourseTime) {
                            planItem.majorCourseTimes.push(foundCourseTime);
                        } else {
                            console.log(`course ${course.name}'s coursetime is not found`);
                        }
                    }
                }
            }
        } else {
            if (isOfficer) {
                _.remove(planItem.officerCourses, (item) => item.objectId === course.objectId);
                if (course) {
                    // 找到时间参考表进行删除
                    let courseTime = planItem.officerCourseTimes.find(item => item.courseIds.includes(course.objectId));
                    if (courseTime) {
                        let existed = planItem.officerCourses.find(item => courseTime.courseIds.includes(item.objectId));
                        if (!existed) {
                            _.remove(planItem.officerCourseTimes, (item) => item.courseIds === courseTime.courseIds);
                        }
                    }
                }
            } else {
                if (_.isEmpty(course.majorReq)) {
                    _.remove(planItem.commonCourses, (item) => item.objectId === course.objectId);
                    // 找到时间参考表进行删除
                    let courseTime = planItem.commonCourseTimes.find(item => item.courseIds.includes(course.objectId));
                    if (courseTime) {
                        let existed = planItem.commonCourses.find(item => courseTime.courseIds.includes(item.objectId));
                        if (!existed) {
                            _.remove(planItem.commonCourseTimes, (item) => item.courseIds === courseTime.courseIds);
                        }
                    }
                } else if (!_.isEmpty(planItem.majorCourses)) {
                    _.remove(planItem.majorCourses, (item) => item.objectId === course.objectId && item.majorReq === course.majorReq);
                    planItem.majorCoursesV2 = planItem.majorCourses.map(item => ({
                        majorReq: item.majorReq,
                        courseId: item.objectId
                    }));
                    if (course) {
                        // 找到时间参考表进行删除
                        let courseTime = planItem.majorCourseTimes.find(item => item.courseIds.includes(course.objectId) && item.majorReq === course.majorReq);
                        if (courseTime) {
                            let existed = planItem.majorCourses.find(item => courseTime.courseIds.includes(item.objectId) && item.majorReq === courseTime.majorReq);
                            if (!existed) {
                                _.remove(planItem.majorCourseTimes, (item) => item.courseIds === courseTime.courseIds && item.majorReq === courseTime.majorReq);
                            }
                        }
                    }
                }

            }
        }
    }

    async _fetchCourses(orgCategory, serviceReq, majors) {
        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);
        let query = new Client.Query(Client.TrainCourse);
        query.matchesQuery('standard', standardQuery);
        query.equalTo('orgCategories', orgCategory);
        query.ascending('createdAt');
        let result = await this.backendService.queryListAll('TrainCourse', query);
        let courses = result.list;

        if (_.isEmpty(courses)) throw `请先联系统管理员录入${orgCategory}相关的训练课目`;

        if (!_.isEmpty(serviceReq)) {
            courses = courses.filter(item => _.isEmpty(item.serviceReq) || item.serviceReq.includes(serviceReq));
        }
        if (!_.isEmpty(majors)) {
            courses = courses.filter(item => _.isEmpty(item.majorReq) || majors.includes(item.majorReq));
        }

        this.officerCourses = courses.filter(item =>
            (item.personProperties && item.personProperties.length === 1 && item.personProperties[0] === PersonProperty.Officer)
        );

        this.soldierCourses = _.differenceWith(courses, this.officerCourses, (a, b) => a.objectId === b.objectId);

        let officerCourseTimes = await this._getCourseTimesByOrgCategory(orgCategory, PersonProperty.Officer);
        this.officerCourseTimes = officerCourseTimes.filter(item => item.personProperties&&item.personProperties.length === 1);

        this.soldierCourseTimes = await this._getCourseTimesByOrgCategory(orgCategory, PersonProperty.Soldier, serviceReq);
        this.soldierCourseDists = await this._getCourseDistributionsByOrgCategory(orgCategory, PersonProperty.Soldier, serviceReq);

        if (_.isEmpty(this.trainSteps)) {
            let result = await this.backendService.queryListAll('TrainStep');
            this.trainSteps = result.list;
        }

        this.officerCourses = this.officerCourses.map(course => {
            const trainStep = this.trainSteps.find(item => item.name === course.trainStep);
            course.priority = trainStep&&trainStep.priority || 0;
            return course;
        });
        this.officerCourses = _.sortBy(this.officerCourses, ['priority', 'seq']);

        this.soldierCourses = this.soldierCourses.map(course => {
            const trainStep = this.trainSteps.find(item => item.name === course.trainStep);
            course.priority = trainStep&&trainStep.priority || 0;
            return course;
        });
        this.soldierCourses = _.sortBy(this.soldierCourses, ['priority', 'createdAt']);

        return 1;
    }

    // 获取分队年度训练计划初始表数据，传入AnnualStage对象即可
    async getInitUnitForceAnnualPlan(annualStage, serviceReq) {
        try {
            let {year, orgCategory, majors} = annualStage;
            let organization = this.backendService.getCurrentOrganization();
            if (_.isEmpty(organization)) throw '未指定单位';
            if (!IsZhiDui(organization.orgSequence)) throw '请指定支队级单位来创建该表';

            let query = new Client.Query(Client.OrgCategory);
            query.equalTo('name', orgCategory);
            let result = await this.backendService.queryList('OrgCategory', query);
            let categoryObj = result.list[0];

            let categoryName = orgCategory;
            if (orgCategory.includes('应急')) {
                categoryName = '应急分队';
            } else if (categoryObj&&categoryName.endsWith('分队')) {
                categoryName = categoryObj.orgProperty+'分队';
            }
            if (!_.isEmpty(majors)) {
                categoryName = `${categoryName}(${majors.join('、')})`;
            }
            // if (orgCategory.startsWith(organization.orgCategory)) {
            //     categoryName = categoryName.slice(organization.orgCategory.length);
            // }
            categoryName = organization.name + categoryName;
            let planName = _.isEmpty(serviceReq)?`${year}年${categoryName}军事训练计划`:`${year}年${categoryName}(${serviceReq})军事训练计划`;

            result = await this._fetchCourses(orgCategory, serviceReq, majors);
            let trainSteps = _.uniq(_.map(this.soldierCourses, 'trainStep'));

            await this._fetchCommonRules(year);

            // 检测是否已经存在
            let annualPlan = undefined;
            query = new Client.Query(Client.UnitForceAnnualPlan);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.equalTo('orgCategory', orgCategory);
            if (!_.isEmpty(serviceReq)) {
                query.equalTo('serviceReq', serviceReq);
            }
            if (!_.isEmpty(majors)) {
                query.equalTo('majors', majors[0]);
            }
            query.lessThanOrEqualTo('year', year);
            query.descending('year').limit(1);
            result = await this.backendService.queryList('UnitForceAnnualPlan', query);
            if (_.isEmpty(majors)) {
                result.list = result.list.filter(item => _.isEmpty(item.majors));
            }
            // if (!_.isEmpty(result.list) && result.list[0].year === year) throw `${planName}已存在，请不要重复创建`;
            let template = result.list[0];

            // if (_.isEmpty(result.list))
            {
                if (!template) {
                    query = new Client.Query(Client.UnitForceAnnualPlan);
                    query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
                    query.equalTo('year', year);
                    query.limit(1);
                    result = await this.backendService.queryList('UnitForceAnnualPlan', query);
                    template = result.list[0];
                }

                let officerTimeReq = await this._getTimeReqByOrgCategory(orgCategory, PersonProperty.Officer);
                let soldierTimeReq = await this._getTimeReqByOrgCategory(orgCategory, PersonProperty.Soldier);

                annualPlan = {
                    year,
                    organization,
                    orgCategory,
                    serviceReq,
                    majors,
                    name: planName,
                    orgCode: organization.orgCode,
                    orgProperty: categoryObj.orgProperty,
                    state: 0,

                    trainSteps,

                    officerTime: officerTimeReq,
                    unitForceTime: soldierTimeReq,
                    activities: (template&&template.activities) || '',
                    scoreReqs: (template&&template.scoreReqs) || '',
                    methods: (template&&template.methods) || '',
                    notes: (template&&template.notes) || ''
                };

                annualStage.stages = _.sortBy(annualStage.stages, 'fromDate');
                annualPlan.planItems = annualStage.stages.map(stage => {
                    let days = this._calcTrainDays(stage.fromDate, stage.toDate);

                    let hoursPerDay = +(soldierTimeReq&&(soldierTimeReq.timeReq||{}).hoursPerDay || 4);
                    // 应急训练阶段统一按每日7小时计算
                    if (stage.task === '应急') hoursPerDay = 7;
                    let rateAtNight = +(soldierTimeReq&&(soldierTimeReq.timeReq||{}).rateAtNight || 0);
                    let hours = days*hoursPerDay;
                    let hoursAtNight = Math.floor(hours*rateAtNight/100)

                    let taskObj = categoryObj.optionalTasks.find(item => item.name === stage.task);

                    let planItem = {
                        year,
                        organization,
                        orgCategory,
                        serviceReq,
                        majors,
                        orgCode: organization.orgCode,
                        orgProperty: categoryObj.orgProperty,

                        task: stage.task,
                        subjects: taskObj&&taskObj.optionalSubjects || [],
                        fromDate: new Date(stage.fromDate),
                        toDate: new Date(stage.toDate),
                        hours: hours,
                        hoursInDay: (hours-hoursAtNight),
                        hoursAtNight: hoursAtNight,
                        officerCourses: [],
                        officerCourseTimes: [],
                        commonCourses: [],
                        commonCourseTimes: [],
                        majorCourses: [],
                        majorCourseTimes: [],
                    };
                    const returnItem = this.getAllUnitForceCoursesByStage2(planItem);
                    planItem.commonCourses = returnItem.commonCourses;
                    planItem.commonCourseTimes = returnItem.commonCourseTimes;
                    planItem.majorCourses = returnItem.majorCourses;
                    planItem.majorCoursesV2 = returnItem.majorCoursesV2;
                    planItem.majorCourseTimes = returnItem.majorCourseTimes;

                    return planItem;
                });

            }
            // else {
            //     annualPlan = result.list[0];
            //     if (annualPlan.year === year) throw `${annualPlan.name}已存在，请不要重复创建`;

            //     // 拷贝去年的年度计划
            //     query = new Client.Query(Client.UnitForceAnnualPlanItem);
            //     query.equalTo('annualPlan', this.backendService.getParseObject('UnitForceAnnualPlan', annualPlan.objectId));
            //     result = await this.backendService.queryListAll('UnitForceAnnualPlanItem', query);
            //     annualPlan.planItems = result.list.map(item => {
            //         delete item.objectId;
            //         delete item.annualPlan;
            //         item.year = year;
            //         return item;
            //     });

            //     // 直接复制之前已经创建的表数据
            //     delete annualPlan.objectId;
            //     annualPlan.year = year;
            //     annualPlan.name = planName;
            //     annualPlan.state = SubmitState.Initial;
            // }

            console.log('getInitUnitForceAnnualPlan', annualPlan);
            return annualPlan;
        } catch (exception) {
            console.log(`getInitUnitForceAnnualPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async queryUnitForceAnnualPlanList(year, selectOrg, query) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            if (_.isEmpty(query)) {
                query = new Client.Query(Client.UnitForceAnnualPlan);
                query.limit(100);
            }

            if (!_.isEmpty(selectOrg)) {
                selectOrg = await this.backendService.fetchItem('Organization', selectOrg.objectId);
            }

            // 在总部/总队查询下级支队的年度计划表
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
            // 总队以下单位，只显示本支队的表单
            if (organization && organization.orgSequence > OrgSequence.Division) {
                let parseOrgs = organization.parentIds.map(item => this.backendService.getParseObject('Organization', item));
                query.containedIn('organization', parseOrgs);
            }
            // 非支队，只查询已发布的表单
            if (!organization || !IsZhiDui(organization.orgSequence)) {
                query.equalTo('state', SubmitState.Submited);
            }
            //大队及以下分队
            if (organization && organization.orgSequence >= OrgSequence.Battalion) {
                let localOrgs = await this.backendService.orgService.getAllChildrenOrgs(organization.objectId);
                let orgCategories = _.uniq(localOrgs.map(item => item.orgCategory));
                if (!_.isEmpty(orgCategories)) {
                    query.containedIn('orgCategory', orgCategories);
                }
            }
            year && query.equalTo('year', year);
            query.addAscending(['orgCode', 'orgCategory', 'createdAt']);

            const result = await this.backendService.queryList('UnitForceAnnualPlan', query);

            let planList = result.list;
            const planIds = result.list.map(item => item.objectId);
            if (!_.isEmpty(planIds)) {
                query = new Client.Query(Client.AnnualPlanTarget);
                query.containedIn('annualPlanId', planIds);

                const targetRet = await this.backendService.queryListAll('AnnualPlanTarget', query);
                planList = planList.map(plan => {
                    plan.targets = targetRet.list.filter(item => item.annualPlanId === plan.objectId);
                    return plan;
                });
            }


            console.log('queryUnitForceAnnualPlanList', result)

            return {total: planList.length, list: planList};
        } catch (exception) {
            console.log(`queryUnitForceAnnualPlanList failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getUnitForceAnnualPlanDetails(objectId) {
        try {
            let annualPlan = await this.backendService.fetchItem('UnitForceAnnualPlan', objectId);

            let query = new Client.Query(Client.UnitForceAnnualPlanItem);
            query.equalTo('annualPlan', this.backendService.getParseObject('UnitForceAnnualPlan', objectId));
            query.ascending('fromDate');
            let result = await this.backendService.queryListAll('UnitForceAnnualPlanItem', query);

            annualPlan.planItems = result.list;

            let {orgCategory, serviceReq, majors} = annualPlan;
            result = await this._fetchCourses(orgCategory, serviceReq, majors);

            annualPlan.planItems.forEach(planItem => {
                // if (planItem.orgCategory.includes('工兵分队'))
                {
                    planItem.commonCourses = planItem.commonCourses.map(course => {
                        // const courseTime = planItem.commonCourseTimes.find(item => item.courseIds.includes(course.objectId));
                        const trainStep = this.trainSteps.find(item => item.name === course.trainStep);
                        course.priority = trainStep&&trainStep.priority || 0;
                        return {
                            ...course
                        };
                    });
                    if (_.isEmpty(planItem.majorCoursesV2)) {
                        planItem.majorCourses = planItem.majorCourses.map(course => {
                            const courseTime = planItem.majorCourseTimes.find(item => item.courseIds.includes(course.objectId));
                            const trainStep = this.trainSteps.find(item => item.name === course.trainStep);
                            course.priority = trainStep&&trainStep.priority || 0;
                            return {
                                ...course,
                                majorReq: courseTime&&courseTime.majorReq
                            };
                        });
                    } else {
                        // 对工兵分队进行兼容性设计
                        let optionalCourses = planItem.majorCourses;
                        planItem.majorCourses = planItem.majorCoursesV2.map(courseV2 => {
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
                        planItem.majorCourses = planItem.majorCourses.filter(item => item);
                    }
                }
            });

            console.log('getUnitForceAnnualPlanDetails', annualPlan)

            return annualPlan;
        } catch (exception) {
            console.log(`getUnitForceAnnualPlanDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 更新分队年度计划
    async addOrUpdateUnitForceAnnualPlan(annualPlan) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            let query = new Client.Query(Client.UnitForceAnnualPlan);
            query.equalTo('name', annualPlan.name);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            let result = await this.backendService.queryList('UnitForceAnnualPlan', query);
            let exists = result.list;
            if (annualPlan.objectId) {
                exists = exists.filter(item => item.objectId != annualPlan.objectId);
            }
            if (!_.isEmpty(exists)) throw '请不要创建重复标题的年度训练计划';

            let planItems = annualPlan.planItems;
            delete annualPlan.planItems;

            let resultPlan = await this.backendService.addOrUpdateItem('UnitForceAnnualPlan', annualPlan);
            if (!annualPlan.objectId) {
                planItems = planItems.map(item => {
                    item.annualPlan = resultPlan.objectId;
                    return item;
                });
            }

            await this.backendService.addOrUpdateList('UnitForceAnnualPlanItem', planItems);

            // 添加操作记录
            await this.backendService.addOperateRecord({
                tblName: 'UnitForceAnnualPlan',
                targetId: resultPlan.objectId,
                operateType: annualPlan.objectId ? '修改' : '创建',
                description: ''
            });

            return await this.getUnitForceAnnualPlanDetails(resultPlan.objectId);
        } catch (exception) {
            console.log(`addOrUpdateUnitForceAnnualPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteUnitForceAnnualPlan(planId) {
        try {
            if (!this.backendService.isAdmin()) throw '本账号无权限删除年度计划表';
            const currOrg = this.backendService.getCurrentOrganization();
            const plan = await this.backendService.fetchItem('UnitForceAnnualPlan', planId);
            if (currOrg && plan.organization && plan.organization.objectId != currOrg.objectId) throw '无权限删除其他单位创建的年度计划表';

            let query = new Client.Query(Client.UnitForceAnnualPlanItem);
            query.equalTo('annualPlan', this.backendService.getParseObject('UnitForceAnnualPlan', planId));
            let result = await this.backendService.queryListAll('UnitForceAnnualPlanItem', query);
            const planItems = result.list;
            if (!_.isEmpty(planItems)) {
                query = new Client.Query(Client.StagePlan);
                let parseItems = planItems.map(item => this.backendService.getParseObject('UnitForceAnnualPlanItem', item.objectId));
                query.containedIn('annualPlanItem', parseItems);
                result = await this.backendService.queryListAll('StagePlan', query);
                if (!_.isEmpty(result.list)) throw '该年度计划已经关联创建阶段计划，不能删除';
            }

            await this.backendService.deleteItem('UnitForceAnnualPlan', {objectId: planId});
            if (!_.isEmpty(planItems)) await this.backendService.deleteList('UnitForceAnnualPlanItem', planItems);
        } catch (exception) {
            console.log(`deleteUnitForceAnnualPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getAnnualPlanTargetOptions(annualPlan) {
        try {
            const query = new Client.Query(Client.Organization);
            query.equalTo('parentIds', (annualPlan.organization||{}).objectId);
            query.equalTo('orgType', OrgType.UnitForce);
            query.greaterThanOrEqualTo('orgSequence', OrgSequence.Company);
            query.equalTo('orgCategory', annualPlan.orgCategory);
            if (!_.isEmpty(annualPlan.serviceReq)) {
                query.equalTo('serviceType', annualPlan.serviceReq);
            }
            query.addAscending(['orgCode']);
            const result = await this.backendService.queryListAll('Organization', query);
            const tmpList = result.list.map(item => {
                item.parentIdsStr = _.join(item.parentIds, ';');
                return item;
            });
            let options = [...tmpList];
            tmpList.forEach(org => {
                _.remove(options, item => {
                    return item.parentIdsStr !== org.parentIdsStr && item.parentIdsStr.startsWith(org.parentIdsStr)
                });
            });

            return options;
        } catch (exception) {
            console.log(`getAnnualPlanTargetOptions failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
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
    }
}

export default AnnualPlanService;
