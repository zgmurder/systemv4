import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import { OrgSequence, OrgSequenceName, IsZhiDui, StandardState, SubmitState, InServiceStatus, AssessMethod, ScoreCriteria, ScoreLevel } from '../Constants';
import moment from 'moment';

export class ScoreService {
    constructor(backend) {
        this.backendService = backend;

        this.multipleTargetScoreRules = [];
        this.leaderOfficeAnnualScoreRules = [];
        this.unitForceAnnualScoreRules = [];
        this.troopAnnualScoreRules = [];
    }

    // 获取分队年度成绩表中的可选战术课目列表
    async getTacticsCourses(organization) {
        try {
            if (_.isEmpty(organization)) return [];

            let orgId = organization.objectId||organization;
            organization = await this.backendService.fetchItem('Organization', orgId);
            // 支队以上不需要获取战术课目
            if (organization.orgSequence < OrgSequence.Battalion) return [];
            const seqName = OrgSequenceName(organization.orgSequence);
            if (_.isEmpty(seqName)) return [];

            let query = new Client.Query(Client.TrainCourse);
            query.equalTo('orgCategories', organization.orgCategory);
            query.equalTo('trainUnits', seqName);
            query.ascending('seq');
            let result = await this.backendService.queryListAll('TrainCourse', query);
            let courses = result.list;


            query = new Client.Query(Client.UnitForceAnnualScore);
            query.equalTo('organization', this.backendService.getParseObject('Organization', orgId));
            query.equalTo('year', this.backendService.getSystemTime().getFullYear());
            result = await this.backendService.queryListAll('UnitForceAnnualScore', query);
            let existedCourses = [];
            if (!_.isEmpty(result.list)) existedCourses = result.list[0].courseScores||[];

            return _.differenceWith(courses, existedCourses, (a, b) => a.name === b.name);
        } catch (exception) {
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async evaluateTacticsScore(courseScores) {
        try {
            // 获取多对象综合成绩计算规则并缓存
            if (_.isEmpty(this.multipleTargetScoreRules)) {
                this.multipleTargetScoreRules = await this._fetchRule('MultipleTargetScoreRule');
            }

            let stats = this._statScoreCount(courseScores);
            let score = this._evaluateScore(this.multipleTargetScoreRules, stats);

            return score;
        } catch (exception) {
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async evaluateLeaderOfficeScore(annualScore) {
        try {
            // 获取首长机关年度成绩计算规则并缓存
            if (_.isEmpty(this.leaderOfficeAnnualScoreRules)) {
                this.leaderOfficeAnnualScoreRules = await this._fetchRule('LeaderOfficeAnnualScoreRule');
            }
            let score = 0;
            if (annualScore.childrenScore>0&&annualScore.tacticsScore>0&&annualScore.exerciseScore>0) {
                const scores = [{score: annualScore.childrenScore},
                            {score:annualScore.tacticsScore},
                            {score:annualScore.exerciseScore}];
                let stats = this._statScoreCount(scores);
                score = this._evaluateLeaderOfficeScore(
                    this.leaderOfficeAnnualScoreRules, stats, annualScore.exerciseScore);
            }
            if (annualScore.cantBeExcellent && score>=ScoreLevel.Excellent) {
                score=ScoreLevel.Good;
            }
            annualScore.annualScore = score;

            return score;
        } catch (exception) {
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async evaluateUnitForceScore(annualScore) {
        try {
            // 获取分队年度成绩计算规则并缓存
            if (_.isEmpty(this.unitForceAnnualScoreRules)) {
                this.unitForceAnnualScoreRules = await this._fetchRule('UnitForceAnnualScoreRule');
            }

            let score = 0;
            if (annualScore.commanderScore>0&&annualScore.childrenScore>0) {
                const scores = [{score: annualScore.commanderScore},
                    {score: annualScore.childrenScore},
                    {score: annualScore.tacticsScore}];
                const stats = this._statScoreCount(scores);
                score = this._evaluateUnitForceScore(
                    this.unitForceAnnualScoreRules, stats, annualScore.tacticsScore);
            }
            annualScore.annualScore = score;


            return score;
        } catch (exception) {
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    //==================================================================
    //函数名:   evaluateTroopAnnualScore
    //功能：    用于计算部队年度成绩
    //输入参数： annualScore (对象）   用于计算部队年度成绩的完整对象，required
    //返回值：  类型（number)
    //         返回值为1~4，分别代表不及格、不及格、良好、优秀
    //==================================================================
    async evaluateTroopAnnualScore(annualScore) {
        try{
            // 获取总队年度成绩计算规则并缓存
            if (_.isEmpty(this.troopAnnualScoreRules)) {
                this.troopAnnualScoreRules = await this._fetchRule('TroopAnnualScoreRule');
            }
            let score = 0;

            const scores = [{score: annualScore.officeAnnualScore},
                {score: annualScore.childrenScore},
                {score: annualScore.tacticsScore}];
            const stats = this._statScoreCount(scores);
            score = this._evaluateUnitForceScore(   //跟分队计算规则一样，故而套用分队方法
                this.troopAnnualScoreRules, stats, annualScore.tacticsScore);

            annualScore.annualScore = score;


            return score;
        }catch(exception) {
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取某个单位本级本年的年度成绩表
    async getOrgAnnualScore(className, organization, year) {
        try {
            let orgId = organization.objectId||organization;
            let query = new Client.Query(Client[className]);
            query.equalTo('organization', this.backendService.getParseObject('Organization', orgId));
            query.equalTo('year', year);
            let result = await this.backendService.queryListAll(className, query);

            return result.list[0];
        } catch (exception) {
            console.log(`getOrgAnnualScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addOrUpdateUnitForceAnnualScore(annualScore) {
        try {
            annualScore.courseScores = _.uniqWith(annualScore.courseScores, (a, b) => a.courseId === b.courseId);
            let result = await this.backendService.addOrUpdateItem('UnitForceAnnualScore', annualScore);

            // 保存课目的单位成绩
            let orgScores = await this._addOrUpdateOrgScores(annualScore.organization, annualScore.courseScores, annualScore.date);

            // 自动批量更新上级分队的年度成绩表
            let orgIds = annualScore.organization.parentIds;
            (!_.isEmpty(orgIds)) && (orgIds = orgIds.slice(0, -1));
            this.updateLocalOrgAnnualScores(orgIds, annualScore.organization.orgType)
                .then(done => {})
                .catch(_ => {});

            return result;
        } catch (exception) {
            console.log(`addOrUpdateUnitForceAnnualScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addOrUpdateOfficeAnnualScore(annualScore) {
        try {
            let result = await this.backendService.addOrUpdateItem('OfficeAnnualScore', annualScore);

            // 保存课目的单位成绩
            if (annualScore.tacticsScore>0) {
                let orgScore = await this._addOrUpdateOrgScore(annualScore.organization, '战术作业', annualScore.tacticsScore, annualScore.date);
            }
            if (annualScore.exerciseScore>0) {
                let orgScore = await this._addOrUpdateOrgScore(annualScore.organization, '指挥所演习', annualScore.exerciseScore, annualScore.date);
            }

            return result;
        } catch (exception) {
            console.log(`addOrUpdateOfficeAnnualScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    //==================================================================
    //函数名:   addOrUpdateTroopAnnualScore
    //功能：    点击生成或者重新生成部队年度成绩表
    //输入参数： organization (object)   当前单位对象，required
    //         year (number)           当前年份，required
    //返回值：  类型（object)
    //         返回值为添加到数据库中该部队年度成绩完整对象
    //==================================================================
    async addOrUpdateTroopAnnualScore(organization,year){
        try{
            let troopAnnualScore = {};

            // 单位信息处理
            let org = organization;
            if (_.isString(org)) {
                org = await this.backendService.fetchItem('Organization', org);
            }
            let oldTroopAnnualScore = await this.getOrgAnnualScore('TroopAnnualScore',org,year);

            if(oldTroopAnnualScore){
                troopAnnualScore.objectId = oldTroopAnnualScore.objectId;
            }
            troopAnnualScore.organization = org;
            troopAnnualScore.orgCode = organization.orgCode;
            troopAnnualScore.orgSequence = organization.orgSequence;
            troopAnnualScore.state = 0;

            // 日期信息处理
            troopAnnualScore.year = year;
            let today = this.backendService.getSystemTime();
            today = this.backendService.reportCommonApi.setDateToZero(today);
            troopAnnualScore.date = today;

            //本机机关年度成绩
            let query = new Client.Query(Client.OfficeAnnualScore);
            query.equalTo('year', year);
            query.equalTo('organization', this.backendService.getParseObject('Organization', org.objectId));
            query.greaterThan('annualScore', 0);
            let result = await this.backendService.queryListAll('OfficeAnnualScore', query);
            if(result.total === 0)
            {
                throw "请先登记本级机关军事年度训练成绩!";
            }
            troopAnnualScore.officeAnnualScore = result.list[0].annualScore;

            //下级单位年度训练成绩
            troopAnnualScore.childOrgScores = [];
            let schemaName = '';
            if( IsZhiDui(org.orgSequence) ){
                 schemaName = 'UnitForceAnnualScore';
            }else if(OrgSequence.Division === org.orgSequence){
                 schemaName = 'TroopAnnualScore';
            }
            for(let ele of org.childrenIds) {
                let childOrg = await this.backendService.fetchItem('Organization', ele);
                if (childOrg.orgSequence !== org.orgSequence) {
                    let query = new Client.Query(schemaName);
                    query.equalTo('year', year);
                    query.equalTo('organization', this.backendService.getParseObject('Organization', childOrg.objectId));
                    query.equalTo('state', 1);
                    let childOrgResult = await this.backendService.queryListAll('OfficeAnnualScore', query);
                    if (0 === childOrgResult.total) {
                        throw `${childOrg.name}该年成绩未提交！`
                    }
                    troopAnnualScore.childOrgScores.push({
                        name: childOrg.name,
                        orgCode: childOrg.orgCode,
                        score: childOrgResult.list[0].annualScore
                    })
                }
            }
            troopAnnualScore.childrenScore = await this.evaluateTacticsScore(troopAnnualScore.childOrgScores);

            troopAnnualScore.tacticsScore = 0;//表示无成绩
            troopAnnualScore.notes = [];
            troopAnnualScore.annualScore =  await this.evaluateTroopAnnualScore(troopAnnualScore);
            let troopScore = await this.backendService.addOrUpdateItem('TroopAnnualScore', troopAnnualScore);
            return troopScore;
        } catch(exception){
            console.log(`addOrUpdateTroopAnnualScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
    async getNoSubmitOrgs(org){
        // for(let ele of org.childrenIds) {
        //     let childOrg = await this.backendService.fetchItem('Organization', ele);
        //     if (childOrg.orgSequence !== org.orgSequence) {
        //         let query = new Client.Query(schemaName);
        //         query.equalTo('year', year);
        //         query.equalTo('organization', this.backendService.getParseObject('Organization', childOrg.objectId));
        //         query.equalTo('state', 1);
        //         let childOrgResult = await this.backendService.queryListAll('OfficeAnnualScore', query);
        //         if (0 === childOrgResult.total) {
        //             throw `${childOrg.name}该年成绩未提交！`
        //         }
        //         troopAnnualScore.childOrgScores.push({
        //             name: childOrg.name,
        //             orgCode: childOrg.orgCode,
        //             score: childOrgResult.list[0].annualScore
        //         })
        //     }
        // }
        // const childrenIds = org.childrenIds.slice(1);
        // childrenIds.forEach(async orgId =>{
        //
        // })
    }
    //==================================================================
    //函数名:   saveOrSubmitTroopAnnualScore
    //功能：    保存或者提交部队年度成绩表
    //输入参数： annualScore (对象）   用于保存或者提交的部队年度成绩的完整对象，required
    //返回值：  类型（object)
    //         返回值为添加到数据库中该部队年度成绩完整对象
    //==================================================================
    async saveOrSubmitTroopAnnualScore(annualScore){
        try{
            if(!annualScore){
                throw '部队年度成绩表参数错误！';
            }else{
                // 统一日期样式
                annualScore.date = this.backendService.reportCommonApi.setDateToZero(annualScore.date);
                let oldTroopAnnualScore = await this.getOrgAnnualScore('TroopAnnualScore',annualScore.organization,annualScore.year);
                if(oldTroopAnnualScore){
                    annualScore.objectId = oldTroopAnnualScore.objectId;
                }

                // 判断是否重复提交
                if (oldTroopAnnualScore.state) {
                    if (annualScore.state) {
                        throw '请不要重复提交！';
                    } else {
                        throw '已提交的数据不能修改！';
                    }
                }
                let result = await this.backendService.addOrUpdateItem("TroopAnnualScore",annualScore);
                return result;
            }
        }catch(exception){
            console.log(`saveOrSubmitTroopAnnualScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) return this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async _fetchRule(className) {
        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);
        let query = new Client.Query(Client[className]);
        query.matchesQuery('standard', standardQuery);
        query.descending('score');
        let result = await this.backendService.queryListAll(className, query);

        return result.list;
    }

    async _addOrUpdateOrgScores(organization, courseScores, date) {
        let orgId = organization.objectId;
        let query = new Client.Query(Client.OrgScore);
        query.equalTo('organization', this.backendService.getParseObject('Organization', orgId));
        query.greaterThan('date', moment(date).startOf('year').toDate());
        let parseCourses = courseScores.map(item => this.backendService.getParseObject('Course', item.courseId));
        query.containedIn('course', parseCourses);

        let result = await this.backendService.queryListAll('OrgScore', query);
        let orgScores = courseScores.map(courseScore => {
            let orgScore = result.list.find(item => item.course.objectId === courseScore.courseId);
            if (orgScore) {
                if (orgScore.score === courseScore.score) orgScore = null;
                else orgScore.score = courseScore.score;
            } else {
                orgScore = {
                    date: date,
                    course: courseScore.courseId,
                    courseName: courseScore.name,
                    organization: organization,
                    orgCode: organization.orgCode,
                    assessMethod: AssessMethod.Normal,
                    score: courseScore.score
                };
            }
            return orgScore;
        });
        orgScores = orgScores.filter(item => item);

        let results = this.backendService.addOrUpdateList('OrgScore', orgScores);

        return results;
    }

    async _addOrUpdateOrgScore(organization, courseName, score, date) {
        let orgId = organization.objectId;
        let query = new Client.Query(Client.OrgScore);
        query.equalTo('organization', this.backendService.getParseObject('Organization', orgId));
        query.greaterThan('date', moment(annualScore.date).startOf('year'));
        query.equalTo('courseName', courseName);

        let orgScore = undefined;
        let result = await this.backendService.queryListAll('OrgScore', query);
        if (_.isEmpty(result.list)) {
            let course = await this._getCourseByName(organization.orgCategory, courseName);
            orgScore = {
                date: date,
                course: course,
                courseName: course.name,
                organization: organization,
                orgCode: organization.orgCode,
                assessMethod: AssessMethod.Normal,
                score: score
            };
        } else {
            orgScore = result.list[0];
            if (orgScore.score === score) orgScore = undefined;
            else orgScore.score = score;
        }

        if (orgScore) {
            orgScore = await this.backendService.addOrUpdateItem('OrgScore', orgScore);
        }

        return orgScore;
    }

    async _getCourseByName(orgCategory, name) {
        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);
        let query = new Client.Query(Client.Course);
        query.matchesQuery('standard', standardQuery);
        query.equalTo('orgCategories', orgCategory);
        query.equalTo('name', name);
        let result = await this.backendService.queryListAll('Course', query);

        return result.list[0];
    }

    _evaluateLeaderOfficeScore(rules, stats, exerciseScore) {
        let score = ScoreLevel.Unpass;
        for (let rule of rules) {
            let matchCount = 0;
            rule.conditions.map(item => {
                if (exerciseScore>=item.exerciseSocre) {
                    switch(item.scoreReq) {
                        case ScoreLevel.Excellent: {
                            (stats.excellentCount >= item.courseNum)&&(matchCount++);
                            break;
                        }
                        case ScoreLevel.Good:{
                            (stats.goodCount >= item.courseNum)&&(matchCount++);
                            break;
                        }
                        case ScoreLevel.Pass:{
                            (stats.passCount >= item.courseNum)&&(matchCount++);
                            break;
                        }
                    }
                }
            });
            if (!_.isEmpty(rule.conditions) && rule.conditions.length===matchCount) {
                score = rule.score;
                break;
            }
        }

        return score;
    }

    _evaluateUnitForceScore(rules, stats, tacticsScore) {
        let score = ScoreLevel.Unpass;
        for (let rule of rules) {
            let matchCount = 0;
            rule.conditions.map(item => {
                if (tacticsScore>0 && rule.withTactics) {
                    if (tacticsScore>=item.tacticsSocre) {
                        switch(item.scoreReq) {
                            case ScoreLevel.Excellent: {
                                (stats.excellentCount >= item.courseNum)&&(matchCount++);
                                break;
                            }
                            case ScoreLevel.Good:{
                                (stats.goodCount >= item.courseNum)&&(matchCount++);
                                break;
                            }
                            case ScoreLevel.Pass:{
                                (stats.passCount >= item.courseNum)&&(matchCount++);
                                break;
                            }
                        }
                    }
                } else if (!tacticsScore && !rule.withTactics) {
                    switch(item.scoreReq) {
                        case ScoreLevel.Excellent: {
                            (stats.excellentCount >= item.courseNum)&&(matchCount++);
                            break;
                        }
                        case ScoreLevel.Good:{
                            (stats.goodCount >= item.courseNum)&&(matchCount++);
                            break;
                        }
                        case ScoreLevel.Pass:{
                            (stats.passCount >= item.courseNum)&&(matchCount++);
                            break;
                        }
                    }
                }
            });
            if (!_.isEmpty(rule.conditions) && rule.conditions.length===matchCount) {
                score = rule.score;
                break;
            }
        }

        return score;
    }

    _statScoreCount(scores) {
        let total = scores.length;

        let stats = scores.reduce((prev, curr) => {
            if (curr.score >= ScoreLevel.Pass) {
                prev.passCount++;
            }
            if (curr.score >= ScoreLevel.Good) {
                prev.goodCount++;
            }
            if (curr.score === ScoreLevel.Excellent) {
                prev.excellentCount++;
            }
            return prev;
        }, {passCount: 0, goodCount: 0, excellentCount: 0});

        stats.total = total;
        stats.passRate = +(stats.passCount*100/total).toFixed(2);
        stats.goodRate = +(stats.goodCount*100/total).toFixed(2);
        stats.excellentRate = +(stats.excellentCount*100/total).toFixed(2);

        return stats;
    }

    _evaluateScore(rules, stats) {
        let score = ScoreLevel.Unpass;
        for (let rule of rules) {
            let matchCount = 0;
            rule.conditions.map(item => {
                switch(item.scoreReq) {
                    case ScoreLevel.Excellent: {
                        (stats.excellentRate >= item.matchRate)&&(matchCount++);
                        break;
                    }
                    case ScoreLevel.Good:{
                        (stats.goodRate >= item.matchRate)&&(matchCount++);
                        break;
                    }
                    case ScoreLevel.Pass:{
                        (stats.passRate >= item.matchRate)&&(matchCount++);
                        break;
                    }
                }
            });
            if (!_.isEmpty(rule.conditions) && rule.conditions.length===matchCount) {
                score = rule.score;
                break;
            }
        }

        return score;
    }

    async updatePersonScores(soldiers, assessEvent) {
        try {
            let soldierIds = soldiers.map(item => item.objectId||item);
            let result = await Client.Cloud.run('updatePersonScores',
                {soldierIds, assessEvent:assessEvent.objectId||assessEvent}, this.backendService.options);
            return result;
        } catch (exception) {
            console.log(`updatePersonScores failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updatePersonScoresV2(soldiers) {
        try {
            let soldierIds = soldiers.map(item => item.objectId||item);
            let result = await Client.Cloud.run('updatePersonScoresV2',
                {soldierIds}, this.backendService.options);
            return result;
        } catch (exception) {
            console.log(`updatePersonScores failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updateLocalOrgAnnualScores(organizations, orgType) {
        try {
            let result = await Client.Cloud.run('updateLocalOrgAnnualScores', {organizations, orgType}, this.backendService.options);
            return result;
        } catch (exception) {
            console.log(`updateLocalOrgAnnualScores failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
}

export default ScoreService;
