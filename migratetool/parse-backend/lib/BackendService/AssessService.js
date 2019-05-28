import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import {
    OrgType,
    OrgSequence,
    AssessMethod,
    CourseCategory,
    AssessCourseCategory,
    InServiceStatus,
    OrgSequenceMap, ScoreLevel, StandardState
} from '../Constants';
import AssessEventService from "./AssessEventService";
import SportService from "./SportService";

export class AssessService {
    constructor(backend) {
        this.backendService = backend;

        this.assessEventService = new AssessEventService(backend);
        this.sportService = new SportService(backend);
    }

    async queryOrganizationOptions(orgLevel) {
        try {
            if (!_.isString(orgLevel)) throw '参数错误';
            let curOrg = this.backendService.getCurrentOrganization();
            let query = new Client.Query(Client.Organization);
            if (!_.isEmpty(curOrg)) {
                query.equalTo('parentIds', curOrg.objectId);
            }
            query.containedIn('orgSequence', OrgSequenceMap[orgLevel]);
            query.containedIn('orgType', [OrgType.Troop, OrgType.UnitForce]);
            query.addAscending('orgCode');

            const result = await this.backendService.queryListAll('Organization', query);
            return result.list;
        } catch (exception) {
            console.log(`queryOrganizationOptions failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 保存考核事件
    async addOrUpdateAssessment(assessment) {
        try {
            let cloned = {...assessment};

            let orgOptions = await this.queryOrganizationOptions(assessment.orgLevel);
            orgOptions = orgOptions.map(item => item.objectId);

            if (!_.isEmpty(cloned.soldiers)) {
                cloned.assessTargets = orgOptions.map(orgId => {
                    let subSoldiers = cloned.soldiers.filter(soldier => (soldier.organization.parentIds||[]).includes(orgId));

                    return {
                        orgId,
                        soldierIds: subSoldiers.map(item => item.objectId),
                        soldierCardIds: subSoldiers.map(item => item.cardId)
                    };
                });
                delete cloned.soldiers;
            }

            if (!_.isEmpty(cloned.courses)) {
                cloned.courses = cloned.courses.map(item => item.objectId);
            }

            let ret = await this.backendService.addOrUpdateItem('Assessment', cloned);
            assessment.objectId = ret.objectId;

            return assessment;
        } catch (exception) {
            console.log(`addOrUpdateAssessment failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取考核事件关联的单位、人员和课目数据
    async fetchAssessment(assessment) {
        try {
            if (_.isEmpty(assessment)) return undefined;
            if (_.isString(assessment)) {
                assessment = await this.backendService.fetchItem('Assessment', assessment);
            }
            assessment = {...assessment};

            if (!_.isEmpty(assessment.assessTargets)) {
                let orgIds = _.uniq(assessment.assessTargets.map(item => item.orgId));
                let organizations = await this.backendService.fetchAll('Organization', orgIds);

                let soldierIds = _.uniq(_.flatten(assessment.assessTargets.map(item => item.soldierIds||[])));

                let query = new Client.Query(Client.Soldier);
                query.containedIn('objectId', soldierIds);
                query.equalTo('inserviceStatus', InServiceStatus.InService);
                query.addAscending(['orgCode', 'positionCode']);
                let result = await this.backendService.queryListAll('Soldier', query);
                const soldiers = result.list.filter(item => !_.isEmpty(item.organization));

                assessment.assessTargets = assessment.assessTargets.map(item => {
                    let organization = organizations.find(org => org.objectId === item.orgId);
                    return {
                        organization,
                        soldiers: soldiers.filter(soldier => item.soldierIds.includes(soldier.objectId))
                    }
                });
                assessment.soldiers = soldiers.map(item => {
                    return {
                        name: item.name,
                        objectId: item.objectId,
                        position: item.position,
                        rank: item.rank,
                        organization: {
                            name: item.organization.name,
                            displayName: item.organization.displayName,
                            objectId: item.organization.objectId,
                            orgSequence: item.organization.orgSequence,
                            parentIds:item.organization.parentIds,
                        }
                    }
                });
            }

            if (!_.isEmpty(assessment.courses)) {
                assessment.courses = await this.backendService.fetchAll('Course', assessment.courses);
            }

            return assessment;
        } catch (exception) {
            console.log(`fetchAssessment failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getAssessedCourses(assessment, organization) {
        try {
            if (assessment.assessMethod === AssessMethod.Train) return []

            let query = new Client.Query(Client.AssessEvent);
            query.equalTo('assessment', this.backendService.getParseObject('Assessment', assessment.objectId));
            query.equalTo('organizer', this.backendService.getParseObject('Organization', organization.objectId))

            let result = await this.backendService.queryListAll('AssessEvent', query);

            let courses = result.list.map(item => item.course).filter(item => item && _.isEmpty(item.testContents));
            if (assessment.assessMethod === AssessMethod.Normal) {
                courses = courses.filter(item => item.category === CourseCategory.Train);
            }

            return courses;
        } catch (exception) {
            console.log(`getAssessedCourses failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取可单独录入课目的可选单位列表
    async getAvailableOrgs(assessment) {
        try {
            if (_.isString(assessment)) {
                assessment = await this.fetchAssessment(assessment);
            }

            if (assessment.assessMethod === AssessMethod.Sampling) {
                const assessTargets = (assessment.assessTargets||[]).filter(item => !_.isEmpty(item.soldiers)||!_.isEmpty(item.soldierCardIds));

                let organizations = assessTargets.map(item => item.organization).filter(item => item);

                if (_.isEmpty(organizations)) {
                    const orgIds = _.uniq(assessTargets.map(item => item.orgId));
                    if (_.isEmpty(orgIds)) return [];

                    organizations = await this.backendService.fetchAll('Organization', orgIds);
                }

                return [assessment.organization, ...organizations];
            } else {
                return await this.assessEventService.getAvailableOrgs();
            }
        } catch (exception) {
            console.log(`getAvailableOrgs failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getOptionalCourses({assessment, organization, assessCourseCategory, sportTestCategory, groupId}) {
        try {
            if (_.isString(assessment)) {
                assessment = await this.backendService.fetchItem('Assessment', assessment);
            }
            if (assessment.assessMethod === AssessMethod.Sampling) {
                if (_.isEmpty(assessment.courses)) return [];

                if (assessment.courses[0].objectId) return assessment.courses;

                return await this.backendService.fetchAll('Course', assessment.courses);
            } else {
                if (assessCourseCategory === AssessCourseCategory.Train) {
                    return this.assessEventService.getOptionalCourses(organization, OrgSequence.Soldier);
                } else if (assessCourseCategory === AssessCourseCategory.Sport) {
                    return this.sportService.getCourseOptions(organization, sportTestCategory, groupId);
                } else {
                    return [{name: AssessCourseCategory.Shape}];
                }
            }
        } catch (exception) {
            console.log(`getOptionalCourses failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getSamplingAssessCourses() {
        try {
            let standardQuery = new Client.Query(Client.TrainStandard);
            standardQuery.equalTo('state', StandardState.Using);

            // 查询通用课目列表
            let query = new Client.Query(Client.SportAssessReq);
            query.matchesQuery('standard', standardQuery);
            let result = await this.backendService.queryListAll('SportAssessReq', query);
            let courses = result.list.map(item => item.course);

            // 查询专项考核课目列表
            query = new Client.Query(Client.SportCourseGroup);
            query.matchesQuery('standard', standardQuery);
            result = await this.backendService.queryListAll('SportCourseGroup', query);
            if (!_.isEmpty(result.list)) {
                courses = courses.concat(_.flatten(result.list.map(item => item.courses)));
            }
            courses = _.uniqBy(courses.filter(item => !!item), 'objectId');

            return courses.sort((a, b) => a.seq - b.seq);
        } catch (exception) {
            console.log(`getSamplingAssessCourses failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getTrainersByCourse(assessment, course) {
        try {
            if (_.isString(assessment)) {
                assessment = await this.backendService.fetchItem('Assessment', assessment);
            }

            if (assessment.assessMethod === AssessMethod.Sampling) {
                return [];
            } else {
                if (course.category === CourseCategory.Train) {
                    return this.assessEventService.getTrainersByCourse(course);
                } else {
                    return [];
                }
            }
        } catch (exception) {
            console.log(`getTrainersByCourse failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 生成初始单课目成绩登记表单
    async getInitAssessEvent({assessment, organization, date, course, testContent, trainer, sportTestCategory=0, groupId=0, isMakeup=false}) {
        try {
            if (_.isEmpty(course) || _.isString(course)) throw '传入课目参数无效';

            let courseName = (course||{}).name;
            const category = (course||{}).category;
            if (_.isEmpty(courseName)) courseName = AssessCourseCategory.Shape;

            if (assessment.assessMethod === AssessMethod.Sampling) {
                assessment = await this.fetchAssessment(assessment)
            }

            if (courseName === AssessCourseCategory.Shape) {
                return await this.sportService.getInitPhysicalShapes({assessment, organization, date});
            } else if (category === CourseCategory.Train) {
                return await this.assessEventService.getInitAssessEvent({assessment, organization, date, course, testContent, trainer});
            } else {
                return await this.sportService.getInitSportEvent({assessment, organization, date, course, sportTestCategory, groupId, isMakeup});
            }

        } catch (exception) {
            console.log(`getInitAssessEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addOrUpdateAssessEvent(assessEvent) {
        try {
            if (assessEvent.category === AssessCourseCategory.Train) {
                return await this.assessEventService.addOrUpdateAssessEvent(assessEvent);
            } else if (assessEvent.category === AssessCourseCategory.Sport){
                return await this.sportService.addOrUpdateSportEvent(assessEvent);
            } else {
                return await this.sportService.addOrUpdatePhysicalShapes(assessEvent);
            }
        } catch (exception) {
            console.log(`addOrUpdateAssessEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getAssessEventDetails(objectId) {
        try {
            let assessEvent = await this.backendService.fetchItem('AssessEvent', objectId);

            if ((assessEvent.assessment||{}).assessMethod === AssessMethod.Sampling) {
                assessEvent.assessment = await this.fetchAssessment(assessEvent.assessment);
            }

            if (assessEvent.category === AssessCourseCategory.Train) {
                return await this.assessEventService.getAssessEventDetails(assessEvent);
            } else if (assessEvent.category === AssessCourseCategory.Sport){
                return await this.sportService.getSportEventDetails(assessEvent);
            } else {
                return await this.sportService.getPhysicalShapeDetails(assessEvent);
            }
        } catch (exception) {
            console.log(`getAssessEventDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteAssessEvent(objectId) {
        try {
            const assessEvent = await this.backendService.fetchItem('AssessEvent', objectId);
            const currOrg = this.backendService.getCurrentOrganization();

            if (currOrg && assessEvent.organizer && assessEvent.organizer.objectId != currOrg.objectId) throw '无权限删除其他单位创建的体型成绩登记表';

            if (assessEvent.category === AssessCourseCategory.Train) {
                return await this.assessEventService.deleteAssessEvent(assessEvent);
            } else if (assessEvent.category === AssessCourseCategory.Sport){
                return await this.sportService.deleteSportEvent(assessEvent);
            } else {
                return await this.sportService.deletePhysicalShapes(assessEvent);
            }
        } catch (exception) {
            console.log(`getAssessEventDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getSoldierOptions(assessEvent) {
        if (assessEvent.category === AssessCourseCategory.Train) {
            return await this.assessEventService.getSoldierOptions(assessEvent);
        } else if (assessEvent.category === AssessCourseCategory.Sport){
            return await this.sportService.getSoldierOptionsForSport(assessEvent);
        } else {
            return await this.sportService.getSoldierOptionsForShape(assessEvent);
        }
    }

    async addSoldier(assessEvent, soldier) {
        if (assessEvent.category === AssessCourseCategory.Train) {
            return await this.assessEventService.addSoldier(assessEvent, soldier);
        } else if (assessEvent.category === AssessCourseCategory.Sport){
            return await this.sportService.addSoldierForSport(assessEvent, soldier);
        } else {
            return await this.sportService.addSoldierForShape(assessEvent, soldier);
        }
    }

    async removeSoldier(assessEvent, soldierId) {
        if (assessEvent.category === AssessCourseCategory.Train) {
            return await this.assessEventService.removeSoldier(assessEvent, soldierId);
        } else if (assessEvent.category === AssessCourseCategory.Sport){
            return await this.sportService.removeSoldierForSport(assessEvent, soldierId);
        } else {
            return await this.sportService.removeSoldierForShape(assessEvent, soldierId);
        }
    }

    async evaluateSportScore(sportScore, organization) {
        return await this.sportService.evaluateSportScore(sportScore, organization);
    }

    async getScoreRankDetail(assessment) {
        try {
            if (_.isString(assessment)) {
                assessment = await this.backendService.fetchItem('Assessment', assessment);
            }

            let query = new Client.Query(Client.PersonScoreRank);
            query.equalTo('assessment', this.backendService.getParseObject('Assessment', assessment.objectId));
            query.addAscending('orgCode')
                .addAscending('positionCode').addDescending(['rankCode', 'age']);
            let result = await this.backendService.queryListAll('PersonScoreRank', query);
            const existedPSRanks = result.list;

            query = new Client.Query(Client.OrgScoreRank);
            query.equalTo('assessment', this.backendService.getParseObject('Assessment', assessment.objectId));
            query.addAscending('orgCode');
            result = await this.backendService.queryListAll('OrgScoreRank', query);
            const existedOSRanks = result.list;

            return {
                assessment,
                personScoreRanks: existedPSRanks,
                orgScoreRanks: existedOSRanks
            };
        } catch (exception) {
            console.log(`getAssessEventDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
}

export default AssessService;
