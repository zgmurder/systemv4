import { BackendService } from './parse-backend/lib/BackendService';
import Client from "./parse-backend/lib/Client";
import JsonClient from "./JsonClient";
import {OrgSequenceMap} from './parse-backend/lib/Constants';

export class Migrator {
    constructor(baseUrl, config) {
        this.jsonClient = new JsonClient(baseUrl);
        this.config = config;
        this.backendService = new BackendService({appId: ''});
    }

    async start() {
        await this.backendService.initialize();

        await this.backendService.login({username: this.config.usernameV1, password: this.config.passwordV1});

        const token = await this.jsonClient.login(this.config.usernameV2, this.config.passwordV2);
        if (!token) {
            throw "Login to armysystemv2 failed.";
        }

        console.log('login armysystemv2 return: ', token)

        await this.migrateDictionary();
        await this.migrateCourse();
        await this.migrateStandard();
    }

    async migrateDictionary() {
        const models = ['GroupTrainMethod', 'GunnerType', 'MotorType', 'OrdnanceType', 'OrgProperty', 'OrgCategory',
            'PlaceType', 'SpecialMission', 'SportCategory', 'SupporterMajor', 'TrainerLevel', 'TrainStep', 'WeatherType'];

        for (let model of models) {
            let query = new Client.Query(Client[model]);
            query.addAscending(['createdAt']);
            let result = await this.backendService.queryListAll(model, query);
            let newList = result.list.map((item, index) => {
                item.id = item.objectId;
                item.order = index+1;
                return item;
            });
            console.log(`get list for ${model} with ${newList.length} items`);

            for (let item of newList) {
                await this.jsonClient.addOne(`/dictionary/${model.toLocaleLowerCase()}`, item);
            }
        }

        let list = [];
        let query = new Client.Query(Client['Position']);
        query.addAscending(['sortCode']);
        let result = await this.backendService.queryListAll('Position', query);
        list = list.concat(result.list);

        query = new Client.Query(Client['Position2']);
        query.addAscending(['sortCode']);
        result = await this.backendService.queryListAll('Position2', query);
        list = list.concat(result.list);

        let newList = list.map((item) => {
            item.id = item.objectId;
            item.order = item.sortCode;
            return item;
        });
        // console.log(`get list for Position`, newList);

        for (let item of newList) {
            await this.jsonClient.addOne(`/dictionary/position`, item);
        }

        query = new Client.Query(Client['MilitaryRank']);
        query.addAscending(['sortCode']);
        result = await this.backendService.queryListAll('MilitaryRank', query);
        newList = result.list.map((item) => {
            item.id = item.objectId;
            item.order = item.levelCode;
            return item;
        });
        // console.log(`get list for MilitaryRank`, newList);

        for (let item of newList) {
            await this.jsonClient.addOne(`/dictionary/militaryrank`, item);
        }
    }

    async migrateCourse() {
        for (let category = 0; category < 6; category++) {
            let query = new Client.Query(Client['Course']);
            query.addAscending(['createdAt']);
            query.equalTo('category', category);
            let result = await this.backendService.queryListAll('Course', query);
            let newList = result.list.map((item) => {
                item.id = item.objectId;
                if (item.standard && item.standard.objectId) {
                    item.standardId = item.standard.objectId;
                }
                if (item.section && item.section.objectId) {
                    item.sectionId = item.section.objectId;
                }

                item.courseCategory = category;
                item.manual = item.isManual;
                item.trainStepName = item.trainStep;
                item.serviceReqs = item.serviceReq;
                item.majorReqs = [];
                if (item.majorReq) item.majorReqs.push(item.majorReq);
                item.rankReqs = item.rankL2Reqs;
                item.ascending = item.isAscending;
                if (item.testContents)
                    item.testContents = item.testContents.map(c => ({
                        name: c.content,
                        testReq: c.testReq
                    }));
                if (item.trainUnits) {
                    item.trainUnits = item.trainUnits.map(c => OrgSequenceMap[c])
                        .reduce((prev, curr) => {
                            return prev.concat(curr);
                        }, []);
                }
                return item;
            });
            // console.log(`get list for Course`, newList);
            console.log(`get list for Course with category ${category} has ${newList.length} items`);

            for (let item of newList) {
                await this.jsonClient.addOne(`/standard/course`, item);
            }
        }
    }

    

