import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import {
    OrgSequence,
    IsZhiDui,
    SubmitState,
    DailySection,
    StandardState,
    CourseState,
    CourseCategory,
    PersonProperty,
    Departments,
    DayType, Operate
} from '../Constants';
import moment from 'moment';
import dateUtils from '../utils/dateUtils';
import {holiday} from '../utils/holiday';

const TheLastValue = 255;

export class OfficeMonthPlanService {
    constructor(backend) {
        this.backendService = backend;

        this.annualPlan = undefined;
        this.monthPlan = undefined;

        this.updatedCourseStatuses = [];
        this.courseStatuses = [];
        this.courseTimes = [];
        this.timeReq = undefined;

        this.courseOptions = [];
        this.groupTrainMethods = [];

        this.trainers = [];
        this.places = [];
    }

    getCourseOptions() {
        let courseOptions = [];

        this.courseTimes.forEach(courseTime => {
            courseTime.courses.forEach(course => {
                let courseStatus = this._findCourseStatus(course);

                courseOptions.push({
                    course,
                    hoursInDay: courseTime.hoursInDay,
                    hoursAtNight: courseTime.hoursAtNight,
                    actualHoursInDay: courseStatus&&courseStatus.actualHoursInDay||0,
                    actualHoursAtNight: courseStatus&&courseStatus.actualHoursAtNight||0
                });
            });
        });

        return courseOptions;
    }

    // 教练员可选项
    getTrainerOptions() {
        return this.trainers.map(item => item.soldier);
    }

    // 训练场地可选项
    getPlaceOptions() {
        return this.places;
    }

    // 组训方法可选项
    getGroupTrainMethodsOptions() {
        return this.groupTrainMethods;
    }

