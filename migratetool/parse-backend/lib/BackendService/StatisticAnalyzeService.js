import {AssessMethod, OrgSequence, ScoreLevel} from "../Constants";
import parseUtils from "../utils/parseUtils";
import Client from "../Client";
import _ from "lodash";

export class StatisticAnalyzeService {
    constructor(backend) {
        this.backendService = backend;
    }

    async scoreStatisticAnalyze(orgIds,assessMethod){
        try{
            for(let orgId of orgIds) {
                //筛选该总队下所有单位ID，包括自己 (中队以上)
                let query = new Client.Query(Client.Organization);
                query.equalTo('parentIds',orgId);
                query.lessThanOrEqualTo('orgSequence',OrgSequence.Company);
                query.ascending('orgCode');
                let result = await this.backendService.queryListAll('Organization',query);
                let orgTotal = result.list.map(org => {
                        return {
                            objectId: org.objectId,
                            orgCode: org.orgCode
                        };
                });

                //筛选整个总队个人年度成绩数据

                query = new Client.Query(Client.PersonSportAnnualScore);
                query.equalTo('year', this.backendService.systemTime.getFullYear());
                query.equalTo('assessMethod', assessMethod);
                let childQuery = new Client.Query(Client.Organization);
                childQuery.equalTo('parentIds', orgId);
                query.matchesQuery('organization', childQuery);
                query.descending('date');
                result = await this.backendService.queryListAll('PersonSportAnnualScore', query);

                let personAnnualSportScore = _.uniqBy(result.list, 'cardId');
                //各级单位成绩统计分析
                for (let childOrg of orgTotal) {
                    let ret = personAnnualSportScore.filter(ele => {
                        return ele.organization.parentIds.indexOf(childOrg.objectId) >= 0;
                    });
                    if(ret.length === 0){
                        return 0; //无记录
                    }
                    let courseAverageScores = this._statAverageScore(ret);
                    let totalAverageScore = this._statAverageTotalScore(ret);
                    let stats = this._statScoreCount(ret);
                    let statisticAnalysis = {
                        year: this.backendService.systemTime.getFullYear(),
                        date: this.backendService.systemTime,
                        organization: childOrg.objectId,
                        orgCode: childOrg.orgCode,
                        assessMethod,
                        stats,
                        totalAverageScore,
                        courseAverageScores
                    };
                    let oldQuery = new Client.Query(Client.ScoreStatisticAnalysis);
                    oldQuery.equalTo('year',statisticAnalysis.year);
                    oldQuery.equalTo('assessMethod',assessMethod);
                    oldQuery.equalTo('organization',this.backendService.getParseObject('Organization',childOrg.objectId));
                    let oldRecord = await this.backendService.queryListAll('ScoreStatisticAnalysis', oldQuery);
                    if(!_.isEmpty(oldRecord.list)){
                        statisticAnalysis.objectId = oldRecord.list[0].objectId;
                    }
                    await this.backendService.addOrUpdateItem('ScoreStatisticAnalysis',statisticAnalysis);
                }
            }
        }catch (exception) {
            console.log(`scoreStatisticAnalyze failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    _statScoreCount(scores) {
        let referenceNum = scores.length;

        let stats = scores.reduce((prev, curr) => {
            if (curr.evaluatedScore >= ScoreLevel.Pass) {
                prev.passCount++;
            }
            if (curr.evaluatedScore >= ScoreLevel.Good) {
                prev.goodCount++;
            }
            if (curr.evaluatedScore >= ScoreLevel.Excellent) {
                prev.excellentCount++;
            }
            if (curr.evaluatedScore >= ScoreLevel.ExtraL3) {
                prev.extraL3Count++;
            }
            if (curr.evaluatedScore >= ScoreLevel.ExtraL2) {
                prev.extraL2Count++;
            }
            if (curr.evaluatedScore === ScoreLevel.ExtraL1) {
                prev.extraL1Count++;
            }
            return prev;
        }, {passCount: 0, goodCount: 0, excellentCount: 0, extraL3Count: 0, extraL2Count: 0, extraL1Count: 0,});

        stats.referenceNum = referenceNum;
        stats.passRate = +(stats.passCount*100/referenceNum).toFixed(2);
        stats.goodRate = +(stats.goodCount*100/referenceNum).toFixed(2);
        stats.excellentRate = +(stats.excellentCount*100/referenceNum).toFixed(2);
        stats.extraL3Rate = +(stats.extraL3Count*100/referenceNum).toFixed(2);
        stats.extraL2Rate = +(stats.extraL2Count*100/referenceNum).toFixed(2);
        stats.extraL1Rate = +(stats.extraL1Count*100/referenceNum).toFixed(2);

        return stats;
    }

    _statAverageTotalScore(scores){
        let totalScore = scores.reduce((prev, curr) => {
            prev += curr.totalScore;
            return prev;
        },0);
        return +(totalScore/scores.length).toFixed(2);
    }

    _statAverageScore(scores) {
        let allTotalNum = scores.length;

        let coursesScoresStat = scores.reduce((prev, curr) => {
            return prev.concat(curr.requiredCourseScores);
        },[]);
        let ordered = _.groupBy(coursesScoresStat,'courseName');
        let courseAverageScores =  [];
        for(let key in ordered){
            let singleCourseScore = ordered[key].reduce((prev,curr) => {
                prev += curr.score;
                return prev;
            }, 0);
            let singleAvgScore = +(singleCourseScore/ordered[key].length).toFixed(2);
            courseAverageScores.push({name:key,averageScore:singleAvgScore})
        }
        return courseAverageScores;
    }
}
export default StatisticAnalyzeService;