    async migrateStandard() {
        const fromModels = ['TrainStandard', 'TrainSection', 'TrainStageTime', 'CourseDistribution', 'CourseTime',
            'SportTime', 'SportAssessReq', 'SportCourseGroup', 'BulletRequirement', 'MotorRequirement',
            'OrgScoreRequirement', 'PersonScoreRequirement', 'PersonRequirement', 'PlaceRequirement', 'TimeRequirement'];

        const toModels = ['TrainStandard', 'TrainSection', 'TrainStageTime', 'CourseDistribution', 'CourseTime',
            'SportTime', 'RequiredSportCourse', 'OptionalSportCourse', 'BulletRequirement', 'MotorRequirement',
            'OrgScoreRequirement', 'PersonScoreRequirement', 'PersonRequirement', 'PlaceRequirement', 'TimeRequirement'];
      
        let index = 0;
        for (let model of fromModels) {
            let query = new Client.Query(Client[model]);
            query.addAscending(['createdAt']);
            let result = await this.backendService.queryListAll(model, query);
            let newList = result.list.map((item) => {
                item.id = item.objectId;
                if (item.standard && item.standard.objectId) {
                    item.standardId = item.standard.objectId;
                }
                if (item.section && item.section.objectId) {
                    item.sectionId = item.section.objectId;
                }
                if (item.course && item.course.objectId) {
                    item.courseId = item.course.objectId;
                }
                if (item.courses) {
                    item.courseIds = item.courses.map(c => c.objectId);
                }

                switch (model) {
                    case 'TrainStandard':
                        item.version = "2018";
                        break;
                    case 'TrainStageTime':
                        item.majors = item.majorReq;
                        if (item.stageTime)
                            item.stageTimes = item.stageTime.map(stage => ({task: stage.task, months: stage.time-0}));
                        break;
                    // case 'Course':
                    //     console.log(`${item.name} -> ${item.category} ${item.seq}`)
                    //     item.category = item.category-0;
                    //     item.manual = item.isManual;
                    //     item.trainStepName = item.trainStep;
                    //     item.serviceReqs = item.serviceReq;
                    //     item.majorReqs = [];
                    //     if (item.majorReq) item.majorReqs.push(item.majorReq);
                    //     item.rankReqs = item.rankL2Reqs;
                    //     item.ascending = item.isAscending;
                    //     if (item.testContents)
                    //     item.testContents = item.testContents.map(c => ({name: c.content, testReq: c.testReq}))
                    //     break;
                    case 'CourseTime':
                        item.serviceReqs = item.serviceReq;
                        break;
                    case 'RequiredSportCourse':
                        item.civilServant = item.isCivilServant;
                        break;
                    case 'BulletRequirement':
                        if (item.bulletReq) {
                            item.quota = item.bulletReq.quota;
                            item.unitType = item.bulletReq.unitType;
                            item.numType = item.bulletReq.numType;
                        }
                        break;
                    case 'MotorRequirement':
                        item.quota = item.quota-0;
                        break;
                    case 'PersonScoreRequirement':
                        if (item.yearRange) {
                            item.startYear = item.yearRange.start;
                            item.endYear = item.yearRange.end;
                        }
                        break;
                    case 'TimeRequirement':
                        if (item.timeReq) {
                            item.months = item.timeReq.months;
                            item.days = item.timeReq.days;
                            item.hours = item.timeReq.hours;
                            item.daysPerMonth = item.timeReq.daysPerMonth;
                            item.daysPerWeek = item.timeReq.daysPerWeek;
                            item.hoursPerDay = item.timeReq.hoursPerDay;
                            item.hoursAtNight = item.timeReq.hoursAtNight;
                            item.rateAtNight = item.timeReq.rateAtNight;
                            item.flexibleDays = item.timeReq.flexibleDays;
                        }
                        break;
                }

                return item;
            });
            console.log(`get list for ${model} with ${newList.length} items`);

            for (let item of newList) {
                await this.jsonClient.addOne(`/standard/${toModels[index].toLocaleLowerCase()}`, item);
            }
            index++;
        }
    }
}

export default Migrator;