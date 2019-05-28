import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import { OrgSequence, OrgType, IsZhongDui, SubmitState, ApproveState, DailySection, DayType, TimeUnit, StandardState, CourseState, PersonProperty, CourseCategory, InServiceStatus, WeekDays, CourseOption } from '../Constants';
import moment from 'moment';
import dateUtils from '../utils/dateUtils';
import baseUtils from '../utils/baseUtils';

const TheLastValue = 255;

export class WeeklyPlanService {
    constructor(backend) {
        this.backendService = backend;

        this.trainSteps = [];
        this.holidays = [];

        this.annualPlanId = undefined;
        this.unitForceAnnualPlanItems = [];     // 本年内的本周内相关的年度计划
        this.annualPlanItemsThisYear = [];      // 本年内的本单位相关所有年度计划
        this.stagePlanItems = [];               // 阶段计划
        this.monthPlanItem = [];                // 月计划
        this.orgCourses = [];
        this.officerCourses = [];
        this.lastWeeklyPlan = null; // 本单位本周计划
        this.mainWeeklyPlan = null; // 主单位下周计划

        this.weeklyPlan = null;     // 本单位下周计划
        this.organization = null;
        this.trainOrgs = [];
        this.weekOfMonth = null;
        this.nextWeekOfMonth = null;
        this.trainMajors = [];

        this.updatedCourseStatuses = [];
        this.courseStatuses = [];

        this.otherCourses = [];
        this.CourseGroup = {};
        this.CourseOptionGroup = {};
        this.dailySchedule = null;      // 作息时间

        this.officerCourseOptions = [];
        this.orgCourseOptions = [];

        this.trainers = [];
        this.places = [];
    }