    _findCourseStatus(course) {
        let cs = this.updatedCourseStatuses.find(cs => cs.course.objectId === course.objectId);
        if (!cs) {
            cs = this.courseStatuses.find(cs => cs.course.objectId === course.objectId);
        }

        return cs;
    }
    async editOfficeMonthPlan(row) {
        try{
            await this._fetchDatas(row.organization,row.year);
            let $monthPlanQuery = new Client.Query(Client.OfficeDailyLesson);
            $monthPlanQuery.equalTo('monthPlan', this.backendService.getParseObject('OfficeMonthPlan',row.objectId));
            let result = (await this.backendService.queryList('OfficeMonthPlan', $monthPlanQuery)).list;
            // let dailyLessons = [];
            // result.map(item=>{
            //     dailyLessons.push({
            //         objectId: item.objectId,
            //         date: item.date,
            //         dateNum: item.date.getDate(),
            //         hours: item.lessons[0].hours,
            //         trainMethod: item.lessons[0].trainMethod,
            //         courses: item.lessons[0].courses,
            //         trainer: item.lessons[0].trainer,
            //         place: item.lessons[0].place,
            //     })
            // });
            return result;
        }catch (exception) {
            console.log(`editOfficeMonthPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    async getInitMonthPlan(date) {
        try {
            let organization = this.backendService.getCurrentOrganization();
            if (_.isEmpty(organization)) throw '当前账号无权限创建首长机关月度计划';
            if (organization.orgSequence !== OrgSequence.Division && !IsZhiDui(organization.orgSequence)) throw '当前账号无权限创建首长机关月度计划';

            let year = moment(date).year();
            let month = moment(date).month()+1;

            await this._fetchDatas(organization, year);

            let planName = `${year}年${month}月份首长机关训练计划`;

            let query = new Client.Query(Client.OfficeMonthPlan);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.equalTo('year', year);
            query.addDescending('month').limit(1);
            let result = await this.backendService.queryListAll('OfficeMonthPlan', query);

            let monthPlan = result.list[0];
            if (!_.isEmpty(monthPlan)) {
                query.equalTo('month', month);
                if((await query.count(this.backendService.options) > 0)) {
                    throw `${planName}已存在，请不要重复创建`;
                }
            }

            let departs = Departments.find(item => item.orgSeq === organization.orgSequence).departs;

            this.monthPlan = {
                name: planName,
                year,
                month,
                organization,
                orgCode: organization.orgCode,
                state: 0,
                dailyLessons: [],
                departs,

                fromDate: moment(date).startOf('month').toDate(),
                toDate: moment(date).endOf('month').toDate(),
                days: 0,
                hours: 0,
                date: this.backendService.getSystemTime(),

                scoreReqs: monthPlan&&monthPlan.scoreReqs||'',
                methods: monthPlan&&monthPlan.methods||'',
                notes: monthPlan&&monthPlan.notes||'',

                // dailyLessons: []
            };

            console.warn(this);

            return this.monthPlan;
        } catch (exception) {
            console.log(`getInitMonthPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    //status = 0(添加)  1（编辑） 2（删除）
    updateCourseStatus(newDailyLesson, oldDailyLesson, status) {
        if (status === Operate.ADD) {
            newDailyLesson.lessons.forEach(lesson => {
                lesson.courses.forEach(course => {
                    let cs = this.updatedCourseStatuses.find(cs => cs.course.objectId === course.courseId);
                    if (!cs) {
                        cs = this.courseStatuses.find(cs => cs.course.objectId === course.courseId);
                    }
                    // let cs =  this.courseStatuses.find(cs => cs.course.objectId === course.courseId);
                    let updatedObj = {};
                    if (cs) {
                        //可以优化最后的的教练，场地等，这里只是最后修改，没根据时间算，暂时也用不到
                        updatedObj = {...cs};
                        // updatedObj.objectId = cs.objectId || undefined;
                        updatedObj.course = cs.course;
                        updatedObj.endAt = newDailyLesson.date;
                        updatedObj.actualHoursInDay = cs.actualHoursInDay + lesson.hours;
                        updatedObj.lastPlace = lesson.place;
                        updatedObj.lastTrainer = lesson.trainer;
                    } else {
                        let timeReqObj = undefined;
                        for(let ele of this.courseTimes) {
                            if (ele.courses.find(item => item.objectId === course.courseId)) {
                                timeReqObj = ele;
                                break;
                            }
                        }
                        updatedObj = {
                            year: newDailyLesson.date.getFullYear(),
                            course: {objectId:course.courseId},
                            category: course.category,
                            organization: this.backendService.getCurrentOrganization(),
                            state: 1,
                            startAt: newDailyLesson.date,
                            endAt: newDailyLesson.date,
                            hoursInDay: timeReqObj.hoursInDay,
                            hoursAtNight: timeReqObj.hoursAtNight,
                            actualHoursInDay: lesson.hours,
                            actualHoursAtNight: 0,
                            trainMethod: lesson.trainMethod,
                            //places:[]
                            lastPlace: lesson.place,
                            lastTrainer: lesson.trainer,
                        }
                    }
                    let index = this.updatedCourseStatuses.findIndex(ele => ele.course.objectId === updatedObj.course.objectId);
                    if (index >= 0) {
                        this.updatedCourseStatuses[index] = updatedObj;
                    } else {
                        this.updatedCourseStatuses.push(updatedObj);
                    }
                })
            });
            /*************编辑***************************************************************************/
        } else if (status === Operate.EDIT) {
            let oldCourses = oldDailyLesson.lessons[0].courses;
            newDailyLesson.lessons.forEach(lesson => {
                lesson.courses.forEach(course => {
                    let oldSameCourse = oldCourses.find(oldCourse => oldCourse.courseId === course.courseId);
                    let cs = this.updatedCourseStatuses.find(cs => cs.course.objectId === course.courseId);
                    if (!cs) {
                        cs = this.courseStatuses.find(cs => cs.course.objectId === course.courseId);
                    }
                    let updatedObj = {...cs};
                    //修改
                    if (cs && oldSameCourse) {
                        updatedObj.actualHoursInDay = cs.actualHoursInDay + (lesson.hours - oldDailyLesson.lessons[0].hours);
                        // updatedObj.course = cs.course;
                        updatedObj.endAt = newDailyLesson.date;
                        updatedObj.lastPlace = lesson.place;
                        updatedObj.lastTrainer = lesson.trainer;
                    } else { //新增
                        let timeReqObj = undefined;
                        for(let ele of this.courseTimes) {
                            if (ele.courses.find(item => item.objectId === course.courseId)) {
                                timeReqObj = ele;
                                break;
                            }
                        }
                        updatedObj = {
                            year: newDailyLesson.date.getFullYear(),
                            course: {objectId:course.courseId},
                            category: course.category,
                            organization: this.backendService.getCurrentOrganization(),
                            state: 1,
                            startAt: newDailyLesson.date,
                            endAt: newDailyLesson.date,
                            hoursInDay: timeReqObj.hoursInDay,
                            hoursAtNight: timeReqObj.hoursAtNight,
                            actualHoursInDay: lesson.hours,
                            actualHoursAtNight: 0,
                            trainMethod: lesson.trainMethod,
                            //places:[]
                            lastPlace: lesson.place,
                            lastTrainer: lesson.trainer,
                        }
                    }
                    let index = this.updatedCourseStatuses.findIndex(ele => ele.course.objectId === updatedObj.course.objectId);
                    if (index >= 0) {
                        this.updatedCourseStatuses[index] = updatedObj;
                    } else {
                        this.updatedCourseStatuses.push(updatedObj);
                    }
                });
                //编辑的时候删除
                let deletedCoursesAtEdit = oldCourses.filter(oldCourse => {
                    return  !lesson.courses.find(course => course.courseId === oldCourse.courseId) ;
                });
                if (!_.isEmpty(deletedCoursesAtEdit)) {
                    deletedCoursesAtEdit.forEach(deletedCourse => {
                        let cs = this.updatedCourseStatuses.find(cs => cs.course.objectId === deletedCourse.courseId);
                        if (!cs) {
                            cs = this.courseStatuses.find(cs => cs.course.objectId === deletedCourse.courseId);
                        }
                        let updatedObj = {...cs};
                        updatedObj.actualHoursInDay = (cs.actualHoursInDay - oldDailyLesson.lessons[0].hours);
                        // updatedObj.course = cs.course;
                        // updatedObj.endAt = newDailyLesson.date;
                        // updatedObj.lastPlace = lesson.place;
                        // updatedObj.lastTrainer = lesson.trainer;  因为是删除无法记录上次
                        let index = this.updatedCourseStatuses.findIndex(ele => ele.course.objectId === updatedObj.course.objectId);
                        if (index >= 0) {
                            this.updatedCourseStatuses[index] = updatedObj;
                        } else {
                            this.updatedCourseStatuses.push(updatedObj);
                        }
                    });
                }
            });
            /*************删除**********************************************************************/
        } else if (status === Operate.DELETE) {
            let oldCourses = oldDailyLesson.lessons[0].courses;
            oldCourses.forEach(deletedCourse => {
                let cs = this.updatedCourseStatuses.find(cs => cs.course.objectId === deletedCourse.courseId);
                if (!cs) {
                    cs = this.courseStatuses.find(cs => cs.course.objectId === deletedCourse.courseId);
                }
                let updatedObj = {...cs};
                updatedObj.actualHoursInDay = (cs.actualHoursInDay - oldDailyLesson.lessons[0].hours);
                // updatedObj.course = cs.course;
                // updatedObj.endAt = newDailyLesson.date;
                // updatedObj.lastPlace = lesson.place;
                // updatedObj.lastTrainer = lesson.trainer;  因为是删除无法记录上次
                let index = this.updatedCourseStatuses.findIndex(ele => ele.course.objectId === updatedObj.course.objectId);
                if (index >= 0) {
                    this.updatedCourseStatuses[index] = updatedObj;
                } else {
                    this.updatedCourseStatuses.push(updatedObj);
                }
            });
        } else {

        }
    }


   async addSaveOfficeMonthPlan(monthPlan, dailyLessons) {
        try {
            if(monthPlan) {
                let result = await this.backendService.addOrUpdateItem('OfficeMonthPlan', monthPlan);
                for(let dailyLesson of dailyLessons) {
                    console.log(1234);
                    dailyLesson.monthPlan = result.objectId;
                }

                let lessonsResult = await this.backendService.addOrUpdateList('OfficeDailyLesson', dailyLessons);
                await this.backendService.addOrUpdateList('CourseStatus', this.updatedCourseStatuses);
                return {
                    monthPlan: result,
                    dailyLessons: lessonsResult
                }
            }
        } catch (exception) {
            console.log(`addOrUpdateOfficeMonthPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
   }
    async editSaveOfficeMonthPlan(monthPlan, dailyLessons, org, oldMonthPlan) {
        try {
            console.log(dailyLessons);
            let monthPlanQuery = new Client.Query(Client.OfficeDailyLesson);
            monthPlanQuery.equalTo('monthPlan', this.backendService.getParseObject('OfficeMonthPlan', oldMonthPlan.objectId));
            let oldDailyLessons = (await this.backendService.queryList('OfficeMonthPlan', monthPlanQuery)).list;

            await this.backendService.deleteList('OfficeDailyLesson', oldDailyLessons);
            // let oldIdArray = oldDailyLessons.map(ele => ele.objectId);

            for(let dailyLensson of dailyLessons) {
                delete dailyLensson.objectId;
                if(!dailyLensson.monthPlan) {
                    dailyLensson.monthPlan = oldMonthPlan.objectId;
                }
            }

            // let oldMonthPlan = await this.backendService.fetchItem('OfficeMonthPlan', row.objectId);
            let result = await this.backendService.addOrUpdateItem('OfficeMonthPlan', monthPlan);
            let lessonsResult = await this.backendService.addOrUpdateList('OfficeDailyLesson', dailyLessons);

            await this.backendService.addOrUpdateList('CourseStatus', this.updatedCourseStatuses);

            return {
                monthPlan: result,
                dailyLessons: lessonsResult
            }


        } catch (exception) {
            console.log(`editSaveOfficeMonthPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteMonthPlan(monthPlan) {
        try {
            await this._fetchDatas(monthPlan.organization, monthPlan.year);
            let query = new Client.Query(Client.OfficeDailyLesson);
            query.equalTo('monthPlan', this.backendService.getParseObject('OfficeMonthPlan', monthPlan.objectId || monthPlan));
            let oldDailyLessons = (await this.backendService.queryList('OfficeMonthPlan', query)).list;

            oldDailyLessons.forEach(oldDailyLesson => {
                let oldCourses = oldDailyLesson.lessons[0].courses;
                oldCourses.forEach(deletedCourse => {
                    let cs = this.updatedCourseStatuses.find(cs => cs.course.objectId === deletedCourse.courseId);
                    if (!cs) {
                        cs = this.courseStatuses.find(cs => cs.course.objectId === deletedCourse.courseId);
                    }
                    let updatedObj = {...cs};
                    updatedObj.actualHoursInDay = (cs.actualHoursInDay - oldDailyLesson.lessons[0].hours);
                    // updatedObj.course = cs.course;
                    // updatedObj.endAt = newDailyLesson.date;
                    // updatedObj.lastPlace = lesson.place;
                    // updatedObj.lastTrainer = lesson.trainer;  因为是删除无法记录上次
                    let index = this.updatedCourseStatuses.findIndex(ele => ele.course.objectId === updatedObj.course.objectId);
                    if (index >= 0) {
                        this.updatedCourseStatuses[index] = updatedObj;
                    } else {
                        this.updatedCourseStatuses.push(updatedObj);
                    }
                });

            });

            await this.backendService.addOrUpdateList('CourseStatus', this.updatedCourseStatuses);

            await this.backendService.deleteList('OfficeDailyLesson', oldDailyLessons);
            await this.backendService.deleteItem('OfficeMonthPlan', monthPlan);
        } catch (exception) {
            console.log(`deleteMonthPlan failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getMonthPlanDetails(objectId) {
        try {
            let organization = this.backendService.getCurrentOrganization();

            this.monthPlan = await this.backendService.fetchItem('OfficeMonthPlan', objectId);
            if (_.isEmpty(this.monthPlan)) throw '没有找到对应的首长机关月计划表';

            let query = new Client.Query(Client.OfficeDailyLesson);
            query.equalTo('monthPlan', this.backendService.getParseObject('OfficeMonthPlan', objectId));
            query.addAscending('date');
            let result = await this.backendService.queryListAll('OfficeDailyLesson', query);
            this.monthPlan.dailyLessons = result.list;

            // 针对未提交的本单位的机关月计划表，支持修改操作
            if (this.monthPlan.state !== SubmitState.Submited && organization && this.monthPlan.organization &&
                organization.objectId === this.monthPlan.organization.objectId) {
                await this._fetchDatas(organization, this.monthPlan.year);
            }

            return this.monthPlan;
        } catch (exception) {
            console.log(`getMonthPlanDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async _fetchDatas(organization, year) {
        let orgCategory = `${organization.orgCategory}首长机关`;
        let parseOrg = this.backendService.getParseObject('Organization', organization.objectId);

        // 获取本单位首长机关年度计划
        // let query = new Client.Query(Client.OfficeAnnualPlan);
        // query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
        // query.equalTo('year', year);
        // let result = await this.backendService.queryListAll('OfficeAnnualPlan', query);
        // this.annualPlan = result.list[0];
        // if (_.isEmpty(this.annualPlan)) throw '请先创建本单位首长机关的年度计划';

        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);
        let query,result;
        // 获取训练时间要求
        if (_.isEmpty(this.timeReq)) {
            query = new Client.Query(Client.TimeRequirement);
            query.matchesQuery('standard', standardQuery);
            query.equalTo('orgCategory', orgCategory);
            query.equalTo('personProperty', PersonProperty.Officer);
            result = await this.backendService.queryListAll('TimeRequirement', query);
            this.timeReq = result.list[0];
        }

        // 获取课目状态
        this.updatedCourseStatuses = [];
        query = new Client.Query(Client.CourseStatus);
        query.equalTo('year', year);
        query.equalTo('organization', parseOrg);
        query.addAscending(['category']).addDescending('startAt');
        result = await this.backendService.queryListAll('CourseStatus', query);
        this.courseStatuses = result.list;

        // 获取课目时间要求
        if (_.isEmpty(this.courseTimes)) {
            query = new Client.Query(Client.CourseTime);
            query.matchesQuery('standard', standardQuery);
            query.equalTo('orgCategories', orgCategory);
            query.equalTo('personProperties', PersonProperty.Officer);
            query.ascending('createdAt');
            result = await this.backendService.queryListAll('CourseTime', query);
            this.courseTimes = result.list;
        }

        if (_.isEmpty(this.trainers)) {
            let query = new Client.Query(Client.Trainer);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.addAscending(['orgCode', 'positionCode']);
            let result = await this.backendService.queryListAll('Trainer', query);
            this.trainers = result.list;
        }

        if (_.isEmpty(this.places)) {
            let query = new Client.Query(Client.TrainPlace);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.equalTo('builtStatus', 0); // 已建场地
            query.addAscending(['orgCode', 'positionCode']);
            let result = await this.backendService.queryListAll('TrainPlace', query);
            this.places = result.list;
        }

        if (_.isEmpty(this.groupTrainMethods)) {
            let query = new Client.Query(Client.GroupTrainMethod);
            let result = await this.backendService.queryListAll('GroupTrainMethod', query);
            this.groupTrainMethods = result.list;
        }
    }

    _dateSolved(date) {
        let info = {
            weekSeq:0,
            weekday:0,
            dayType:''
        };
        info.weekSeq = dateUtils.weekOfMonth(date).weekSeq;
        let weekday = dateUtils.weekday(date);
        info.weekday = weekday.dayOfWeek;
        if(weekday.isWeekend) {
            info.dayType = DayType.Weekend;
        } else {
            info.dayType = DayType.Workday;
        }

        console.log(info);
        return info;
    }
}

export default OfficeMonthPlanService;
