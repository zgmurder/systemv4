//成绩分析页面用
import parseUtils from "../utils/parseUtils";
import Client from '../Client';
import moment from 'moment';
import { StandardState, CourseCategory, ScoreCriteria } from '../Constants';
import _ from 'lodash';

export class ScoreAnalysis {
    constructor(backend) {
        this.backendService = backend;
    }
    async getCommonCourses() {
        try {
            let query = new Client.Query(Client.SportAssessReq);
            let subQuery = new Client.Query(Client.TrainStandard);
            subQuery.equalTo('state', StandardState.Using);
            query.matchesQuery('standard', subQuery);
            query.notEqualTo('physicalLevels', '新兵');
            let result = await this.backendService.queryListAll('SportAssessReq', query);
            return _.uniqBy(result.list, "course.objectId").map(ele => ele.course);
        } catch (exception) {
            console.log(`getCommonCourses failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    async getSpecialCourses() {
        try {
            let query = new Client.Query(Client.SportCourseGroup);
            let subQuery = new Client.Query(Client.TrainStandard);
            subQuery.equalTo('state', StandardState.Using);
            query.matchesQuery('standard',subQuery);
            let result = await this.backendService.queryListAll('SportCourseGroup', query);
            result =  _.groupBy(result.list, 'groupId');
            let special = {};
            for (let key in result) {
                let idArr = [];
                for (let ele of result[key]) {
                    idArr = idArr.concat(ele.courses.map(item => item.objectId));
                }
                special[key] = _.uniqBy( await this.backendService.fetchAll('Course', idArr), 'objectId');
                special[key] = special[key].filter( ele => ele.scoreCriteria !== ScoreCriteria.Level2 && ele.scoreCriteria !== ScoreCriteria.Level4)
            }
            return special;
        } catch (exception) {
            console.log(`getSpecialCourses failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getScores(org, year, course, personArr, courseType) {

    }
}

export default ScoreAnalysis;