    // 获取可单独录入课目的可选单位列表
    async getAvailableOrgs() {
        try {
            let list = [];
            let organization = this.backendService.getCurrentOrganization();

            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) return list;
            list.push(organization);

            // let result = await this.backendService.orgService.getChildOrganizationsByParentId(organization.objectId);
            let localOrgs = await this.backendService.orgService.getLocalOrganizations(organization);
            // const localOrgs = result.list;
            if (_.isEmpty(localOrgs)) return list;

            let diffOrgs = localOrgs.filter(item => item.orgCategory !== organization.orgCategory);
            diffOrgs = _.uniqBy(diffOrgs, 'orgCategory');
            if (!_.isEmpty(diffOrgs)) list = list.concat(diffOrgs);

            return list;
        }  catch (exception) {
            console.log(`getAvailableOrgs failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getWeeklyPlanDetails(organization, date) {
        try {
            let query = new Client.Query(Client.WeeklyPlan);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.greaterThanOrEqualTo('fromDate', date);
            query.lessThanOrEqualTo('toDate', date);
            let result = await this.backendService.queryListAll('WeeklyPlan', query);
            if (_.isEmpty(result.list)) return undefined;

            let weeklyPlan = result.list[0];

            query = new Client.Query(Client.DailyLesson);
            query.equalTo('weeklyPlan', this.backendService.getParseObject('WeeklyPlan', weeklyPlan.objectId));
            query.addAscending('date');
            result = await this.backendService.queryListAll('DailyLesson', weeklyPlan.objectId);

            weeklyPlan.dailyLessons = result.list;

            // 中队缓存本单位待编辑的计划表
            if (weeklyPlan.state != ApproveState.Approving && weeklyPlan.state != ApproveState.Approved) {
                // let today = this.backendService.getSystemTime();
                let currOrg = this.backendService.getCurrentOrganization();
                if (currOrg && currOrg.orgSequence === OrgSequence.Company && organization.parentIds.includes(currOrg.objectId)) {
                    await this.editWeeklyPlan(weeklyPlan);
                    // let nextWeekDate = moment(today).add(7, 'days').toDate();
                    // if ((today >= weeklyPlan.fromDate && today <= weeklyPlan.toDate) || (nextWeekDate >= weeklyPlan.fromDate && nextWeekDate <= weeklyPlan.toDate)) {
                    //     await this.editWeeklyPlan(weeklyPlan);
                    // }
                }
            }

            return weeklyPlan;
        } catch (exception) {
            console.log(`getWeeklyPlanDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getWeeklyPlanDetailsByObjectId(objectId) {
        try {
            let weeklyPlan = await this.backendService.fetchItem('WeeklyPlan', objectId);

            let query = new Client.Query(Client.DailyLesson);
            query.equalTo('weeklyPlan', this.backendService.getParseObject('WeeklyPlan', objectId));
            query.addAscending('date');
            let result = await this.backendService.queryListAll('DailyLesson', query);

            weeklyPlan.dailyLessons = result.list;

            // 中队缓存本单位的下周计划表，为编辑做准备
            if (weeklyPlan.state != ApproveState.Approving && weeklyPlan.state != ApproveState.Approved) {
                // let today = this.backendService.getSystemTime();
                let currOrg = this.backendService.getCurrentOrganization();
                if (currOrg && currOrg.orgSequence === OrgSequence.Company && weeklyPlan.organization.parentIds.includes(currOrg.objectId)) {
                    await this.editWeeklyPlan(weeklyPlan);
                    // let nextWeekDate = moment(today).add(7, 'days').toDate();
                    // if ((today >= weeklyPlan.fromDate && today <= weeklyPlan.toDate) || (nextWeekDate >= weeklyPlan.fromDate && nextWeekDate <= weeklyPlan.toDate)) {
                    //     await this.editWeeklyPlan(weeklyPlan);
                    // }
                }
            }

            return weeklyPlan;
        } catch (exception) {
            console.log(`getWeeklyPlanDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async generateWeeklyPlan(organization, date) {
        try {
            let currOrg = this.backendService.getCurrentOrganization();
            if (_.isEmpty(currOrg) || currOrg.orgSequence != OrgSequence.Company) throw '只有中队级账号才能创建周工作安排表';
            if (!organization.parentIds.includes(currOrg.objectId)) throw '本单位不能创建非本级或下级单位的周工作安排表';
            this.organization = organization;

            let result = await this.backendService.orgService.getChildOrganizationsByParentId(this.organization.objectId);
            this.trainOrgs = result.list;

            // 获取下级训练单位
            if (!_.isEmpty(this.trainOrgs)) {
                this.trainOrgs = this.trainOrgs.filter(org =>
                    org.orgCategory === this.organization.orgCategory &&
                    org.orgType === OrgType.LeaderOffice
                );
            }
            if (_.isEmpty(this.trainOrgs)) this.trainOrgs = [this.organization];


            // 检查表是否已经存在
            let today = this.backendService.getSystemTime();
            // 如果传入日期，则按照传入的日期创建周计划
            if (date) {
                today = moment(date).subtract(7, 'days').toDate();
            }

            this.weekOfMonth = dateUtils.weekOfMonth(today);
            this.nextWeekOfMonth = dateUtils.weekOfMonth(moment(today).add(7, 'days').toDate());
            let existed = await this._checkExists(this.nextWeekOfMonth.weekMiddle);
            if (existed) throw `${this.organization.name}${this.nextWeekOfMonth.month}月份第${this.nextWeekOfMonth.weekSeq}周工作安排表已经存在，请不要重复创建`;

            // 获取依赖规则数据
            await this._fetchRules(organization);

            // 初始化周表
            await this._initWeeklyPlan();

            // 初始化日表
            await this._initEmptyLessons();

            // 匹配课目分类规则，并填入课表
            this._fillCategoryByCourseRule();

            // 匹配课目规则，并填入课表
            this._fillCourseByCourseRule();

            // 根据月计划安排军事训练课目
            this._fillTrainCourseByPlan();

            // console.log(888, JSON.parse(JSON.stringify(this.weeklyPlan)))

            // 对课表内相同课目或课目类型进行合并
            this._finalizeDailyLesson();

            // console.log(999, JSON.parse(JSON.stringify(this.weeklyPlan)))

            // 统计课时，更新课目状态
            this._updateCourseStatuses();

            console.log('generateWeeklyPlan', this.weeklyPlan)

            return this.weeklyPlan;
        } catch (exception) {
            console.log(`generateWeeklyPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async editWeeklyPlan(weeklyPlan) {
        try {
            let currOrg = this.backendService.getCurrentOrganization();
            if (_.isEmpty(currOrg) || currOrg.orgSequence != OrgSequence.Company) throw '只有中队级账号才能编辑周工作安排表';
            if (weeklyPlan.organization && !weeklyPlan.organization.parentIds.includes(currOrg.objectId)) throw '本单位不能编辑非本级或下级单位的周工作安排表';
            if (weeklyPlan.state === ApproveState.Approving) throw '不能编辑审核中的周工作安排表';
            if (weeklyPlan.state === ApproveState.Approved) throw '不能编辑已经审核通过的周工作安排表';

            // 如果传入日期，则按照传入的日期创建周计划
            const today = moment(weeklyPlan.fromDate).subtract(7, 'days').toDate();

            this.weekOfMonth = dateUtils.weekOfMonth(today);
            this.nextWeekOfMonth = dateUtils.weekOfMonth(moment(today).add(7, 'days').toDate());

            this.weeklyPlan = weeklyPlan;
            this.organization = weeklyPlan.organization;
            this.trainOrgs = weeklyPlan.trainOrgs;
            this.trainMajors = weeklyPlan.trainMajors;
            this.annualPlanId = this.weeklyPlan.annualPlanId;

            // 获取依赖规则数据
            await this._fetchRules(this.organization);

            // 获取本周对应的课目状态
            let courses = this.weeklyPlan.dailyLessons.map(dailyLesson => {
                return dailyLesson.lessons.map(lesson => {
                    return lesson.courses;
                });
            });
            courses = _.uniqWith(_.flattenDeep(courses).filter(item => !_.isEmpty(item.courseId)), (a, b) => a.courseId===b.courseId && baseUtils.isEqualValue(a.major, b.major));
            this.updatedCourseStatuses = courses.map(item => {
                let cs = this.courseStatuses.find(cs => cs.course.objectId === item.courseId && baseUtils.isEqualValue(cs.major, item.major));
                return cs;
            }).filter(cs => cs);

            return;
        } catch (exception) {
            console.log(`editWeeklyPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    _checkLessons() {
        let dailyHour = this.dailySchedule.eMorning+this.dailySchedule.morning+this.dailySchedule.afternoon+this.dailySchedule.night;
        for (let dailyLesson of this.weeklyPlan.dailyLessons) {
            let hours = dailyLesson.lessons.reduce((prev, curr) => {
                prev += curr.hours;
                return prev;
            }, 0);
            if (hours < dailyHour) throw `${WeekDays[dailyLesson.weekday].name}的总课时不符合作息时间要求`;

            // let lessons = dailyLesson.lessons.filter(lesson => _.isEmpty(lesson.courses) || !lesson.place || !lesson.trainer);
            // if (!_.isEmpty(lessons)) throw `${WeekDays[dailyLesson.weekday].name}还有数据未录入`;
        }
    }

    async addOrUpdateWeeklyPlan() {
        try {
            console.log('addOrUpdateWeeklyPlan', this.weeklyPlan)
            if (_.isEmpty(this.weeklyPlan)) throw '不是下周工作安排表不能修改';
            this._checkLessons();

            let dailyLessons = this.weeklyPlan.dailyLessons;
            delete this.weeklyPlan.dailyLessons;

            let retWeeklyPan = await this.backendService.addOrUpdateItem('WeeklyPlan', this.weeklyPlan);

            if (!this.weeklyPlan.objectId) {
                dailyLessons = dailyLessons.map(item => {
                    item.weeklyPlan = retWeeklyPan.objectId;
                    return item;
                });
            }

            await this.backendService.addOrUpdateList('DailyLesson', dailyLessons);

            // 根据已安排的课时，修改课目状态
            this.updatedCourseStatuses.forEach(cs => {
                let actualHours = cs.actualHoursInDay + cs.actualHoursAtNight;
                let hours = cs.hoursInDay + cs.hoursAtNight;
                if (cs.state < CourseState.Finished) {
                    if (actualHours === 0) {
                        cs.state = CourseState.Initial;
                    } else if (actualHours < hours) {
                        cs.state = CourseState.Progress;
                    } else {
                        cs.state = CourseState.WaitTest;
                    }
                }
            });

            await this.backendService.addOrUpdateList('CourseStatus', this.updatedCourseStatuses);

            // 添加操作记录
            await this.backendService.addOperateRecord({
                tblName: 'WeeklyPlan',
                targetId: retWeeklyPan.objectId,
                operateType: this.weeklyPlan.objectId ? '修改' : '创建',
                description: ''
            });

            return await this.getWeeklyPlanDetailsByObjectId(retWeeklyPan.objectId);
        } catch (exception) {
            console.log(`addOrUpdateWeeklyPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 删除周计划表
    async deleteWeeklyPlan(weeklyPlan) {
        try {
            let currOrg = this.backendService.getCurrentOrganization();
            if (_.isEmpty(currOrg) || !IsZhongDui(currOrg.orgSequence)) throw '只有中队级账号才能删除周工作安排表';
            if (weeklyPlan.state === ApproveState.Approved) throw '不能删除已经审核通过的周工作安排表';

            this.weeklyPlan = weeklyPlan;
            this.organization = weeklyPlan.organization;
            this.nextWeekOfMonth = dateUtils.weekOfMonth(weeklyPlan.fromDate);

            let query = new Client.Query(Client.DailyLesson);
            query.equalTo('weeklyPlan', this.backendService.getParseObject('WeeklyPlan', weeklyPlan.objectId));
            query.addAscending('date');
            let result = await this.backendService.queryListAll('DailyLesson', query);
            this.weeklyPlan.dailyLessons = result.list;

            // 获取课目状态
            {
                let fromYear = this.nextWeekOfMonth.weekStart.getFullYear();
                let toYear = this.nextWeekOfMonth.weekEnd.getFullYear();

                let query = new Client.Query(Client.CourseStatus);
                if (fromYear != toYear) {
                    query.containedIn('year', [fromYear, toYear]);
                } else {
                    query.equalTo('year', this.nextWeekOfMonth.year);
                }
                query.equalTo('organization', this.backendService.getParseObject('Organization', this.organization.objectId));
                query.addAscending(['category']).addDescending('startAt');
                result = await this.backendService.queryListAll('CourseStatus', query);
                this.courseStatuses = result.list;
            }

            // 获取本周对应的课目状态
            let courses = this.weeklyPlan.dailyLessons.map(dailyLesson => {
                return dailyLesson.lessons.map(lesson => {
                    return lesson.courses;
                });
            });
            courses = _.uniqWith(_.flattenDeep(courses).filter(item => !_.isEmpty(item.courseId)), (a, b) => a.courseId===b.courseId && baseUtils.isEqualValue(a.major, b.major));
            this.updatedCourseStatuses = courses.map(item => {
                let cs = this.courseStatuses.find(cs => cs.course.objectId === item.courseId && baseUtils.isEqualValue(cs.major, item.major));
                return cs;
            }).filter(cs => cs);

            this.weeklyPlan.dailyLessons.forEach(dailyLesson => {
                dailyLesson.lessons.forEach(lesson => {
                    //  更新课目状态
                    if (!_.isEmpty(lesson.courses)) {
                        lesson.courses.forEach(course => {
                            let courseId = course.courseId;
                            if (courseId) {
                                let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === courseId && baseUtils.isEqualValue(cs.major, course.major));
                                this._updateCourseStatus(dailyLesson, lesson, courseStatus, true);
                            }
                        });
                    }
                })
            });


            await this.backendService.deleteItem('WeeklyPlan', weeklyPlan);
            await this.backendService.deleteList('DailyLesson', this.weeklyPlan.dailyLessons);

            await this.backendService.addOrUpdateList('CourseStatus', this.updatedCourseStatuses);

            return weeklyPlan;
        } catch (exception) {
            console.log(`deleteWeeklyPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async ClearAllWeeklyPlans(organization) {
        try {
            const currOrg = this.backendService.getCurrentOrganization();
            if (!currOrg || !IsZhongDui(currOrg.orgSequence)) throw '只有中队级账号才能清楚所有周工作安排表';

            const parseOrg = this.backendService.getParseObject('Organization', organization.objectId);
            let query = new Client.Query(Client.WeeklyPlan);
            query.equalTo('organization', parseOrg);
            query.equalTo('year', moment().year());
            let result = await this.backendService.queryListAll('WeeklyPlan', query);
            const planList = result.list;
            if (_.isEmpty(planList)) return 1;

            const parsePlans = planList.map(item => this.backendService.getParseObject('WeeklyPlan', item.objectId));

            query = new Client.Query(Client.DailyLesson);
            query.containedIn('weeklyPlan', parsePlans);
            query.addAscending('date');
            result = await this.backendService.queryListAll('DailyLesson', query);
            const dailyLessons = result.list;

            query = new Client.Query(Client.CourseStatus);
            query.equalTo('organization', parseOrg);
            query.equalTo('year', moment().year());
            result = await this.backendService.queryListAll('CourseStatus', query);
            const courseStatuses = result.list;

            try { await this.backendService.deleteList('WeeklyPlan', planList); } catch(_) {}
            try { await this.backendService.deleteList('DailyLesson', dailyLessons); } catch(_) {}
            try { await this.backendService.deleteList('CourseStatus', courseStatuses); } catch(_) {}

            return 1;
        } catch (exception) {
            console.log(`ClearAllWeeklyPlans failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 本周可选军事课目
    getTrainCourseOptionsThisWeek(date) {
        let {courses, courseTimes} = this._getAllCourses(date);
        if (_.isEmpty(courses)) {
            let result = this._getAllCoursesThisYear();
            courses = result.courses;
        }
        let options = this.orgCourses.map(orgCourse => {
            let course = courses.find(item => item.objectId === orgCourse.courseId && baseUtils.isEqualValue(item.majorReq, orgCourse.major));
            if (!course) return undefined;

            let stat = this._calcCourseHoursThisWeek(course);
            return {
                course,
                hoursInDay: stat.hoursInDay,
                hoursAtNight: stat.hoursAtNight,
                allHoursInDay: orgCourse.hoursInDay,
                allHoursAtNight: orgCourse.hoursAtNight
            };
        });
        return options.filter(item => !!item);
    }

    // 本月可选军事课目
    // getTrainCourseOptionsThisMonth(date) {
    //     let stagePlanItem = this.stagePlanItems.find(item => date>=item.fromDate&&date<=item.toDate);
    //     if (_.isEmpty(stagePlanItem)) return [];

    //     let {courses, courseTimes} = this._getAllCourses(date);
    //     let options = stagePlanItem.orgCourses.map(orgCourse => {
    //         let course = courses.find(item => item.objectId === orgCourse.courseId);
    //         if (!course) return undefined;

    //         let stat = this._calcCourseHoursThisMonth(course, date);
    //         return {
    //             course,
    //             hoursInDay: stat.hoursInDay,
    //             hoursAtNight: stat.hoursAtNight,
    //             allHoursInDay: orgCourse.hoursInDay,
    //             allHoursAtNight: orgCourse.hoursAtNight
    //         };
    //     });

    //     return options.filter(item => !!item);
    // }

    // 本阶段可选军事课目
    getTrainCourseOptionsThisStage(date) {
        let {courses, courseTimes} = this._getAllCourses(date);

        let options = courses.map(course => {
            let stat = this._calcCourseHoursThisYear(course, courseTimes);
            return {
                course,
                ...stat
            };
        });

        return options;
    }

    getTrainerByCourse(course) {
        if (_.isEmpty(course)) return undefined;
        let courseStatus = this._getCourseStatusByCourse(course);
        if (!courseStatus) {
            courseStatus = {course: {objectId: course.courseId}};
        }

        return this._getTrainerByCourseStatus(courseStatus);
    }

    getTrainPlaceByCourse(course) {
        if (_.isEmpty(course)) return undefined;

        let courseStatus = this._getCourseStatusByCourse(course);
        if (!courseStatus) {
            courseStatus = {course: {objectId: course.courseId}};
        }

        return this._getTrainPlaceByCourseStatus(courseStatus);
    }

    _calcCourseHoursThisYear(course, courseTimes) {
        let hoursInDay = 0;
        let hoursAtNight = 0;
        let allHoursInDay = 0;
        let allHoursAtNight = 0;
        let courseTime = undefined;

        let courseStatus = this._getCourseStatusByCourse(course);
        if (!courseStatus) {
            courseTime = courseTimes.find(ct => ct.courseIds.includes(course.objectId) && baseUtils.isEqualValue(ct.majorReq, course.majorReq));
            if (courseTime) {
                allHoursInDay = courseTime.hoursInDay;
                allHoursAtNight = courseTime.hoursAtNight;
            }
        } else {
            hoursInDay = courseStatus.actualHoursInDay;
            hoursAtNight = courseStatus.actualHoursAtNight;
            allHoursInDay = courseStatus.hoursInDay;
            allHoursAtNight = courseStatus.hoursAtNight;
        }

        return {hoursInDay, hoursAtNight, allHoursInDay, allHoursAtNight};
    }

    // 相关课目类型对应的可选课目
    getCourseOptions(category, date) {
        // 获取所有军事课目可选项
        if (category === CourseCategory.Train) {
            let {courses, courseTimes} = this._getAllCoursesThisYear();

            let options = courses.map(course => {
                let stat = this._calcCourseHoursThisYear(course, courseTimes);

                return { course, ...stat };
            });

            return options;
        } else {
            // 获取非军事课目可选项
            const courses = this.CourseGroup[category]||[];
            const options = courses.map(course => {
                // let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === course.objectId);
                // if (!courseStatus) {
                //     courseStatus = this.courseStatuses.find(cs => cs.course.objectId === course.objectId);
                // }
                const courseStatus = this._getCourseStatusByCourse(course);

                return {
                    course,
                    hoursInDay: courseStatus&&courseStatus.actualHoursInDay||0,
                    hoursAtNight: courseStatus&&courseStatus.actualHoursAtNight||0,
                    allHoursInDay: 0,
                    allHoursAtNight: 0
                }
            });

            return options;
        }
    }

    // 值班人员可选项
    async getDutyOptions() {
        if (_.isEmpty(this.dutyOptions)) {
            let query1 = new Client.Query(Client.Soldier);
            query1.equalTo('personProperty', PersonProperty.Officer);
            let query2 = new Client.Query(Client.Soldier);
            query2.equalTo('isCommander', true);

            let query = Client.Query.or(query1, query2);
            query.equalTo('inserviceStatus', InServiceStatus.InService);
            query.addAscending(['orgCode', 'positionCode']);
            let result = await this.backendService.queryListAll('Soldier', query);
            this.dutyOptions = result.list;
        }

        return this.dutyOptions;
    }

    // 教练员可选项
    getTrainerOptions(lesson) {
        let options = [];

        if (!_.isEmpty(lesson.courses)) {
            let courseIds = _.map(lesson.courses, 'courseId');
            this.trainers.forEach(trainer => {
                trainer.availableCourses = trainer.availableCourses||[];
                trainer.availableAssistCourses = trainer.availableAssistCourses||[];

                let trainCourseIds = _.map([...trainer.availableCourses, trainer.availableAssistCourses], 'objectId');
                if (_.intersection(courseIds, trainCourseIds)) options.push(trainer.soldier);
            });
        }

        if (_.isEmpty(options)) options = this.trainers.map(item => item.soldier);
        if (this.weeklyPlan&&this.weeklyPlan.theDuty) options.push(this.weeklyPlan.theDuty);

        return _.uniqBy(options, 'objectId');
    }

    // 训练场地可选项
    getPlaceOptions() {
        return this.places;
    }

    // 添加或者删除或者编辑课目
    // courseItems = [{courseId, category, inputText, subcourses}]
    editCourses({dailyLesson, lesson, courseOption, courseItems}) {
        lesson.courseOption = courseOption;
        lesson.courses = lesson.courses||[];
        courseItems = courseItems||[];

        console.log(courseOption, courseItems)

        let deletedCourses = [];
        if (_.isEmpty(courseItems) || _.isEmpty(courseItems[0].objectId)) deletedCourses = lesson.courses;
        if (_.isEmpty(lesson.courses) || _.isEmpty(lesson.courses[0].objectId)) deletedCourses = lesson.courses;
        if (_.isEmpty(deletedCourses)) deletedCourses = _.differenceWith(lesson.courses, courseItems, (a, b) => a.courseId===b.courseId && baseUtils.isEqualValue(a.major, b.major));

        if (!_.isEmpty(deletedCourses)) {
            if (_.isEmpty(deletedCourses[0].objectId)) lesson.courses = [];
            else {
                deletedCourses.forEach(course => {
                    let index = lesson.courses.findIndex(item => item.courseId === course.courseId && baseUtils.isEqualValue(item.major, course.major));
                    if (index >= 0) this.deleteCourse(dailyLesson, lesson, index);
                });
            }
        }
        courseItems.forEach(courseItem => {
           this.addCourse(dailyLesson, lesson, courseItem);
        });

    }

    // 课程表里添加一个课目
    addCourse(dailyLesson, lesson, {category, courseId, name, major, inputText, subcourses}) {
        if (_.isEmpty(dailyLesson) || _.isEmpty(lesson)) return;
        if (_.isEmpty(courseId) && _.isEmpty(name)) return;

        lesson.category = category = category||0;
        subcourses = subcourses||[];
        lesson.courses = lesson.courses||[];

        if (_.isEmpty(lesson.courses) && lesson.category != category) {
            if (lesson.category === CourseCategory.Train) {
                // 对每日和每周统计军事训练课时
                if (lesson.section === DailySection.Night) {
                    this.weeklyPlan.hoursAtNight -= lesson.hours;
                    dailyLesson.hoursAtNight -= lesson.hours;
                    this.weeklyPlan.hoursAtNight = Math.max(this.weeklyPlan.hoursAtNight, 0);
                    dailyLesson.hoursAtNight = Math.max(dailyLesson.hoursAtNight, 0);
                } else {
                    this.weeklyPlan.hoursInDay -= lesson.hours;
                    dailyLesson.hoursInDay -= lesson.hours;
                    this.weeklyPlan.hoursInDay = Math.max(this.weeklyPlan.hoursInDay, 0);
                    dailyLesson.hoursInDay = Math.max(dailyLesson.hoursInDay, 0);
                }
            }
            if (category === CourseCategory.Train) {
                // 对每日和每周统计军事训练课时
                if (lesson.section === DailySection.Night) {
                    this.weeklyPlan.hoursAtNight += lesson.hours;
                    dailyLesson.hoursAtNight += lesson.hours;
                } else {
                    this.weeklyPlan.hoursInDay += lesson.hours;
                    dailyLesson.hoursInDay += lesson.hours;
                }
            }
        }

        // 添加手动录入的课目
        if (_.isEmpty(courseId)) {
            let course = lesson.courses.find(item => item.name === name);
            if (!course) {
                lesson.courses.push({
                    seq: 1,
                    name: name,
                    category: category,
                    isManual: true,
                    inputText: inputText,
                    subcourses: subcourses
                });
            } else {
                // 添加重复课目时，只更新子课目
                course.subcourses = subcourses;
                course.inputText = inputText;
            }
        } else {
            // 添加重复课目时，只更新子课目
            let existed = lesson.courses.find(item => item.courseId === courseId && baseUtils.isEqualValue(item.major, major));
            if (existed) {
                existed.subcourses = subcourses;
                existed.inputText = inputText;

                return;
            }

            // 获取课目状态
            let courseStatus = undefined;
            if (lesson.category === CourseCategory.Train) {
                let {courses, courseTimes} = this._getAllCoursesThisYear();
                courseStatus = this._createCourseStatus(dailyLesson.date, {courseId, major}, courses, courseTimes);
            } else {
                courseStatus  = this._createCourseStatus(dailyLesson.date, {courseId, major}, this.otherCourses, undefined);
            }
            if (_.isEmpty(courseStatus)) {
                return;
            }

            // 加入课目
            lesson.courses.push({
                seq: courseStatus.course.seq,
                name: courseStatus.course.name,
                courseId: courseId,
                category: courseStatus.course.category,
                isManual: false,
                major: major,
                gunnerType: courseStatus.course.gunnerType,
                inputText: inputText,
                subcourses: subcourses
            });
            // 设置教练员和场地
            if (_.isEmpty(lesson.trainer)) lesson.trainer = courseStatus.lastTrainer;
            if (_.isEmpty(lesson.place)) lesson.place = courseStatus.lastPlace;

            // 更新课目状态
            this._updateCourseStatus(dailyLesson, lesson, courseStatus);
        }
    }

    // 课程表里删除一个课目
    deleteCourse(dailyLesson, lesson, index) {
        let removedItems = lesson.courses.splice(index, 1);
        let removedCourse = removedItems[0];
        if (_.isEmpty(removedCourse.courseId)) return;
        let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === removedCourse.courseId && baseUtils.isEqualValue(cs.major, removedCourse.major));

        if (courseStatus) {
            this._updateCourseStatus(dailyLesson, lesson, courseStatus, true);
        }
    }

    setDuty(duty) {
        if (_.isEmpty(this.weeklyPlan)) return;

        this.weeklyPlan.theDuty = duty;

        // TODO...
    }

    setTrainer(lesson, trainer) {
        if (_.isString(trainer)) {
            lesson.trainer = undefined;
            lesson.trainerName = trainer;
        } else {
            lesson.trainer = trainer;
            lesson.trainerName = undefined;
        }


        if (_.isObject(trainer) && !_.isEmpty(lesson.courses)) {
            // 过滤掉值班人员
            let found = this.trainers.find(item => item.soldier.objectId === trainer.objectId);
            if (!found) return;

            let course = lesson.courses[0];
            if (!_.isEmpty(course.courseId)) {
                let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === course.courseId);
                courseStatus.lastTrainer = trainer;
            }
        }
    }

    setPlace(lesson, place) {
        lesson.place = place;

        if (!_.isEmpty(place) && !_.isEmpty(lesson.courses)) {
            let course = lesson.courses[0];
            if (!_.isEmpty(course.courseId)) {
                let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === course.courseId);
                courseStatus.lastPlace = place;
            }
        }
    }

    // 添加新的一行课
    addLesson(dailyLesson, section, index) {
        let actualIndex = index;
        // let index = _.findLastIndex(dailyLesson.lessons, item => item.section === section);
        let lessons = _.filter(dailyLesson.lessons, item => item.section === section);
        let lessonCount = lessons.length;
        let sectionHours = this.dailySchedule.morning;
        if (section === DailySection.Afternoon && dailyLesson.dayType === DayType.Workday) {
            sectionHours = this.dailySchedule.afternoon-1;
            lessonCount--;
        }

        if (lessonCount>sectionHours) return;

        let lesson = {
            section,
            hours: 0,
            category: dailyLesson.dayType === DayType.Workday?CourseCategory.Train:CourseCategory.Others,
            courses: [],
            trainer: undefined,
            place: undefined
        };

        dailyLesson.lessons.splice(actualIndex+1, 0, lesson);
    }

    // 删除一行课
    deleteLesson(dailyLesson, section, index) {
        try {
            let lessonCount = _.countBy(dailyLesson.lessons, 'section');
            if (lessonCount[section] <= 1) throw `不能删除${section}最后一行课目`;

            let actualIndex = index;
            let lesson = dailyLesson.lessons[actualIndex];


            // 工作日下午的体育训练课目不能删除
            if (section === DailySection.Afternoon && dailyLesson.dayType === DayType.Workday &&
                lesson.category === CourseCategory.Sport) throw '不能删除下午的体育课目';
            if (section === DailySection.Afternoon && dailyLesson.dayType === DayType.Workday &&
                lessonCount[section] <= 2) throw `不能删除${section}最后一行课目`;

            // 删除一行
            let removedItems = dailyLesson.lessons.splice(actualIndex, 1);
            lesson = removedItems[0];
            if (!lesson) return;


            // 更新统计课时
            if (lesson.category === CourseCategory.Train) {
                if (lesson.section === DailySection.Night) {
                    this.weeklyPlan.hoursAtNight -= lesson.hours;
                    dailyLesson.hoursAtNight -= lesson.hours;
                    this.weeklyPlan.hoursAtNight = Math.max(this.weeklyPlan.hoursAtNight, 0);
                    dailyLesson.hoursAtNight = Math.max(dailyLesson.hoursAtNight, 0);
                } else {
                    this.weeklyPlan.hoursInDay -= lesson.hours;
                    dailyLesson.hoursInDay -= lesson.hours;
                    this.weeklyPlan.hoursInDay = Math.max(this.weeklyPlan.hoursInDay, 0);
                    dailyLesson.hoursInDay = Math.max(dailyLesson.hoursInDay, 0);
                }
            }

            //  更新课目状态
            if (!_.isEmpty(lesson.courses)) {
                lesson.courses.forEach(course => {
                    let courseId = course.courseId;
                    if (courseId) {
                        let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === courseId && baseUtils.isEqualValue(cs.major, course.major));
                        this._updateCourseStatus(dailyLesson, lesson, courseStatus, true);
                    }
                });
            }
        } catch (exception) {
            console.log(`deleteLesson failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 修改课程的课时数
    setLessonHours(dailyLesson, lesson, hours) {
        if (lesson.hours === hours) return;
        let diffHours = hours-lesson.hours;

        // 更新统计课时
        if (lesson.category === CourseCategory.Train) {
            if (lesson.section === DailySection.Night) {
                this.weeklyPlan.hoursInDay += diffHours;
                dailyLesson.hoursInDay += diffHours;
                this.weeklyPlan.hoursInDay = Math.max(this.weeklyPlan.hoursInDay, 0);
                dailyLesson.hoursInDay = Math.max(dailyLesson.hoursInDay, 0);
            } else {
                this.weeklyPlan.hoursAtNight += diffHours;
                dailyLesson.hoursAtNight += diffHours;
                this.weeklyPlan.hoursAtNight = Math.max(this.weeklyPlan.hoursAtNight, 0);
                dailyLesson.hoursAtNight = Math.max(dailyLesson.hoursAtNight, 0);
            }
        }


        //  更新课目状态
        if (!_.isEmpty(lesson.courses)) {
            lesson.courses.forEach(course => {
                let courseId = course.courseId;
                if (courseId) {
                    let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === courseId && baseUtils.isEqualValue(cs.major, course.major));
                    // 先减掉课时
                    this._updateCourseStatus(dailyLesson, lesson, courseStatus, true);
                }
            });

            lesson.hours = hours;

            lesson.courses.forEach(course => {
                let courseId = course.courseId;
                if (courseId) {
                    let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === courseId && baseUtils.isEqualValue(cs.major, course.major));
                    // 再增加课时
                    this._updateCourseStatus(dailyLesson, lesson, courseStatus);
                }
            });
        } else {
            lesson.hours = hours;
        }
    }

    async _initWeeklyPlan() {
        let next2WeekOfMonth = dateUtils.weekOfMonth(moment(this.weekOfMonth.weekMiddle).add(14, 'days').toDate());

        let commanders = await this._getCommanders();

        // 初始化周表
        this.weeklyPlan = {
            name: `${this.organization.name}${this.nextWeekOfMonth.month}月份第${this.nextWeekOfMonth.weekSeq}周工作安排表`,
            year: this.nextWeekOfMonth.year,
            month: this.nextWeekOfMonth.month,
            weekSeq: this.nextWeekOfMonth.weekSeq,
            organization: this.organization,
            orgCode: this.organization.orgCode,
            trainOrgs: this.trainOrgs,
            trainMajors: this.trainMajors,

            orgCategory: this.organization.orgCategory,
            serviceReq: this.organization.serviceType,
            orgProperty: this.organization.orgProperty,
            state: 0,

            fromDate: this.nextWeekOfMonth.weekStart,
            toDate: this.nextWeekOfMonth.weekEnd,
            isLastWeek: (this.nextWeekOfMonth.month != next2WeekOfMonth.month),
            hoursInDay: 0,
            hoursAtNight: 0,

            flexibleCourse: undefined,
            flexibleTrainer: undefined,
            flexiblePlace: undefined,
            officerCourses: [],

            commander1: commanders&&commanders.commander1,
            commander2: commanders&&commanders.commander2,
            theDuty: undefined,

            ensures: '',
            methods: '',
            notes: '',
            annualPlanId: this.annualPlanId,

            dailyLessons: []
        };

        // 设置警官课目
        this.weeklyPlan.officerCourses = _.cloneDeep(this.officerCourses);

        // 初始化日表
        for(var momDate = moment(this.nextWeekOfMonth.weekStart); momDate <= moment(this.nextWeekOfMonth.weekEnd); ) {
            let date = momDate.toDate();
            // 检查当日是否为节假日或周末
            let holiday = this._checkHoliday(date);

            this.weeklyPlan.dailyLessons.push({
                date,
                weekSeq: this.nextWeekOfMonth.weekSeq,
                weekday: momDate.day(),
                organization: this.organization,
                orgCode: this.organization.orgCode,
                orgCategory: this.organization.orgCategory,
                serviceReq: this.organization.serviceType,
                orgProperty: this.organization.orgProperty,
                hoursInDay: 0,
                hoursAtNight: 0,
                weather: '',
                theDuty: undefined,
                ...holiday,

                dirty: true,
                lessons: []
            });
            momDate.add(1, 'day');
        }
    }

    _initEmptyLessons() {
        this.weeklyPlan.dailyLessons.forEach(dailyLesson => {
            dailyLesson.emorning = {
                section: DailySection.EarlyMoring,
                hours: this.dailySchedule.eMorning,
                priority: 0,
                category: dailyLesson.dayType === DayType.Workday?CourseCategory.Train:CourseCategory.Others,
                categories: [],
                courseOption: CourseOption.ThisWeek,
                courses: [],
                trainer: undefined,
                place: undefined
            };
            dailyLesson.night = {
                section: DailySection.Night,
                hours: this.dailySchedule.night,
                priority: 0,
                category: dailyLesson.dayType === DayType.Workday?CourseCategory.Train:CourseCategory.Others,
                categories: [],
                courseOption: CourseOption.ThisWeek,
                courses: [],
                trainer: undefined,
                place: undefined
            };

            dailyLesson.morning = [];
            for (let i = 0; i < this.dailySchedule.morning; i++) {
                dailyLesson.morning.push({
                    section: DailySection.Morning,
                    hours: 1,
                    priority: 0,
                    category: dailyLesson.dayType === DayType.Workday?CourseCategory.Train:CourseCategory.Others,
                    categories: [],
                    courseOption: CourseOption.ThisWeek,
                    courses: [],
                    trainer: undefined,
                    place: undefined
                });
            }

            if (dailyLesson.dayType === DayType.Workday) {
                dailyLesson.afternoon = [];
                for (let i = 0; i < this.dailySchedule.afternoon-1; i++) {
                    dailyLesson.afternoon.push({
                        section: DailySection.Afternoon,
                        hours: 1,
                        priority: 0,
                        category: CourseCategory.Train,
                        categories: [],
                        courseOption: CourseOption.ThisWeek,
                        courses: [],
                        trainer: undefined,
                        place: undefined
                    });
                }

                dailyLesson.sport = {
                    section: DailySection.Afternoon,
                    hours: 1,
                    priority: 0,
                    category: CourseCategory.Sport,
                    categories: [],
                    courseOption: CourseOption.ThisWeek,
                    courses: [],
                    trainer: undefined,
                    place: undefined
                };
            } else {
                dailyLesson.afternoon = [];
                for (let i = 0; i < this.dailySchedule.afternoon; i++) {
                    dailyLesson.afternoon.push({
                        section: DailySection.Afternoon,
                        hours: 1,
                        priority: 0,
                        category: CourseCategory.Others,
                        categories: [],
                        courseOption: CourseOption.ThisWeek,
                        courses: [],
                        trainer: undefined,
                        place: undefined
                    });
                }
            }

            dailyLesson.tmpLessons = [dailyLesson.emorning].concat(dailyLesson.morning, dailyLesson.afternoon);
            if (!_.isEmpty(dailyLesson.sport)) dailyLesson.tmpLessons.push(dailyLesson.sport);
            dailyLesson.tmpLessons.push(dailyLesson.night);
        });
    }

    _finalizeDailyLesson() {
        this.weeklyPlan.dailyLessons.forEach(dailyLesson => {
            dailyLesson.lessons = [];
            dailyLesson.lessons.push(dailyLesson.emorning);

            let newLessons = this._reduceLessons(dailyLesson.morning);
            dailyLesson.lessons = dailyLesson.lessons.concat(newLessons);

            newLessons = this._reduceLessons(dailyLesson.afternoon);
            dailyLesson.lessons = dailyLesson.lessons.concat(newLessons);

            if (!_.isEmpty(dailyLesson.sport)) dailyLesson.lessons.push(dailyLesson.sport);
            dailyLesson.lessons.push(dailyLesson.night);

            dailyLesson.lessons.forEach(lesson => {
                lesson.categories = _.uniq((lesson.courses||[]).map(course => course.category));
            });

            delete dailyLesson.emorning;
            delete dailyLesson.morning;
            delete dailyLesson.afternoon;
            delete dailyLesson.sport;
            delete dailyLesson.night;

            delete dailyLesson.tmpLessons;
        });
    }

    // 匹配课目分类规则，并填入课表
    _fillCategoryByCourseRule() {
        let courseRules = this.courseRules.filter(item => _.isEmpty(item.course));


        courseRules.forEach(courseRule => {
            let {matchItems, matchCount} = this._matchCourseRule(courseRule);
            matchItems.forEach(matchItem => {
                matchItem.lessons.forEach(lesson => {
                    if (lesson.priority<matchItem.priority) {
                        lesson.category = courseRule.courseCategory;
                        lesson.priority = matchItem.priority;
                        lesson.courses = [];
                    }
                });
            });
        })
    }

    // 对课目全局规则进行匹配
    _fillCourseByCourseRule() {
        let courseRules = this.courseRules.filter(item => item.course && item.courseCategory !== CourseCategory.Train);


        courseRules.forEach(courseRule => {
            let {matchItems, matchCount} = this._matchCourseRule(courseRule);

            let lessonCourse = {
                seq: courseRule.course.seq,
                name: courseRule.course.name,
                courseId: courseRule.course.objectId,
                category: courseRule.courseCategory,
                major: courseRule.course.majorReq,
                gunnerType: courseRule.course.gunnerType,
                isManual: false,
                subcourses: []
            };

            if (matchCount > 0) {
                matchItems.forEach(matchItem => {
                    matchItem.lessons.forEach(lesson => {
                        if (lesson.priority<matchItem.priority) {
                            lesson.category = courseRule.courseCategory;
                            lesson.priority = matchItem.priority;
                            lesson.courses = [lessonCourse];
                        } else if (lesson.priority===matchItem.priority) {
                            lesson.category = courseRule.courseCategory;
                            lesson.courses = lesson.courses || [];
                            if (lesson.courses.findIndex(item => item.courseId === courseRule.course.objectId) < 0) {
                                lesson.courses.push(lessonCourse);
                            }
                        }
                    });
                });
            }
        });
    }

    _fillTrainCourseByPlan() {
        let courseResult1 = this._getAllCourses(this.nextWeekOfMonth.weekStart);
        let courseResult2 = this._getAllCourses(this.nextWeekOfMonth.weekEnd);
        let courses = _.uniqWith([].concat(courseResult1.courses, courseResult2.courses), (a, b) => a.objectId===b.objectId && baseUtils.isEqualValue(a.majorReq, b.majorReq));

        if (_.isEmpty(courses)) {
            const result = this._getAllCoursesThisYear();
            courses = result.courses;
        }

        let orgCourses = _.cloneDeep(this.orgCourses);
        orgCourses = orgCourses.map(item => {
            item.course = courses.find(course => course.objectId === item.courseId && baseUtils.isEqualValue(course.majorReq, item.major));
            if (!item.course) item.course = courses.find(course => course.objectId === item.courseId);
            item.gunnerType = item.course&&item.course.gunnerType;
            item.ordnanceTypes = item.course&&item.course.ordnanceTypes;
            item.remainHoursInDay = item.hoursInDay;
            item.remainHoursAtNight = item.hoursAtNight;
            return item;
        }).filter(item => item.course);

        let skipedCourses = [];
        orgCourses.forEach(weekCourse => {
            if (weekCourse.course&&weekCourse.course.name.includes('士官')) {
                skipedCourses.push(weekCourse);
                return;
            } else {
                this._fillLessonsWithTrainCourse(weekCourse);
            }
        });

        skipedCourses.forEach(weekCourse => {
            this._fillLessonsWithTrainCourse(weekCourse);
        });
    }

    _createCourseStatus(date, lessonCourse, courses, courseTimes) {
        const courseId = lessonCourse.courseId || lessonCourse.objectId;
        const major = lessonCourse.major || lessonCourse.majorReq;
        let course = courses.find(item => item.objectId === courseId && baseUtils.isEqualValue(item.majorReq, major));
        if (!course) return undefined;

        let courseTime = undefined;
        if (course.category === CourseCategory.Train) {
            courseTime = courseTimes.find(ct => ct.courseIds.includes(courseId) && baseUtils.isEqualValue(ct.majorReq, major));
        }

        // 生成课目状态
        let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === courseId && baseUtils.isEqualValue(cs.major, major));
        if (!courseStatus) {
            let oldCS = this.courseStatuses.find(cs => cs.course.objectId === courseId && baseUtils.isEqualValue(cs.major, major));
            if (oldCS) {
                courseStatus = {
                    ...oldCS,
                    monthStats: _.cloneDeep(oldCS.monthStats)
                };
            } else {
                courseStatus = {
                    year: date.getFullYear(),
                    course,
                    category: course.category,
                    major: major,
                    organization: this.weeklyPlan.organization,
                    state: CourseState.Initial,
                    needTest: course.category===CourseCategory.Train,
                    startAt: date,
                    endAt: undefined,
                    hoursInDay: courseTime&&courseTime.hoursInDay||0,
                    hoursAtNight: courseTime&&courseTime.hoursAtNight||0,
                    actualHoursInDay: 0,
                    actualHoursAtNight: 0,
                    retainHours: 0,
                    patchHours: 0,
                    countInYear: 0,
                    competitionCount:0,
                    lastPlace: undefined,
                    lastTrainer: undefined,
                    monthStats: []
                };
                courseStatus.lastTrainer = this._getTrainerByCourseStatus(courseStatus);
                courseStatus.lastPlace = this._getTrainPlaceByCourseStatus(courseStatus);
                this.courseStatuses.push(courseStatus);
            }
            this.updatedCourseStatuses.push(courseStatus);
        }

        return courseStatus;
    }

    _updateCourseStatus(dailyLesson, lesson, courseStatus, isRemove=false) {
        let month = dailyLesson.date.getMonth()+1;
        // 更新课目状态数据
        if (!isRemove) courseStatus.endAt = dailyLesson.date;

        if (!isRemove) courseStatus.countInYear++;
        else courseStatus.countInYear = Math.max(courseStatus.countInYear-1, 0);

        // 更新按月统计数据
        let monthStat = courseStatus.monthStats.find(item => item.month === month);
        if (_.isEmpty(monthStat)) {
            monthStat = {
                month,
                actualHoursInDay: 0,
                actualHoursAtNight: 0,
                countInMonth: 0
            };
            courseStatus.monthStats.push(monthStat);
        }
        if (!isRemove) monthStat.countInMonth++;
        else monthStat.countInMonth = Math.max(monthStat.countInMonth-1, 0);

        // 更新第一个课目的课时数，也就是说课时累计到第一个课目
        // if (lesson.courses.length===1)
        {
            if (!isRemove) {
                if (lesson.section === DailySection.Night) {
                    courseStatus.actualHoursAtNight += lesson.hours;
                    monthStat.actualHoursAtNight += lesson.hours;
                } else {
                    courseStatus.actualHoursInDay += lesson.hours;
                    monthStat.actualHoursInDay += lesson.hours;
                }
            } else {
                if (lesson.section === DailySection.Night) {
                    courseStatus.actualHoursAtNight = Math.max(courseStatus.actualHoursAtNight-lesson.hours, 0);
                    monthStat.actualHoursAtNight = Math.max(monthStat.actualHoursAtNight-lesson.hours, 0);
                } else {
                    courseStatus.actualHoursInDay = Math.max(courseStatus.actualHoursInDay-lesson.hours, 0);
                    monthStat.actualHoursInDay = Math.max(monthStat.actualHoursInDay-lesson.hours, 0);
                }
            }
        }

    }

    // 统计课目时间，更新课目状态
    _updateCourseStatuses() {
        this.updatedCourseStatuses = [];
        this.weeklyPlan.hoursInDay = 0;
        this.weeklyPlan.hoursAtNight = 0;

        this.weeklyPlan.dailyLessons.forEach(dailyLesson => {
            let month = dailyLesson.date.getMonth()+1;
            const {courses, courseTimes} = this._getAllCourses(dailyLesson.date);

            dailyLesson.hoursInDay = 0;
            dailyLesson.hoursAtNight = 0;
            dailyLesson.lessons.forEach(lesson => {
                if (_.isEmpty(lesson)) return;

                if (lesson.category === CourseCategory.Train) {
                    // 对每日和每周统计军事训练课时
                    if (lesson.section === DailySection.Night) {
                        this.weeklyPlan.hoursAtNight += lesson.hours;
                        dailyLesson.hoursAtNight += lesson.hours;
                    } else {
                        this.weeklyPlan.hoursInDay += lesson.hours;
                        dailyLesson.hoursInDay += lesson.hours;
                    }
                }

                if (!_.isEmpty(lesson.courses)) {
                    lesson.courses.forEach(lessonCourse => {
                        if (_.isEmpty(lessonCourse.courseId)) return;     // 手动输入的课目不统计

                        let courseStatus = undefined;
                        if (lesson.category === CourseCategory.Train) {
                            courseStatus = this._createCourseStatus(dailyLesson.date, lessonCourse, courses, courseTimes);
                        } else {
                            courseStatus  = this._createCourseStatus(dailyLesson.date, lessonCourse, this.otherCourses, undefined);
                        }
                        if (_.isEmpty(courseStatus)) {
                            return;
                        }

                        // 设置教练员和场地
                        if (_.isEmpty(lesson.trainer)) lesson.trainer = courseStatus.lastTrainer;
                        if (_.isEmpty(lesson.place)) lesson.place = courseStatus.lastPlace;

                        this._updateCourseStatus(dailyLesson, lesson, courseStatus);
                    });
                }
            })
        });
    }


    _fillLessonsWithTrainCourse(weekCourse) {
        let lessonCourse = {
            ...weekCourse,
            category: CourseCategory.Train,
            isManual: false,
            subcourses: []
        };
        delete lessonCourse.course;
        delete lessonCourse.hoursInDay;
        delete lessonCourse.hoursAtNight;
        delete lessonCourse.remainHoursInDay;
        delete lessonCourse.remainHoursAtNight;
        let unitHours = 2;
        if (weekCourse.remainHoursInDay>8) unitHours=4;

        // 针对专业课目或枪手课目，优先查找是不是已安排并列专业，有的话安排同时训练
        if (!_.isEmpty(weekCourse.major) || !_.isEmpty(weekCourse.gunnerType)) {
            this.weeklyPlan.dailyLessons.forEach(dailyLesson => {
                if (dailyLesson.dayType === DayType.Workday) {
                    dailyLesson.tmpLessons.forEach(lesson => {
                        if (_.isEmpty(lesson.courses)) return;
                        if (lesson.category != CourseCategory.Train) return;
                        let arrangedMajors = lesson.courses.map(item => item.major).filter(item => !_.isEmpty(item));
                        let arrangedGunnerTypes = lesson.courses.map(item => item.gunnerType).filter(item => !_.isEmpty(item));

                        // 昼训
                        if (weekCourse.remainHoursInDay>0 && (lesson.section === DailySection.Morning || lesson.section === DailySection.Afternoon)) {
                            let arranged = false;
                            if (!_.isEmpty(weekCourse.major) && !_.isEmpty(arrangedMajors) && !arrangedMajors.includes(weekCourse.major)) {
                                // 都是专业课目，但是本专业还未安排，则插入
                                lesson.courses.push({...lessonCourse});
                                weekCourse.remainHoursInDay -= lesson.hours;
                                arranged = true;
                            }

                            if (!arranged && !_.isEmpty(weekCourse.gunnerType) && !_.isEmpty(arrangedGunnerTypes) && !arrangedGunnerTypes.includes(weekCourse.gunnerType)) {
                                // 都是枪手课目，但是本枪手还未安排，则插入
                                lesson.courses.push({...lessonCourse});
                                weekCourse.remainHoursInDay -= lesson.hours;
                            }
                        }

                        // 夜训
                        if (weekCourse.remainHoursAtNight>0 && (lesson.section === DailySection.Night)) {
                            let arranged = false;
                            if (!_.isEmpty(weekCourse.major) && !_.isEmpty(arrangedMajors) && !arrangedMajors.includes(weekCourse.major)) {
                                // 都是专业课目，但是本专业还未安排，则插入
                                lesson.courses.push({...lessonCourse});
                                weekCourse.remainHoursAtNight -= lesson.hours;
                                arranged = true;
                            }

                            if (!arranged && !_.isEmpty(weekCourse.gunnerType) && !_.isEmpty(arrangedGunnerTypes) && !arrangedGunnerTypes.includes(weekCourse.gunnerType)) {
                                // 都是枪手课目，但是本枪手还未安排，则插入
                                lesson.courses.push({...lessonCourse});
                                weekCourse.remainHoursAtNight -= lesson.hours;
                            }
                        }
                    })
                };
            });
        }

        if (weekCourse.remainHoursInDay<=0&&weekCourse.remainHoursAtNight<=0) return;

        let dayLen = this.dailySchedule.morning+this.dailySchedule.afternoon-1;

        // 简化日表
        let dailyLessons = this.weeklyPlan.dailyLessons.filter(item => item.dayType === DayType.Workday)
            .map(dailyLesson => {
                let morningRemain = dailyLesson.morning.filter(lesson => lesson.category === CourseCategory.Train && _.isEmpty(lesson.courses));
                let afternoonRemain = dailyLesson.afternoon.filter(lesson => lesson.category === CourseCategory.Train && _.isEmpty(lesson.courses));

                return {
                    date: dailyLesson.date,
                    hours: morningRemain.length+afternoonRemain.length,
                    morningHours: morningRemain.length,
                    afternoonHours: afternoonRemain.length,
                    morningRemain,
                    afternoonRemain
                }
            });

        // 针对射击课目，优先找完整的一天或半天来安排
        if (!_.isEmpty(weekCourse.ordnanceTypes) && weekCourse.remainHoursInDay>0) {
            let withFullDays = dailyLessons.filter(item => item.hours === dayLen);
            let withHalfDays = dailyLessons.filter(item => item.morningHours === this.dailySchedule.morning || item.afternoonHours === this.dailySchedule.afternoon-1);
            if (!_.isEmpty(withFullDays)) {
                // 射击课目优先安排全天训练
                for (let daily of withFullDays) {
                    let lessons = daily.morningRemain.concat(daily.afternoonRemain);
                    for (let lesson of lessons) {
                        lesson.courses = [{...lessonCourse}];
                        lesson.category = CourseCategory.Train;
                        weekCourse.remainHoursInDay -= lesson.hours;
                        if (weekCourse.remainHoursInDay<=0) break;
                    }
                    if (weekCourse.remainHoursInDay<=0) break;
                }
                // 射击课目其次安排半天训练
                if (weekCourse.remainHoursInDay>0) {
                    for (let daily of withHalfDays) {
                        let lessons = [];
                        if (daily.morningHours === this.dailySchedule.morning) lessons = daily.morningRemain;
                        else lessons = daily.afternoonRemain;

                        for (let lesson of lessons) {
                            lesson.courses = [{...lessonCourse}];
                            lesson.category = CourseCategory.Train;
                            weekCourse.remainHoursInDay -= lesson.hours;
                            if (weekCourse.remainHoursInDay<=0) break;
                        }
                        if (weekCourse.remainHoursInDay<=0) break;
                    }
                }
            }
        }

        // 寻找空课目进行安排
        this.weeklyPlan.dailyLessons.forEach(dailyLesson => {
            if (dailyLesson.dayType === DayType.Workday && weekCourse.remainHoursInDay>0) {
                let hoursPerDay = Math.min(unitHours, weekCourse.remainHoursInDay);
                if (weekCourse.remainHoursInDay === 3) hoursPerDay = 3;

                let morningRemain = dailyLesson.morning.filter(lesson => lesson.category === CourseCategory.Train && _.isEmpty(lesson.courses));
                let afternoonRemain = dailyLesson.afternoon.filter(lesson => lesson.category === CourseCategory.Train && _.isEmpty(lesson.courses));
                let morningHours = morningRemain.length;
                let afternoonHours = afternoonRemain.length;

                // 根据课时情况判断安排在上午还是下午
                let lessons = [];
                if (afternoonHours===hoursPerDay && (hoursPerDay===1 || hoursPerDay===3)) {
                    lessons = afternoonRemain;
                } else if (morningHours>=hoursPerDay) {
                    lessons = morningRemain;
                } else if (morningHours<hoursPerDay&&afternoonHours>=hoursPerDay) {
                    lessons = afternoonRemain;
                } else if (morningHours>0) {
                    lessons = morningRemain;
                } else if (afternoonHours>0) {
                    lessons = afternoonRemain;
                }

                for (let lesson of lessons) {
                    lesson.courses = [{...lessonCourse}];
                    lesson.category = CourseCategory.Train;
                    weekCourse.remainHoursInDay -= lesson.hours;
                    if (weekCourse.remainHoursInDay<=0) break;
                }
            };
        });

        // 如果还有课时没有安排完，那么再遍历一次，这次只有有空闲就随意插入
        if (weekCourse.remainHoursInDay>0) {
            this.weeklyPlan.dailyLessons.forEach(dailyLesson => {
                if (dailyLesson.dayType === DayType.Workday && weekCourse.remainHoursInDay>0) {
                    let morningRemain = dailyLesson.morning.filter(lesson => lesson.category === CourseCategory.Train && _.isEmpty(lesson.courses));
                    let afternoonRemain = dailyLesson.afternoon.filter(lesson => lesson.category === CourseCategory.Train && _.isEmpty(lesson.courses));
                    let lessons = morningRemain.concat(afternoonRemain);

                    for (let lesson of lessons) {
                        lesson.courses = [{...lessonCourse}];
                        lesson.category = CourseCategory.Train;
                        weekCourse.remainHoursInDay -= lesson.hours;
                        if (weekCourse.remainHoursInDay<=0) break;
                    }
                };
            });
        }

        // 夜训安排
        if (weekCourse.remainHoursAtNight>0) {
            // 优先找空闲的可夜训时间
            let withNightDays = this.weeklyPlan.dailyLessons.filter(item => item.dayType === DayType.Workday && _.isEmpty(item.night.courses));
            let totalHours = withNightDays.length*this.dailySchedule.night;

            // 如果排不下，则抢占夜间体能训练时间
            if (totalHours<weekCourse.remainHoursAtNight) {
                withNightDays = this.weeklyPlan.dailyLessons.filter(item =>
                    item.dayType === DayType.Workday &&
                    (_.isEmpty(item.night.courses) || item.night.category===CourseCategory.Sport || item.night.category===CourseCategory.Others)
                );
                totalHours = withNightDays.length*this.dailySchedule.night;
            }

            // 如果还排不下，则继续抢占夜间其它活动时间
            if (totalHours<weekCourse.remainHoursAtNight) {
                withNightDays = this.weeklyPlan.dailyLessons.filter(item =>
                    item.dayType === DayType.Workday &&
                    (_.isEmpty(item.night.courses) || item.night.category===CourseCategory.Sport || item.night.category===CourseCategory.Others)
                );
                totalHours = withNightDays.length*this.dailySchedule.night;
            }

            for (let daily of withNightDays) {
                daily.night.courses.push({...lessonCourse});
                daily.night.category = CourseCategory.Train;
                weekCourse.remainHoursAtNight -= daily.night.hours;
                if (weekCourse.remainHoursAtNight<=0) break;
            }
        }


    }

    // 对只配置了课目类型的全局规则进行匹配
    _matchCourseRule(courseRule) {
        let matchItems = [];
        let matchCount = 0;
        let countThisMonth = 0;
        let countThisYear = 0;
        let isCategoryRule = !courseRule.course;
        let isMatchPreRule = false;

        if (isCategoryRule === false) {
            // 计算本月已经安排本课目的次数
            if (courseRule.rateEnabled === true &&
                courseRule.rateUnit === TimeUnit.Monthly) {
                countThisMonth = this._matchCountThisMonth(courseRule.course);
                if (countThisMonth >= courseRule.times) return {matchItems, matchCount};
            }

            // 匹配年度总数
            if (courseRule.totalEnabled === true) {
                countThisYear = this._matchCountThisYear(courseRule.course);
                if (countThisYear >= courseRule.totalTimes) return {matchItems, matchCount};
            }

            // 匹配前置规则
            if (courseRule.preRule) {
                isMatchPreRule = this._matchPreRule(courseRule.preRule);
                if (isMatchPreRule === false) return {matchItems, matchCount};
            }
        }

        for (let childRule of courseRule.childRules) {
            // 跳过军事课目夜训规则, 后面特殊处理
            // if (courseRule.courseCategory === constants.COURSE_CATEGORY_TRAIN &&
            //     childRule.section === constants.DAY_SECTION_NIGHT)
            //     continue;

            // 检查周序号是否匹配
            if (childRule.weekSeq && childRule.weekSeq.length > 0) {
                if (!(childRule.weekSeq.includes(this.weeklyPlan.weekSeq) ||
                (this.weeklyPlan.isLastWeek === true && childRule.weekSeq.includes(TheLastValue)))) {
                    continue;
                }
            }

            // 如果大于每周频次，则后续不处理
            if (courseRule.rateEnabled === true &&
                courseRule.rateUnit === TimeUnit.Weekly &&
                matchCount >= courseRule.times) {
                break;
            }

            if (isCategoryRule === false) {
                // 匹配每月频次
                if (courseRule.rateEnabled === true && courseRule.rateUnit === TimeUnit.Monthly) {
                    if (countThisMonth + matchCount >= courseRule.times) break;
                }

                // 匹配年度总数
                if (courseRule.totalEnabled === true &&
                    countThisYear + matchCount >= courseRule.totalTimes) {
                    break;
                }
            }

            // 对整周日期进行遍历
            for (let dailyLesson of this.weeklyPlan.dailyLessons) {
                let matchItem = {
                    dailyLesson,
                    count: 0,
                    priority: childRule.priority,
                    lessons: []
                };

                // 匹配天气要求
                if (!_.isEmpty(courseRule.forbiddenWeathers)) {
                    if (!_.isEmpty(dailyLesson.weather)) {
                        if (courseRule.forbiddenWeathers.includes(dailyLesson.weather)) continue;
                    }
                }

                // 如果大于每周频次，则后续不处理
                if (courseRule.rateEnabled === true &&
                    courseRule.rateUnit === TimeUnit.Weekly &&
                    matchCount >= courseRule.times) {
                    break;
                }

                if (isCategoryRule === false) {
                    // 匹配每月频次
                    if (courseRule.rateEnabled === true &&
                        courseRule.rateUnit === TimeUnit.Monthly) {
                        if (countThisMonth + matchCount >= courseRule.times) break;
                    }

                    // 匹配年度总数
                    if (courseRule.totalEnabled === true &&
                        countThisYear + matchCount >= courseRule.totalTimes) {
                        break;
                    }
                }

                // 检查每一天的月份是否匹配
                if (!_.isEmpty(childRule.months)) {
                    let month = dateUtils.weekOfMonth(dailyLesson.date).month;

                    if (!childRule.months.includes(month)) {
                        continue;
                    }
                }

                // 检查日期类型是否匹配
                if (childRule.dayType !== dailyLesson.dayType)  continue;

                // 如果是工作日或休息日，检查星期几是否匹配
                if (childRule.dayType != DayType.Holiday && !_.isEmpty(childRule.weekdays)) {
                    if (!childRule.weekdays.includes(dailyLesson.weekday)) {
                        continue;
                    }
                // 如果是节假日，检查是否匹配假日序号
                } else if (childRule.dayType === DayType.Holiday && !_.isEmpty(childRule.holidays)) {
                    if (!(childRule.holidays.includes(dailyLesson.holidayIndex) ||
                        (dailyLesson.isLast === true && childRule.holidays.includes(TheLastValue)))) {
                        continue;
                    }
                }

                // 根据优先级匹配每一个课时
                if (childRule.section === DailySection.EarlyMoring &&
                    (dailyLesson.emorning.priority < childRule.priority ||
                        (!isMatchPreRule && !isCategoryRule && dailyLesson.emorning.priority === childRule.priority))) {
                    matchItem.count++;
                    // dailyLesson.emorning.priority = childRule.priority;
                    matchItem.lessons.push(dailyLesson.emorning);
                } else if (childRule.section === DailySection.Night &&
                    (dailyLesson.night.priority < childRule.priority ||
                        (!isMatchPreRule && !isCategoryRule && dailyLesson.night.priority === childRule.priority))) {
                    matchItem.count++;
                    // dailyLesson.night.priority = childRule.priority;
                    matchItem.lessons.push(dailyLesson.night);
                } else if (childRule.section === DailySection.Sport && dailyLesson.sport &&
                    (dailyLesson.sport.priority < childRule.priority ||
                        (!isMatchPreRule && !isCategoryRule && dailyLesson.sport.priority === childRule.priority))) {
                    matchItem.count++;
                    // dailyLesson.sport.priority = childRule.priority;
                    matchItem.lessons.push(dailyLesson.sport);
                } else if (childRule.section === DailySection.Morning) {
                    let fromHour = childRule.fromHour > 1 ? childRule.fromHour : 1;
                    fromHour = fromHour - 1;

                    if (!childRule.hours) childRule.hours = dailyLesson.morning.length - fromHour;
                    let matched = false;
                    for (let index = fromHour; index < fromHour+childRule.hours && index < dailyLesson.morning.length; index++) {
                        let lesson = dailyLesson.morning[index];
                        if (lesson.priority < childRule.priority || (!isMatchPreRule && !isCategoryRule && lesson.priority === childRule.priority)) {
                            // lesson.priority = childRule.priority;
                            matchItem.lessons.push(lesson);
                            matched = true;
                        }
                    }
                    if (matched === true) matchItem.count++;
                } else if (childRule.section === DailySection.Afternoon) {
                    let fromHour = childRule.fromHour > 1 ? childRule.fromHour : 1;
                    fromHour = fromHour - 1;
                    if (!childRule.hours) childRule.hours = dailyLesson.afternoon.length - fromHour;
                    let matched = false;
                    for (let index = fromHour; index < fromHour+childRule.hours && index < dailyLesson.afternoon.length; index++) {
                        let lesson = dailyLesson.afternoon[index];
                        if (lesson.priority < childRule.priority || (!isMatchPreRule && !isCategoryRule && lesson.priority === childRule.priority)) {
                            // lesson.priority = childRule.priority;
                            matchItem.lessons.push(lesson);
                            matched = true;
                        }
                    }
                    if (matched === true) matchItem.count++;
                }

                if (matchItem.count > 0) {
                    matchCount += matchItem.count;
                    matchItems.push(matchItem);
                }
            }
        }

        return {matchItems, matchCount};
    }

    // 匹配前置规则是否已经满足
    _matchPreRule(rule) {
        let countThisMonth = 0;
        let countThisYear = 0;
        let preRule = this.courseRules.find(item => item.objectId === rule.objectId);
        if (!preRule) return false;

        let isCategoryRule = !preRule.course;

        if (isCategoryRule === false) {
            let count = this._matchCountThisWeek(preRule.course);

            // 匹配本月已经安排本课目的次数
            if (preRule.rateEnabled === true &&
                preRule.rateUnit === TimeUnit.Monthly) {
                countThisMonth = this._matchCountThisMonth(preRule.course);

                if (countThisMonth+count >= preRule.times) return true;
            }

            // 匹配本年已经安排本课目的次数
            if (preRule.totalEnabled === true) {
                countThisYear = this._matchCountThisYear(preRule.course);

                if (countThisYear+count >= preRule.totalTimes) return true;
            }
        }

        return false;
    }

    // 计算该课目本周已经安排的次数
    _matchCountThisWeek(course) {
        let count = 0;

        this.weeklyPlan.dailyLessons.forEach(dailyLesson => {
            let courses = dailyLesson.emorning.courses;
            if (!_.isEmpty(courses) && courses.findIndex(item => item.courseId===course.objectId)>=0)  count++;

            courses = dailyLesson.night.courses;
            if (!_.isEmpty(courses) && courses.findIndex(item => item.courseId===course.objectId)>=0)  count++;

            courses = (dailyLesson.sport&&dailyLesson.sport.courses) || [];
            if (!_.isEmpty(courses) && courses.findIndex(item => item.courseId===course.objectId)>=0)  count++;

            courses = dailyLesson.morning.reduce((prev, curr) => {
                (!_.isEmpty(curr.courses)) && (prev = prev.concat(curr.courses));
                return prev;
            }, []);
            if (!_.isEmpty(courses) && courses.findIndex(item => item.courseId===course.objectId)>=0)  count++;

            courses = dailyLesson.afternoon.reduce((prev, curr) => {
                (!_.isEmpty(curr.courses)) && (prev = prev.concat(curr.courses));
                return prev;
            }, []);
            if (!_.isEmpty(courses) && courses.findIndex(item => item.courseId===course.objectId)>=0)  count++;
        });

        return count;
    }

    _matchCountThisMonth(course) {
        let count = 0;
        let courseStatus = this.courseStatuses.find(item => item.course.objectId === course.objectId);
        if (courseStatus && !_.isEmpty(courseStatus.monthStats)) {
            let month = this.nextWeekOfMonth.month;
            let monthStat = courseStatus.monthStats.find(item => item.month === month);

            if (monthStat) count = monthStat.countInMonth || 0;
        }

        return count;
    }

    _matchCountThisYear(course) {
        let count = 0;
        let courseStatus = this.courseStatuses.find(item => item.course.objectId === course.objectId);
        if (courseStatus) {
            count = courseStatus.countInYear || 0;
        }

        return count;
    }

    _reduceLessons(lessons) {
        let newLessons = lessons.reduce((prev, curr) => {
            let found = prev.find(item => {
                return item.category===curr.category && _.isEqual(item.courses, curr.courses);
            });
            if (found) {
                found.hours += curr.hours;
            } else {
                prev.push({...curr});
            }
            return prev;
        }, []);

        return newLessons;
    }

    async _getCommanders() {
        let currOrg = this.backendService.getCurrentOrganization();
        let query = new Client.Query(Client.Soldier);
        query.equalTo('organization', this.backendService.getParseObject('Organization', currOrg.objectId));
        query.equalTo('isCommander', true);
        query.equalTo('isMaster', true);
        let result = await this.backendService.queryListAll('Soldier', query);
        let commander1 = result.list.find(item => item.position === '中队长');
        let commander2 = result.list.find(item => item.position === '指导员');

        return {commander1, commander2};
    }

    async _checkExists(date) {
        let query = new Client.Query(Client.WeeklyPlan);
        query.equalTo('organization', this.backendService.getParseObject('Organization', this.organization.objectId));
        query.greaterThanOrEqualTo('toDate', date);
        query.lessThanOrEqualTo('fromDate', date);
        let result = await this.backendService.queryListAll('WeeklyPlan', query);

        return !_.isEmpty(result.list);
    }

    _checkHoliday(date) {
        let holiday = this.holidays.find(item => item.date === date);
        if (_.isEmpty(holiday)) {
            return {
                dayType: dateUtils.isWeekend(moment(date).weekday()) ? DayType.Weekend : DayType.Workday,
                holiday: '',
                holidayIndex: 0,
            };
        } else {
            if (holiday.type === DayType.Workday) {
                return {
                    dayType: DayType.Workday,
                    holiday: holiday.name,
                    holidayIndex: 0,
                };
            } else {
                let start = this.weekOfMonth.weekStart;
                let stop = this.nextWeekOfMonth.weekEnd;
                let holidays = this.holidays.filter(item => item.type === DayType.Holiday && item.date>=start && item.date<=stop);
                let index = 1;
                _.reduce(holidays, (result, curr) => {
                    if (result) {
                        if (moment(curr).diff(moment(result), 'days') === 1) {
                            result.holidayIndex = index++;
                        } else {
                            index = 1;
                        }
                    }
                    return curr;
                }, undefined);

                return {
                    dayType: DayType.Holiday,
                    holiday: holiday.name,
                    holidayIndex: holiday.holidayIndex
                };
            }
        }
    }

    _getAllCourses(date) {
        let courses = [];
        let courseTimes = [];
        let annualPlanItems = this.unitForceAnnualPlanItems.filter(item => date>=item.fromDate&&date<=item.toDate);
        annualPlanItems.forEach(planItem => {
            courses = courses.concat(planItem.commonCourses);
            courseTimes = courseTimes.concat(planItem.commonCourseTimes);
            if (!_.isEmpty(planItem.majorCourses)) {
                courses = courses.concat(planItem.majorCourses);
                courseTimes = courseTimes.concat(planItem.majorCourseTimes);
            }
        });
        courses = _.uniqWith(courses, (a, b) => a.objectId===b.objectId && baseUtils.isEqualValue(a.majorReq, b.majorReq));
        courseTimes = _.uniqWith(courseTimes, (a, b) => baseUtils.isEqualValue(a.courseIds, b.courseIds) && baseUtils.isEqualValue(a.majorReq, b.majorReq));

        return {courses, courseTimes};
    }

    _getAllCoursesThisYear() {
        let courses = [];
        let courseTimes = [];
        this.annualPlanItemsThisYear.forEach(planItem => {
            courses = courses.concat(planItem.commonCourses);
            courseTimes = courseTimes.concat(planItem.commonCourseTimes);
            if (!_.isEmpty(planItem.majorCourses)) {
                courses = courses.concat(planItem.majorCourses);
                courseTimes = courseTimes.concat(planItem.majorCourseTimes);
            }
        });
        courses = _.uniqWith(courses, (a, b) => a.objectId===b.objectId && baseUtils.isEqualValue(a.majorReq, b.majorReq));
        courseTimes = _.uniqWith(courseTimes, (a, b) => baseUtils.isEqualValue(a.courseIds, b.courseIds) && baseUtils.isEqualValue(a.majorReq, b.majorReq));

        return {courses, courseTimes};
    }

    _getLessonsByCourse(course) {
        let lessons = [];

        this.weeklyPlan.dailyLessons.forEach(dailyLesson => {
            dailyLesson.lessons.forEach(lesson => {
                if (!_.isEmpty(lesson.courses)) {
                    let foundIndex = lesson.courses.findIndex(item => item.courseId === course.objectId);
                    if (foundIndex>=0) lessons.push(lesson);
                }
            });
        });

        return lessons;
    }

    _calcCourseHoursThisWeek(course) {
        const lessons = this._getLessonsByCourse(course);

        return lessons.reduce((prev, curr) => {
            if (curr.section === DailySection.Night) {
                prev.hoursAtNight += curr.hours;
            } else {
                prev.hoursInDay += curr.hours;
            }

            return prev;
        }, {hoursInDay: 0, hoursAtNight: 0})
    }

    _calcCourseHoursThisMonth(course, date) {
        let monthStat = undefined;
        let courseStatus = this._getCourseStatusByCourse(course);
        if (courseStatus) {
            const month = date.getMonth()+1;
            if (!_.isEmpty(courseStatus.monthStats)) {
                monthStat = courseStatus.monthStats.find(item => item.month === month);
            }
        }

        return {
            hoursInDay: monthStat&&monthStat.actualHoursInDay||0,
            hoursAtNight: monthStat&&monthStat.actualHoursAtNight||0
        }
    }

    _getCourseStatusByCourse(course) {
        const courseId = course.objectId || course.courseId;
        const major = course.majorReq || course.major;
        let courseStatus = this.updatedCourseStatuses.find(cs => cs.course.objectId === courseId && baseUtils.isEqualValue(cs.major, major));
        if (!courseStatus) {
            courseStatus = this.courseStatuses.find(cs => cs.course.objectId === courseId && baseUtils.isEqualValue(cs.major, major));
        }

        return courseStatus;
    }

    _getTrainerByCourseStatus(courseStatus) {
        if (!_.isEmpty(courseStatus.lastTrainer)) return courseStatus.lastTrainer;

        let found = this.trainers.find(trainer => {
            if (!_.isEmpty(trainer.availableCourses)) {
                return trainer.availableCourses.findIndex(course => course.objectId === courseStatus.course.objectId)>=0;
            } else {
                return false;
            }
        });

        if (_.isEmpty(found)) {
            found = this.trainers.find(trainer => {
                if (!_.isEmpty(trainer.availableAssistCourses)) {
                    return trainer.availableAssistCourses.findIndex(course => course.objectId === courseStatus.course.objectId)>=0;
                } else {
                    return false;
                }
            });
        }

        return found&&found.soldier||undefined;
    }

    _getTrainPlaceByCourseStatus(courseStatus) {
        if (!_.isEmpty(courseStatus.lastPlace)) return courseStatus.lastPlace;

        let found = this.places.find(place => {
            let placeTypes = _.intersection(place.placeTypes, courseStatus.course.placeTypes);
            return !_.isEmpty(placeTypes);
        });

        return found;
    }

    fixMajorCourses(annualPlanItem) {
        if (!_.isEmpty(annualPlanItem.majorCoursesV2)) {
            let optionalCourses = annualPlanItem.majorCourses;
            annualPlanItem.majorCourses = annualPlanItem.majorCoursesV2.map(courseV2 => {
                const course = optionalCourses.find(item => item.objectId === courseV2.courseId);
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

    async _fetchRules(organization, theSameWeek=false) {
        let fromYear = this.nextWeekOfMonth.weekStart.getFullYear();
        let thisYear = this.nextWeekOfMonth.weekMiddle.getFullYear();
        let toYear = this.nextWeekOfMonth.weekEnd.getFullYear();

        let mainOrg = await this.backendService.orgService.getMainOrgByChild(organization);
        let parseOrg = this.backendService.getParseObject('Organization', organization.objectId);

        // 获取关联的年度计划ID
        if (_.isEmpty(this.annualPlanId)) {
            let query = new Client.Query(Client.AnnualPlanTarget);
            query.equalTo('year', thisYear);
            query.equalTo('targetOrgId', organization.objectId);
            let result = await this.backendService.queryListAll('AnnualPlanTarget', query);
            this.annualPlanId = (result.list[0]||{}).annualPlanId;
            if (_.isEmpty(this.annualPlanId)) {
                query = new Client.Query(Client.WeeklyPlan);
                query.equalTo('year', thisYear);
                query.equalTo('organization', parseOrg);
                query.addDescending('fromDate').limit(10);
                result = await this.backendService.queryList('WeeklyPlan', query);
                this.annualPlanId = (result.list[0]||{}).annualPlanId;
            }

            // if (!_.isEmpty(this.annualPlanId)) {
            //     const plan = await this.fetchItem('UnitForceAnnualPlan', this.annualPlanId);
            //     if (plan && plan.state != SubmitState.Submited) this.annualPlanId = undefined;
            // }
        }

        let orgMajors = [];
        {
            let query = new Client.Query(Client.OrgCategory);
            query.equalTo('name', organization.orgCategory);
            const result = await this.backendService.queryListAll('OrgCategory', query);
            if (!_.isEmpty(result.list)) {
                orgMajors = result.list[0].optionalMajors || [];
            }
        }

        // 获取专业列表
        if (!_.isEmpty(orgMajors)) {
            let localOrgs = await this.backendService.orgService.getLocalOrganizations(organization);
            localOrgs = localOrgs.filter(item => item.orgCategory === organization.orgCategory);
            // this.trainMajors = _.uniq(localOrgs.map(item => item.orgMajor).filter(item => !_.isEmpty(item)));
            if (_.isEmpty(this.trainMajors)) {
                localOrgs.map(item => {
                    if (!_.isEmpty(item.orgMajors)) this.trainMajors = this.trainMajors.concat(item.orgMajors);
                });
            }
            if (_.isEmpty(this.trainMajors)) {
                let soldiers = await this.backendService.soldierService.getAllLocalSoldiers(organization);
                this.trainMajors = _.uniq(soldiers.map(item => item.isSupporter?undefined:item.majorType).filter(item => !_.isEmpty(item)));
            }
            this.trainMajors = _.intersection(orgMajors, this.trainMajors);
        }


        if (_.isEmpty(this.dailySchedule)||!theSameWeek) {
            // 获取作息时间
            let query = new Client.Query(Client.DailySchedule);
            query.equalTo('orgCategories', organization.orgCategory);
            let result = await this.backendService.queryListAll('DailySchedule', query);
            this.dailySchedule = result.list[0];
            if (_.isEmpty(this.dailySchedule)) throw '本单位的作息时间信息还未录入，无法创建下周工作安排表';
        }


        if (_.isEmpty(this.holidays)||!theSameWeek) {
        // 获取节假日
            let query = new Client.Query(Client.Holiday);
            query.greaterThanOrEqualTo('date', moment(this.nextWeekOfMonth.weekStart).startOf('year').toDate());
            query.lessThanOrEqualTo('date', moment(this.nextWeekOfMonth.weekEnd).endOf('year').toDate());
            query.addAscending('date');
            let result = await this.backendService.queryListAll('Holiday', query);
            this.holidays = result.list;
        }

        let parseParents = organization.parentIds.map(objectId => this.backendService.getParseObject('Organization', objectId));
        if (_.isEmpty(this.monthPlanItem)||!theSameWeek) {
            // 获取月计划
            let planQuery = new Client.Query(Client.MonthPlan);
            planQuery.equalTo('state', SubmitState.Submited);

            let query = new Client.Query(Client.MonthPlanItem);

            if (_.isEmpty(this.annualPlanId)) {
                query.containedIn('organization', parseParents);
                query.equalTo('orgCategory', organization.orgCategory);
                if (!_.isEmpty(organization.serviceType)) {
                    query.equalTo('serviceReq', organization.serviceType);
                }
            } else {
                query.equalTo('annualPlanId', this.annualPlanId);
            }

            query.equalTo('year', this.nextWeekOfMonth.year);
            query.equalTo('month', this.nextWeekOfMonth.month);
            query.equalTo('weekSeq', this.nextWeekOfMonth.weekSeq);
            query.matchesQuery('monthPlan', planQuery);

            query.addDescending('orgCode');
            let result = await this.backendService.queryListAll('MonthPlanItem', query);
            this.monthPlanItem = result.list[0];
            if (_.isEmpty(this.monthPlanItem) && this.nextWeekOfMonth.month!=12) throw `请先知会上级部门创建${organization.orgCategory}的${this.nextWeekOfMonth.month}月计划`;
            this.officerCourses = [];
            this.orgCourses = [];
            result.list.forEach(item => {
                this.officerCourses = [].concat(this.officerCourses, item.officerCourses);
                this.orgCourses = [].concat(this.orgCourses, item.orgCourses);
            });
            this.officerCourses = _.uniqBy(this.officerCourses, 'courseId');
            this.orgCourses = _.uniqWith(this.orgCourses, (a, b) => a.courseId===b.courseId && ((_.isEmpty(a.major)&&_.isEmpty(b.major)) || a.major===b.major));
            if (!_.isEmpty(this.trainMajors)) {
                this.orgCourses = this.orgCourses.filter(item => _.isEmpty(item.major) || this.trainMajors.includes(item.major));
            }

        }

        if (_.isEmpty(this.stagePlanItems)||!theSameWeek) {
            // 获取阶段计划
            let planQuery = new Client.Query(Client.StagePlan);
            planQuery.equalTo('state', SubmitState.Submited);

            let months = _.uniq([this.nextWeekOfMonth.weekStart.getMonth()+1, this.nextWeekOfMonth.weekEnd.getMonth()+1]);

            let query = new Client.Query(Client.StagePlanItem);

            if (_.isEmpty(this.annualPlanId)) {
                query.containedIn('organization', parseParents);
                query.equalTo('orgCategory', organization.orgCategory);
                if (!_.isEmpty(organization.serviceType)) {
                    query.equalTo('serviceReq', organization.serviceType);
                }
            } else {
                query.equalTo('annualPlanId', this.annualPlanId);
            }

            query.equalTo('year', this.nextWeekOfMonth.year);
            query.containedIn('month', months);
            query.matchesQuery('stagePlan', planQuery);

            query.addDescending('fromDate');
            let result = await this.backendService.queryListAll('StagePlanItem', query);
            this.stagePlanItems = result.list;
            if (_.isEmpty(this.stagePlanItems) && this.nextWeekOfMonth.month!=12) throw `请先知会上级部门创建${organization.orgCategory}的阶段计划`;
        }

        if (_.isEmpty(this.unitForceAnnualPlanItems)||!theSameWeek) {
            // 获取年计划
            let planQuery = new Client.Query(Client.UnitForceAnnualPlan);
            planQuery.equalTo('state', SubmitState.Submited);

            let query = new Client.Query(Client.UnitForceAnnualPlanItem);

            if (_.isEmpty(this.annualPlanId)) {
                query.containedIn('organization', parseParents);
                query.equalTo('orgCategory', organization.orgCategory);
                if (!_.isEmpty(organization.serviceType)) {
                    query.equalTo('serviceReq', organization.serviceType);
                }
                query.matchesQuery('annualPlan', planQuery);
                if (fromYear != toYear) {
                    query.containedIn('year', [fromYear, toYear]);
                } else {
                    query.equalTo('year', fromYear);
                }
            } else {
                query.equalTo('annualPlan', this.backendService.getParseObject('UnitForceAnnualPlan', this.annualPlanId));
            }

            let result = await this.backendService.queryListAll('UnitForceAnnualPlanItem', query);

            result.list.forEach(item => {
                this.fixMajorCourses(item);
            });
            this.unitForceAnnualPlanItems = result.list.filter(item => {
                return ((this.nextWeekOfMonth.weekStart>=item.fromDate&&this.nextWeekOfMonth.weekStart<=item.toDate) ||
                    (this.nextWeekOfMonth.weekEnd>=item.fromDate&&this.nextWeekOfMonth.weekEnd<=item.toDate));
            });
            this.annualPlanItemsThisYear = result.list.filter(item => item.year === thisYear);
            if (_.isEmpty(this.annualPlanId) && !_.isEmpty(this.annualPlanItemsThisYear)) {
                this.annualPlanId = (this.annualPlanItemsThisYear[0].annualPlan||{}).objectId;
            }

            // 获取警官课目列表
            let thisYearItems = result.list.filter(item => item.year === thisYear);
            this.officerCourseOptions = _.flattenDeep(_.map(thisYearItems, 'officerCourses'));
        }

        if (_.isEmpty(this.lastWeeklyPlan)||!theSameWeek) {
            // 获取本周计划
            let query = new Client.Query(Client.WeeklyPlan);
            query.equalTo('organization', parseOrg);
            query.equalTo('fromDate', this.weekOfMonth.weekStart);
            let result = await this.backendService.queryListAll('WeeklyPlan', query);
            this.lastWeeklyPlan = result.list[0];

            // 如果是班/排单位，需要先创建主单位的周工作安排表
            if (this.organization.orgSequence > OrgSequence.Company) {
                if (mainOrg) {
                    query = new Client.Query(Client.WeeklyPlan);
                    query.equalTo('organization', this.backendService.getParseObject('Organization', mainOrg.objectId));
                    query.equalTo('fromDate', this.nextWeekOfMonth.weekStart);
                    result = await this.backendService.queryListAll('WeeklyPlan', query);
                    this.mainWeeklyPlan = result.list[0];
                }

                if (_.isEmpty(this.mainWeeklyPlan)) throw `请先创建主单位的周工作安排表`;
            }
        }

        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);
        if (_.isEmpty(this.courseRules)||!theSameWeek) {
        // 获取课目规则
            let query = new Client.Query(Client.CourseRule);
            query.equalTo('orgCategories', organization.orgCategory);
            query.matchesQuery('standard', standardQuery);
            let result = await this.backendService.queryListAll('CourseRule', query);
            this.courseRules = result.list;

            query = new Client.Query(Client.CourseRule);
            query.equalTo('orgCategories', undefined);
            query.matchesQuery('standard', standardQuery);
            result = await this.backendService.queryListAll('CourseRule', query);
            this.courseRules = this.courseRules.concat(result.list);
            this.courseRules = _.sortBy(this.courseRules, ['courseCategory', 'createdAt']);
        }

        // 获取除了军事课目外的其他课目
        if (_.isEmpty(this.otherCourses)) {
            let query = new Client.Query(Client.Course);
            query.notEqualTo('category', CourseCategory.Train);
            // query.matchesQuery('standard', standardQuery);
            query.addAscending('category', 'createdAt');
            let result = await this.backendService.queryListAll('Course', query);
            this.otherCourses = result.list;

            this.CourseGroup = _.groupBy(this.otherCourses, 'category');
        }

        // 获取教练员和场地
        if (_.isEmpty(mainOrg)) mainOrg = organization;

        if (_.isEmpty(this.trainers)) {
            let query = new Client.Query(Client.Trainer);
            query.equalTo('organization', this.backendService.getParseObject('Organization', mainOrg.objectId));
            query.addAscending(['orgCode', 'positionCode']);
            let result = await this.backendService.queryListAll('Trainer', query);
            this.trainers = result.list;
        }

        if (_.isEmpty(this.places)) {
            let query = new Client.Query(Client.TrainPlace);
            query.equalTo('organization', this.backendService.getParseObject('Organization', mainOrg.objectId));
            query.equalTo('builtStatus', 0); // 已建场地
            query.addAscending(['orgCode', 'positionCode']);
            let result = await this.backendService.queryListAll('TrainPlace', query);
            this.places = result.list;
        }

        // 获取课目状态
        {
            let query = new Client.Query(Client.CourseStatus);
            if (fromYear != toYear) {
                query.containedIn('year', [fromYear, toYear]);
            } else {
                query.equalTo('year', this.nextWeekOfMonth.year);
            }
            query.equalTo('organization', parseOrg);
            query.addAscending(['category']).addDescending('startAt');
            let result = await this.backendService.queryListAll('CourseStatus', query);
            this.courseStatuses = result.list;
        }
    }
}

export default WeeklyPlanService;
