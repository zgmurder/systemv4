import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import {
    StandardState,
    AssessMethod,
    ScoreCriteria,
    ScoreLevel,
    ScoreTarget,
    CountType,
    SportTestCategory,
    OrgType,
    AssessCourseCategory
} from '../Constants';
import moment from 'moment';
import versionUtils from "../utils/versionUtils";

export class SportService {
    constructor(backend) {
        this.backendService = backend;

        this.bmiStandards = [];
        this.pbfStandards = [];
        this.scoreStandards = [];
        this.personScoreStandards = [];

        this.sportAssessReqs = [];
        this.sportCourseGroups = [];
        // this.sportCourses = [];
        this.soldierTypeCache = {};
    }


    async _getDiffCategoryOrgs(organization) {
        let list = [];

        if (_.isString(organization)) {
            organization = await this.backendService.fetchItem('Organization', organization);
        }
        if (_.isEmpty(organization)) return list;
        list.push(organization);

        let localOrgs = await this.backendService.orgService.getLocalOrganizations(organization);
        if (_.isEmpty(localOrgs)) return list;

        let diffOrgs = localOrgs.filter(item => item.orgCategory !== organization.orgCategory);
        if (!_.isEmpty(diffOrgs)) list = list.concat(diffOrgs);

        return list;
    }

    async _getSoldierTypes(organizations) {
        if (_.isEmpty(organizations)) return {physicalLevels: [], troopCategories: []};

        let orgCategories = organizations.map(org => {
            let orgCategory = org.orgCategory;
            if (org.orgType === OrgType.Troop) {
                orgCategory = `${orgCategory}首长机关`;
            }
            return orgCategory;
        });


        let query = new Client.Query(Client.OrgCategory);
        query.containedIn('name', orgCategories);
        let result = await this.backendService.queryListAll('OrgCategory', query);

        let physicalLevels = _.uniq(result.list.map(item => item.physicalLevel));
        let troopCategories = _.uniq(result.list.map(item => item.troopCategory));

        return {physicalLevels, troopCategories};
    }

    // 根据所选单位，体育课目考核要求分类，专项课目组编号获取可选课目
    async getCourseOptions(organization, sportTestCategory, groupId=0) {
        // let organizations = await this._getDiffCategoryOrgs(organization);
        // let soldierType = await this._getSoldierTypes(organizations);
        let soldierTypes = [];
        if (!_.isEmpty(organization)) {
            soldierTypes = this.soldierTypeCache[organization.objectId];
            if (_.isEmpty(soldierTypes)) {
                let soldiers = await this.backendService.soldierService.getAllLocalSoldiers(organization);
                soldierTypes = soldiers.map(item => ({
                    physicalLevel: item.physicalLevel,
                    troopCategory: item.troopCategory,
                    isCivilServant: item.isCivilServant,
                    gender: item.person.gender
                }));
                soldierTypes = _.uniqWith(soldierTypes, _.isEqual);
                this.soldierTypeCache[organization.objectId] = soldierTypes;
            }
        }

        await this._fetchDatas();

        console.log('getCourseOptions groupId=', groupId)

        console.log('getCourseOptions soldierTypes=', soldierTypes)
        // console.log('getCourseOptions sportCourseGroups=', this.sportCourseGroups)

        if (sportTestCategory === SportTestCategory.Required) {
            let assessReqs = this.sportAssessReqs.filter(req => {
                let found = soldierTypes.find(item => {
                    return (req.physicalLevels.includes(item.physicalLevel) &&
                        req.troopCategories.includes(item.troopCategory) &&
                        req.genders.includes(item.gender))
                });
                return found;
            });

            let courses = _.unionBy(assessReqs.map(item => item.course), 'objectId');

            return courses;
        } else if (sportTestCategory === SportTestCategory.Optional) {
            let courseGrops = this.sportCourseGroups.filter(group => {
                if (group.groupId != groupId) return undefined;
                let found = soldierTypes.find(item => {
                    return (group.physicalLevel === item.physicalLevel &&
                        group.troopCategory === item.troopCategory &&
                        group.gender === item.gender && !item.isCivilServant);
                });
                return found;
            });

            let courses = _.flattenDeep(_.sortBy(courseGrops, 'itemSeq').map(item => item.courses));
            courses = _.uniqBy(courses, 'objectId');

            return courses;
        } else {
            return [];
        }
    }

    // deprecated
    async getOptionalCourses(organization) {
        try {
            let courses = [];
            let soldierTypes = [];
            if (!_.isEmpty(organization)) {
                let soldiers = await this.backendService.soldierService.getAllLocalSoldiers(organization);
                soldierTypes = soldiers.map(item => ({
                    physicalLevel: item.physicalLevel,
                    troopCategory: item.troopCategory,
                    isCivilServant: item.isCivilServant,
                    gender: item.person.gender
                }));
                soldierTypes = _.uniqWith(soldierTypes, _.isEqual);
            }

            // 查询通用课目列表
            let standardQuery = new Client.Query(Client.TrainStandard);
            standardQuery.equalTo('state', StandardState.Using);
            let query = new Client.Query(Client.SportAssessReq);
            query.matchesQuery('standard', standardQuery);
            let result = await this.backendService.queryListAll('SportAssessReq', query);
            let assessReqs = result.list;
            if (!_.isEmpty(soldierTypes)) {
                assessReqs = assessReqs.filter(req => {
                    let found = soldierTypes.find(item => {
                        return (req.physicalLevels.includes(item.physicalLevel) &&
                            req.troopCategories.includes(item.troopCategory) &&
                            req.genders.includes(item.gender))
                    });
                    return found;
                });
            }

            courses = assessReqs.map(item => item.course);

            // 查询专项考核课目列表
            query = new Client.Query(Client.SportCourseGroup);
            query.matchesQuery('standard', standardQuery);
            result = await this.backendService.queryListAll('SportCourseGroup', query);
            let courseGrops = result.list;
            if (!_.isEmpty(soldierTypes)) {
                courseGrops = courseGrops.filter(group => {
                    let found = soldierTypes.find(item => {
                        return (group.physicalLevel === item.physicalLevel &&
                            group.troopCategory === item.troopCategory &&
                            group.gender === item.gender && !item.isCivilServant);
                    });
                    return found;
                });
            }

            courseGrops.map(item => {
                courses = courses.concat(item.courses);
            });
            courses = courses.filter(item => !_.isEmpty(item));
            courses = _.uniqWith(courses, (a, b) => a.objectId === b.objectId);
            // courses.sort((a, b) => a.createdAt - b.createdAt);

            return courses;
        } catch (exception) {
            console.log(`getOptionalCourses failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getSoldierOptionsForSport(assessEvent) {
        try {
            const {assessment, organization} = assessEvent;

            let soldiers = [];
            if (assessment.assessMethod != AssessMethod.Sampling) {
                soldiers = await this.backendService.soldierService.getAllLocalSoldiers(organization);
            } else {
                if (!_.isEmpty(assessment.assessTargets)) {
                    // soldiers = assessment.assessTargets.map(item => item.soldier);
                    assessment.assessTargets.map(item => soldiers.push(...item.soldiers));
                }
            }

            const course = assessEvent.course;
            soldiers = soldiers.filter(soldier => {
                let sportGroup = undefined;
                let assessReq = undefined;
                if (assessEvent.sportTestCategory === SportTestCategory.Required) {
                    let assessReqs = this.sportAssessReqs.filter(item => item.course&&item.course.objectId === course.objectId);
                    assessReq = this._findAssessReq(assessEvent.date, assessReqs, soldier);
                } else {
                    let sportGroups = this.sportCourseGroups.filter(group => group.groupId === assessEvent.groupId&&group.courses&&group.courses.findIndex(item=>item.objectId===course.objectId)>=0);
                    sportGroup = this._findSportGroup(sportGroups, soldier);
                }

                // 人员不满足考核要求，则不录入该人员成绩
                return assessReq || sportGroup;
            });

            return _.differenceWith(soldiers, assessEvent.sportScores, (a, b) => a.objectId === (b.soldier||{}).objectId);
        } catch (exception) {
            console.log(`getSoldierOptionsForSport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addSoldierForSport(assessEvent, soldier) {
        try {
            const {assessment, course} = assessEvent;
            let displayOrg = undefined;
            if (!_.isEmpty(assessment.assessTargets)) {
                let found = assessment.assessTargets.find(item => (item.soldier||{}).objectId === soldier.objectId);
                displayOrg = (found||{}).organization;
            }

            let sportScore = {
                date: assessEvent.date,
                soldier,
                course,
                assessMethod: assessEvent.assessMethod,
                organization: soldier.organization,
                orgCode: (soldier.organization||{}).orgCode,
                displayOrg,
                displayOrgCode: (displayOrg||{}).orgCode,
                organizer: assessment.organization,
                age: moment(assessEvent.date).diff((soldier.person||{}).birthday, 'years'),
                gender: (soldier.person||{}).gender,
                cardId: (soldier.person||{}).cardId,
                departmentPosition: `${(soldier.organization||{}).displayName}${soldier.position}`,
                position: soldier.position,
                positionCode: soldier.positionCode,
                rankCode: soldier.rankCode,
                enlistedAt: soldier.enlistedAt,
                isCommander: soldier.isCommander,
                isMaster: soldier.isMaster,
                courseName: course.name,

                sportTestCategory: assessEvent.sportTestCategory,
                groupId: assessEvent.groupId,
                scoreCriteria: _.isEmpty(course.countType)?ScoreCriteria.Level4.name:course.scoreCriteria,
                countType: course.countType,
                unitType: course.unitType,
                count: 0,
                score: 0,
                isMakeup: assessEvent.isMakeup
            };

            if (!_.isEmpty(assessEvent.deletedItems)) {
                const index = assessEvent.deletedItems.findIndex(item => item.soldier.objectId === soldier.objectId);
                if (index >= 0) {
                    sportScore = assessEvent.deletedItems.splice(index, 1)[0];
                }
            }

            const mainOrg = await this.backendService.orgService.getMainOrgByChild(soldier.organization);
            let scoreStandard = this._findScoreStandard(assessEvent.date, this.scoreStandards, soldier, mainOrg);
            if (scoreStandard) {
                sportScore.scoreCriteria = scoreStandard.scoreCriteria;
            } else {
                sportScore.scoreCriteria = ScoreCriteria.Level4.name;
                sportScore.countType = '';
            }

            assessEvent.sportScores.push(sportScore);
            assessEvent.sportScores = _.sortBy(assessEvent.sportScores, ['orgCode', 'organization.displayName', 'positionCode', 'enlistedAt']);

            // assessEvent.total++;
            // assessEvent.passCount++;

            return assessEvent;
        } catch (exception) {
            console.log(`addSoldierForSport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async removeSoldierForSport(assessEvent, soldierId) {
        try {
            let index = assessEvent.sportScores.findIndex(item => item.soldier.objectId === soldierId);
            const deletedItem = assessEvent.sportScores.splice(index, 1);

            assessEvent.deletedItems = (assessEvent.deletedItems||[]).concat(deletedItem);

            // if (assessEvent.total > 0) assessEvent.total--;

            return assessEvent;
        } catch (exception) {
            console.log(`removeSoldierForSport failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 生成初始单课目成绩登记表单
    async getInitSportEvent({assessment, organization, date, course, sportTestCategory=0, groupId=0, isMakeup=false}) {
        try {
            let organizer = assessment.organization;
            let assessMethod = assessment.assessMethod;
            if (!date) date = assessment.date;

            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) throw '考核单位找不到';
            if (_.isString(organizer)) {
                organizer = await this.backendService.fetchItem('Organization', organizer);
            }
            if (assessMethod === AssessMethod.Sampling && _.isEmpty(organizer)) throw '请设置抽考组织单位';
            if (assessMethod === AssessMethod.Sampling && organizer.orgSequence>organization.orgSequence) throw '不能对上级单位组织抽考';

            if (_.isString(course)) {
                course = await this.backendService.fetchItem('Course', course);
            }
            if (_.isEmpty(course)) throw '所选课目找不到';

            await this._fetchDatas();

            // 检查是否已经登记
            // if (this._checkSportEvent({organization, assessMethod, date, course})) {
            //     throw `课目${course.name}的${assessMethod}成绩已经登记过，请不要重复登记`;
            // }

            const mainOrg = await this.backendService.orgService.getMainOrgByChild(organization);

            // let testReq = await this._getTestReqByCourse(course);
            this.scoreStandards = await this._getSportScoreStandards(course);
            // if (_.isEmpty(this.scoreStandards)) throw '所选课目还未录入考核成绩计算标准';

            let assessEvent = {
                assessment,
                course,
                organization,
                organizer,
                assessMethod,
                date,
                year: moment(date).year(),
                courseName: course.name,
                orgCode: organization.orgCode,
                isMakeup: isMakeup,
                state: 0,
                scoreSriteria: _.isEmpty(course.countType)?ScoreCriteria.Level4.name:course.scoreCriteria,

                category: AssessCourseCategory.Sport,
                sportTestCategory: sportTestCategory,
                groupId: groupId,

                score: ScoreLevel.Pass,
                total: 0,
                passCount: 0,
                passRate: 0,
                unpassCount: 0,
                unpassRate: 0,
                goodCount: 0,
                goodRate: 0,
                excellentCount: 0,
                excellentRate: 0,
            };

            let soldiers = [];
            if (assessment.assessMethod != AssessMethod.Sampling) {
                soldiers = await this.backendService.soldierService.getAllLocalSoldiers(organization);
            } else {
                if (!_.isEmpty(assessment.assessTargets)) {
                    assessment.assessTargets.map(item => {
                       soldiers = soldiers.concat(item.soldiers);
                    });
                }

                soldiers = soldiers.filter(item => (item.organization.parentIds||[]).includes(organization.objectId));
            }

            assessEvent.sportScores = soldiers.map(soldier => {
                if (assessment.assessMethod != AssessMethod.Sampling) {
                    let sportGroup = undefined;
                    let assessReq = undefined;
                    if (sportTestCategory === SportTestCategory.Required) {
                        let assessReqs = this.sportAssessReqs.filter(item => item.course&&item.course.objectId === course.objectId);
                        assessReq = this._findAssessReq(date, assessReqs, soldier);
                    }
                    if (sportTestCategory === SportTestCategory.Optional) {
                        let sportGroups = this.sportCourseGroups.filter(group => group.groupId === groupId&&group.courses&&group.courses.findIndex(item=>item.objectId===course.objectId)>=0);
                        sportGroup = this._findSportGroup(sportGroups, soldier);
                    }
                    // 人员不满足考核要求，则不录入该人员成绩
                    if (!assessReq&&!sportGroup) return undefined;
                }

                if (sportTestCategory === SportTestCategory.Optional && soldier.isCivilServant === true) return undefined;

                let displayOrg = undefined;
                if (!_.isEmpty(assessment.assessTargets)) {
                    let found = assessment.assessTargets.find(target => {
                        return (target.soldiers||[]).findIndex(item => item.objectId === soldier.objectId) >= 0;
                    });
                    displayOrg = (found||{}).organization;
                }

                let sportScore = {
                    date,
                    soldier,
                    course,
                    assessMethod,
                    organization: soldier.organization,
                    orgCode: (soldier.organization||{}).orgCode,
                    displayOrg,
                    displayOrgCode: (displayOrg||{}).orgCode,
                    organizer,
                    age: moment(date).diff((soldier.person||{}).birthday, 'years'),
                    gender: (soldier.person||{}).gender,
                    cardId: (soldier.person||{}).cardId,
                    departmentPosition: `${organization.displayName}${soldier.position}`,
                    position: soldier.position,
                    positionCode: soldier.positionCode,
                    rankCode: soldier.rankCode,
                    enlistedAt: soldier.enlistedAt,
                    isCommander: soldier.isCommander,
                    isMaster: soldier.isMaster,
                    courseName: course.name,

                    sportTestCategory: sportTestCategory,
                    groupId: groupId,
                    scoreCriteria: _.isEmpty(course.countType)?ScoreCriteria.Level4.name:course.scoreCriteria,
                    countType: course.countType,
                    unitType: course.unitType,
                    count: 0,
                    score: 0,
                    isMakeup: isMakeup,
                    untestedReason: ''
                };

                let scoreStandard = this._findScoreStandard(date, this.scoreStandards, soldier, mainOrg);
                if (scoreStandard) {
                    sportScore.scoreCriteria = scoreStandard.scoreCriteria;
                } else {
                    sportScore.scoreCriteria = ScoreCriteria.Level4.name;
                }
                return sportScore;
            });
            assessEvent.sportScores = assessEvent.sportScores.filter(item => !_.isEmpty(item));

            if (_.isEmpty(assessEvent.sportScores)) throw `课目${course.name}没有需要考核的人员`;
            assessEvent.sportScores = _.sortBy(assessEvent.sportScores, ['organization.orgCode', 'organization.displayName', 'positionCode', 'enlistedAt']);
            assessEvent.scoreCriteria = assessEvent.sportScores[0].scoreCriteria;

            console.log('getInitSportEvent', assessEvent);
            return assessEvent;
        } catch (exception) {
            console.log(`getInitSportEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据objectId获取完整的SportEvent
    async getSportEventDetails(assessEvent) {
        try {
            if (_.isString(assessEvent)) {
                assessEvent = await this.backendService.fetchItem('AssessEvent', assessEvent);
            }

            await this._fetchDatas();

            this.scoreStandards = await this._getSportScoreStandards(assessEvent.course);

            let query = new Client.Query(Client.SportScore);
            query.equalTo('assessEvent', this.backendService.getParseObject('AssessEvent', assessEvent.objectId));
            query.addAscending('orgCode');
            let result = await this.backendService.queryListAll('SportScore', query);

            assessEvent.sportScores = result.list;
            assessEvent.sportScores = _.sortBy(assessEvent.sportScores, ['organization.orgCode', 'organization.displayName', 'positionCode'])

            return assessEvent;
        } catch (exception) {
            console.log(`getSportEventDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteSportEvent(assessEvent) {
        try {
            // const currOrg = this.backendService.getCurrentOrganization();

            // if (_.isString(assessEvent)) {
            //     assessEvent = await this.backendService.fetchItem('AssessEvent', assessEvent);
            // }

            // if (currOrg && assessEvent.organization && assessEvent.organization.objectId != currOrg.objectId) throw '无权限删除其他单位创建的体育成绩登记表';

            let query = new Client.Query(Client.SportScore);
            query.equalTo('assessEvent', this.backendService.getParseObject('AssessEvent', assessEvent.objectId));
            let result = await this.backendService.queryListAll('SportScore', query);
            const sportScores = result.list;

            await this.backendService.deleteItem('AssessEvent', assessEvent);
            if (_.isEmpty(sportScores)) return;

            await this.backendService.deleteList('SportScore', sportScores);
        } catch (exception) {
            console.log(`deleteSportEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 计算某个某个体育课目的成绩, organization为中队/大队/支队/总队
    async evaluateSportScore(sportScore, organization) {
        console.log('evaluateSportScore entering...', sportScore)

        // 针对不是按时间或数量计数的课目，直接返回四级制成绩
        if (_.isEmpty(sportScore.countType)) {
			sportScore.score=sportScore.count;
			sportScore.isPassed = sportScore.score>ScoreLevel.Unpass;
			return sportScore.score;
		}

        if (_.isEmpty(organization)) {
            organization = await this.backendService.orgService.getMainOrgByChild(sportScore.organization);
        }

        if (_.isEmpty(this.personScoreStandards)) {
            this.personScoreStandards = await this._fetchRule('PersonSportScoreStandard');
        }

        // this.scoreStandards = await this._getSportScoreStandards(sportScore.course);

        const isHighland = organization.height>=2000;

        let standard = undefined;
        if (isHighland) {
            // 获取高原地区的评分规则
            standard = this.scoreStandards.find(item => {
                if (item.isHighland&&!_.isEmpty(item.heightRange)&&
                    organization.height>=item.heightRange.from&&
                    organization.height<=item.heightRange.to) {
                        return  item.scoreTarget===ScoreTarget.Individual&&
                                item.physicalLevels&&item.physicalLevels.includes(sportScore.soldier.physicalLevel) &&
                                item.troopCategories&&item.troopCategories.includes(sportScore.soldier.troopCategory) &&
                                item.gender===sportScore.soldier.person.gender&&item.isCivilServant===sportScore.soldier.isCivilServant;
                    }
                return false;
            });
        }
        if (!standard) {
            // 获取正常地区的评分规则
            standard = this.scoreStandards.find(item => {
                return !item.isHighland&&item.scoreTarget===ScoreTarget.Individual&&
                        item.physicalLevels&&item.physicalLevels.includes(sportScore.soldier.physicalLevel) &&
                        item.troopCategories&&item.troopCategories.includes(sportScore.soldier.troopCategory) &&
                        item.gender===sportScore.gender&&item.isCivilServant===sportScore.soldier.isCivilServant;
            });
        }

        console.log(222, standard)
        if (!standard) return 0;
        if (_.isEmpty(standard.scoreDetail) || _.isEmpty(standard.scoreDetail.individual)) return 0;

        // 找到对应的年龄段评分细则
        let scoreDetails = standard.scoreDetail.individual.filter(item =>
            item.ageRange&&sportScore.age>=item.ageRange.from&&sportScore.age<=item.ageRange.to
        );
        if (_.isEmpty(scoreDetails)) return 0;

        // 对高原地区增加成绩偏量
        if (standard.isHighland && !_.isEmpty(standard.heightFactor)) {
            let heightGap = organization.height - standard.heightRange.from;
            (!standard.heightFactor.heightStep)&&(standard.heightFactor.heightStep=100);
            let countGap = standard.heightFactor.countStep*(Math.floor(heightGap/standard.heightFactor.heightStep));

            scoreDetails = scoreDetails.map(item => {
                item.count += countGap;
                return item;
            });
        }
        scoreDetails.sort((a, b) => a.score - b.score);

        let isAscending = sportScore.course.isAscending;
        const count = sportScore.count;
        if (isAscending===undefined) isAscending = sportScore.countType===CountType.Time?false:true;

        // 查找成绩范围
        let below = undefined;
        let up = undefined;
        for (let item of scoreDetails) {
            if (isAscending) {
                if (count < item.count) {
                    up = item;
                    break;
                } else {
                    below = item;
                }
            } else {
                if (count > item.count) {
                    up = item;
                    break;
                } else {
                    below = item;
                }
            }
        }

        // 计算最后的成绩
        if (sportScore.scoreCriteria != ScoreCriteria.NumberScore.name) {
            sportScore.score = below?below.score:(up.score-1);
            (sportScore.score<1)&&(sportScore.score = 1)
        } else {
            if (!below&&up) {
                sportScore.score = up.score-5;
                (sportScore.score<0)&&(sportScore.score = 0)
            }
            else if (below&&up) {
                let add = Math.floor((up.score-below.score) * (count-below.count) / (up.count-below.count));
                sportScore.score = below.score+add;
            } else if (below&&!up) {
                sportScore.score = below.score;
                if (standard.highScoreDetail&&standard.highScoreDetail.countStep) {
                    let countGap = isAscending?(count-below.count):(below.count-count);
                    sportScore.score = (below.score + standard.highScoreDetail.scoreStep*Math.floor(countGap/standard.highScoreDetail.countStep));
                }
            }
        }

        if (sportScore.scoreCriteria != ScoreCriteria.NumberScore.name) {
            sportScore.isPassed = sportScore.score>ScoreLevel.Unpass;
        } else {
            // 计算单项成绩是否及格
            let singleCourseRule = this.personScoreStandards.find(item =>
                (!item.isTotal && item.physicalLevel === sportScore.physicalLevel &&
                item.evaluatedScore === ScoreLevel.Pass)
            );
            if (singleCourseRule) {
                sportScore.isPassed = sportScore.score>=singleCourseRule.scoreCondtion;
            } else {
                sportScore.isPassed = sportScore.score>=60;
            }
            if (!sportScore.isPassed) sportScore.score = 0;
        }

        console.log('evaluateSportScore leaving', sportScore)

        return sportScore.score;
    }

    async addOrUpdateSportEvent(assessEvent) {
        try {
            let sportScores = assessEvent.sportScores;
            let deletedItems = assessEvent.deletedItems||[];
            delete assessEvent.sportScores;
            delete assessEvent.deletedItems;

            deletedItems = (deletedItems||[]).filter(item => item.objectId);

            let updatedEvent = await this.backendService.addOrUpdateItem('AssessEvent', assessEvent);

            sportScores = sportScores.map(item => {
                item.assessEvent = updatedEvent.objectId;
                return item;
            });

            let updatedScores = await this.backendService.addOrUpdateList('SportScore', sportScores);
            if (!_.isEmpty(deletedItems)) {
                await this.backendService.deleteList('SportScore', deletedItems);
            }

            updatedEvent.sportScores = updatedScores;

            // 自动统计抽考和训练时登记的个人体育成绩
            if (assessEvent.assessMethod !== AssessMethod.Normal) {
                this.updateScoreRank(assessEvent.assessment)
                    .then(done => console.log('updateScoreRank result ', done))
                    .catch(e => {
                        console.error('updateScoreRank exception ', e)
                    });
            }

            // 添加操作记录
            await this.backendService.addOperateRecord({
                tblName: 'AssessEvent',
                targetId: updatedEvent.objectId,
                operateType: assessEvent.objectId ? '修改' : '创建',
                description: ''
            });

            return updatedEvent;
        } catch (exception) {
            console.log(`addOrUpdateSportEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updateScoreRank(assessment) {
        try {
            if (_.isEmpty(assessment)) throw '请制定考核事件';

            let objectId = assessment.objectId || assessment;
            let result = await Client.Cloud.run('updateScoreRank', {assessment: {objectId}}, this.backendService.options);

            return result.done;
        } catch (exception) {
            console.log(`updateScoreRank failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getSoldierOptionsForShape(assessEvent) {
        try {
            const {assessment, organization} = assessEvent;

            let soldiers = [];
            if (assessment.assessMethod != AssessMethod.Sampling) {
                soldiers = await this.backendService.soldierService.getAllLocalSoldiers(organization);
                soldiers = _.sortBy(soldiers, ['organization.orgCode', 'organization.displayName', 'positionCode', 'enlistedAt']);
            } else {
                if (!_.isEmpty(assessment.assessTargets)) {
                    // soldiers = assessment.assessTargets.map(item => item.soldier);
                    assessment.assessTargets.map(item => soldiers.push(...item.soldiers));
                }
            }
            return _.differenceWith(soldiers, assessEvent.physicalShapes, (a, b) => a.objectId === (b.soldier||{}).objectId);
        } catch (exception) {
            console.log(`getSoldierOptionsForShape failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addSoldierForShape(assessEvent, soldier) {
        try {
            const {assessment} = assessEvent;
            let displayOrg = undefined;
            if (!_.isEmpty(assessment.assessTargets)) {
                let found = assessment.assessTargets.find(item => (item.soldier||{}).objectId === soldier.objectId);
                displayOrg = (found||{}).organization;
            }

            let physicalShape = {
                year: assessEvent.date.getFullYear(),
                date: assessEvent.date,
                organization: soldier.organization,
                orgCode: soldier.organization.orgCode,
                displayOrg,
                displayOrgCode: (displayOrg||{}).orgCode,
                soldier: soldier,
                age: moment(assessEvent.date).diff(soldier.person.birthday, 'years'),
                gender: soldier.person.gender,
                cardId: soldier.person.cardId,
                position: soldier.position,
                positionCode: soldier.positionCode,
                rankCode: soldier.rankCode,
                enlistedAt: soldier.enlistedAt,
                isCommander: soldier.isCommander,
                isMaster: soldier.isMaster,

                height: soldier.person.height,
                weight: 0,
                bmi: 0,
                pbf: 0,

                scoreCriteria: ScoreCriteria.Level2.name,
                score: 0
            };
            if (!_.isEmpty(assessEvent.deletedItems)) {
                const index = assessEvent.deletedItems.findIndex(item => item.soldier.objectId === soldier.objectId);
                if (index >= 0) {
                    physicalShape = assessEvent.deletedItems.splice(index, 1)[0];
                }
            }

            assessEvent.physicalShapes.push(physicalShape);
            assessEvent.physicalShapes = _.sortBy(assessEvent.physicalShapes, ['orgCode', 'organization.displayName', 'positionCode', 'enlistedAt']);

            return assessEvent;
        } catch (exception) {
            console.log(`addSoldierForShape failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async removeSoldierForShape(assessEvent, soldierId) {
        try {
            let index = assessEvent.physicalShapes.findIndex(item => item.soldier.objectId === soldierId);
            const deletedItem = assessEvent.physicalShapes.splice(index, 1);

            assessEvent.deletedItems = (assessEvent.deletedItems||[]).concat(deletedItem);

            return assessEvent;
        } catch (exception) {
            console.log(`removeSoldierForShape failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 批量登记体型数据时，先获取初始数据
    async getInitPhysicalShapes({assessment, organization, date}) {
        try {
            let organizer = assessment.organization;
            let assessMethod = assessment.assessMethod;
            if (!date) date = assessment.date;

            if (_.isString(organizer)) {
                organizer = await this.backendService.fetchItem('Organization', organizer);
            }

            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) throw '所选单位找不到';

            let query = new Client.Query(Client.PhysicalShape);
            query.equalTo('date', date).addDescending('date');
            query.addAscending('orgCode');
            // 查询当天是否已经登记过
            let result = await this.backendService.queryListByOrganization({className: 'PhysicalShape', query, organization, withLocal:true});

            let assessEvent = {
                assessment,
                organization,
                organizer,
                assessMethod,
                date,
                year: moment(date).year(),
                courseName: AssessCourseCategory.Shape,
                orgCode: organization.orgCode,
                isMakeup: false,
                state: 0,
                scoreSriteria: ScoreCriteria.Level2.name,

                category: AssessCourseCategory.Shape,

                score: ScoreLevel.Pass,
                total: 0,
                passCount: 0,
                passRate: 0,
                unpassCount: 0,
                unpassRate: 0,
                goodCount: 0,
                goodRate: 0,
                excellentCount: 0,
                excellentRate: 0,
            };

            let soldiers = [];
            if (assessment.assessMethod != AssessMethod.Sampling) {
                soldiers = await this.backendService.soldierService.getAllLocalSoldiers(organization);
                soldiers = _.sortBy(soldiers, ['organization.orgCode', 'organization.displayName', 'positionCode']);
            } else {
                if (!_.isEmpty(assessment.assessTargets)) {
                    soldiers = assessment.assessTargets.map(item => item.soldier);
                }
            }

            assessEvent.physicalShapes = soldiers.map(soldier => {
                let found = result.list.find(item => item.soldier.objectId === soldier.objectId);
                if (found) return found;

                let displayOrg = undefined;
                if (!_.isEmpty(assessment.assessTargets)) {
                    let found = assessment.assessTargets.find(item => (item.soldier||{}).objectId === soldier.objectId);
                    displayOrg = (found||{}).organization;
                }

                return {
                    year: date.getFullYear(),
                    date: date,
                    organization: soldier.organization,
                    orgCode: soldier.organization.orgCode,
                    displayOrg,
                    displayOrgCode: (displayOrg||{}).orgCode,
                    soldier: soldier,
                    age: moment(date).diff(soldier.person.birthday, 'years'),
                    gender: soldier.person.gender,
                    cardId: soldier.person.cardId,
                    position: soldier.position,
                    positionCode: soldier.positionCode,
                    rankCode: soldier.rankCode,
                    enlistedAt: soldier.enlistedAt,
                    isCommander: soldier.isCommander,
                    isMaster: soldier.isMaster,

                    height: soldier.person.height,
                    weight: 0,
                    bmi: 0,
                    pbf: 0,

                    scoreCriteria: ScoreCriteria.Level2.name,
                    score: 0
                }
            });

            console.log('getInitPhysicalShapes', assessEvent);

            return assessEvent;
        } catch (exception) {
            console.log(`getInitPhysicalShapes failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addOrUpdatePhysicalShapes(assessEvent) {
        try {
            let physicalShapes = assessEvent.physicalShapes;
            let deletedItems = assessEvent.deletedItems;
            delete assessEvent.physicalShapes;
            delete assessEvent.deletedItems;

            deletedItems = (deletedItems||[]).filter(item => item.objectId);

            let updatedEvent = await this.backendService.addOrUpdateItem('AssessEvent', assessEvent);
            physicalShapes = physicalShapes.map(item => {
                item.assessEvent = updatedEvent.objectId;
                return item;
            });

            let updatedScores = await this.backendService.addOrUpdateList('PhysicalShape', physicalShapes);
            if (!_.isEmpty(deletedItems)) {
                await this.backendService.deleteList('PhysicalShape', deletedItems);
            }

            updatedEvent.physicalShapes = updatedScores;

            // 添加操作记录
            await this.backendService.addOperateRecord({
                tblName: 'AssessEvent',
                targetId: updatedEvent.objectId,
                operateType: assessEvent.objectId ? '修改' : '创建',
                description: ''
            });

            return updatedEvent;
        } catch (exception) {
            console.log(`addOrUpdatePhysicalShapes failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据objectId获取完整的体型登记表
    async getPhysicalShapeDetails(assessEvent) {
        try {
            if (_.isString(assessEvent)) {
                assessEvent = await this.backendService.fetchItem('AssessEvent', assessEvent);
            }

            let query = new Client.Query(Client.PhysicalShape);
            query.equalTo('assessEvent', this.backendService.getParseObject('AssessEvent', assessEvent.objectId));
            query.addAscending('orgCode');
            let result = await this.backendService.queryListAll('PhysicalShape', query);

            assessEvent.physicalShapes = result.list;
            assessEvent.physicalShapes = _.sortBy(assessEvent.physicalShapes, ['organization.orgCode', 'organization.displayName', 'positionCode'])

            return assessEvent;
        } catch (exception) {
            console.log(`getPhysicalShapeDetails failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deletePhysicalShapes(assessEvent) {
        try {
            // const currOrg = this.backendService.getCurrentOrganization();

            // if (_.isString(assessEvent)) {
            //     assessEvent = await this.backendService.fetchItem('AssessEvent', assessEvent);
            // }

            // if (currOrg && assessEvent.organizer && assessEvent.organizer.objectId != currOrg.objectId) throw '无权限删除其他单位创建的体型成绩登记表';

            let query = new Client.Query(Client.PhysicalShape);
            query.equalTo('assessEvent', this.backendService.getParseObject('AssessEvent', assessEvent.objectId));
            let result = await this.backendService.queryListAll('PhysicalShape', query);
            const physicalShapes = result.list;

            await this.backendService.deleteItem('AssessEvent', assessEvent);
            if (_.isEmpty(physicalShapes)) return;

            await this.backendService.deleteList('PhysicalShape', physicalShapes);
        } catch (exception) {
            console.log(`deletePhysicalShapes failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 单个登记体型数据时，先获取初始数据
    // async getInitPhysicalShape(soldier, date) {
    //     try {
    //         if (_.isString(soldier)) {
    //             soldier = await this.backendService.fetchItem('Soldier', soldier);
    //         }
    //         if (_.isEmpty(soldier)) throw '所选人员信息找不到';
    //
    //         date = new Date(date.getFullYear, date.getMonth(), date.getDate());
    //
    //         let query = new Client.Query(Client.PhysicalShape);
    //         query.equalTo('date', date).addDescending('date');
    //         query.equalTo('soldier', this.backendService.getParseObject('Soldier', soldier.objectId));
    //
    //         // 查询当天是否已经登记过
    //         let result = await this.backendService.queryListByOrganization({className: 'PhysicalShape', query, organization, withLocal:true});
    //         if (!_.isEmpty(result.list)) return result.list[0];
    //
    //         return {
    //             year: date.getFullYear(),
    //             date: date,
    //             organization: soldier.organization,
    //             orgCode: soldier.organization.orgCode,
    //             soldier: soldier,
    //             age: moment(date).diff(soldier.person.birthday, 'years'),
    //             gender: soldier.person.gender,
    //             cardId: soldier.person.cardId,
    //             position: soldier.position,
    //             positionCode: soldier.positionCode,
    //             rankCode: soldier.rankCode,
    //             enlistedAt: soldier.enlistedAt,
    //             isCommander: soldier.isCommander,
    //             isMaster: soldier.isMaster,
    //
    //             height: soldier.person.height,
    //             weight: 0,
    //             bmi: 0,
    //             pbf: 0,
    //
    //             scoreCriteria: ScoreCriteria.Level2.name,
    //             score: 0
    //         };
    //     } catch (exception) {
    //         console.log(`getInitPhysicalShape failed! exception:${exception}`);
    //         let result = parseUtils.getErrorMessage(exception);
    //         if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
    //         throw result;
    //     }
    // }

    calcBMI(height, weight) {
        let result = weight/Math.pow((height/100), 2);
        return +result.toFixed(1);
    }

    async evaluateShapeScore(soldier, bmi, pbf) {
        try {
            if (_.isEmpty(this.bmiStandards)) {
                this.bmiStandards = await this._fetchRule('BMIStandard');
            }
            if (_.isEmpty(this.pbfStandards)) {
                this.pbfStandards = await this._fetchRule('PBFStandard');
            }

            let date = this.backendService.getSystemTime();
            if (_.isEmpty(soldier.person.name)) {
                soldier.person = await this.backendService.fetchItem('Person', soldier.person.objectId);
            }

            let age = moment(date).diff(moment(soldier.person.birthday), 'years');
            let gender = soldier.person.gender;
            let bmiStandard = this.bmiStandards.find(item => {
                return item.gender===gender && (age>=item.ageRange.from&&age<=item.ageRange.to) && (bmi>=item.bmiRange.from&&bmi<=item.bmiRange.to);
            });

            if (bmiStandard) {
                return ScoreLevel.Pass;
            } else {
                let pbfStandard = this.pbfStandards.find(item => {
                    return item.gender===gender && (age>=item.ageRange.from&&age<=item.ageRange.to) && (pbf>=item.pbfRange.from&&pbf<=item.pbfRange.to);
                });
                if (pbfStandard) return ScoreLevel.Pass;
            }

            return ScoreLevel.Unpass;
        } catch (exception) {
            console.log(`calcShapeScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 查看对应年度最后的体型数据
    async getLatestPhysicalShapes(organization, year) {
        try {
            let query = new Client.Query(Client.PhysicalShape);
            query.equalTo('year', year).addDescending('date');
            let result = await this.backendService.queryListByOrganization({className: 'PhysicalShape', query, organization, withLocal:true});
            let personScores = result.list;
            personScores = _.uniqWith(personScores, (a, b) => a.soldier.objectId === b.soldier.objectId);

            return personScores;
        } catch (exception) {
            console.log(`getLatestPhysicalShapes failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 一键批量自动生成或更新对应单位下的所有个人年度体育成绩表
    async updatePersonSportAnnualScores(organization, assessMethod=AssessMethod.Normal) {
        try {
            let orgId = organization.objectId&&organization;

            let result = await Client.Cloud.run('updatePersonSportAnnualScores', {organization: orgId, assessMethod}, this.backendService.options);
            return result.done;
        } catch (exception) {
            console.log(`updatePersonSportAnnualScores failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 自动生成或更新每个人员的个人年度体育成绩表
    async updatePersonSportAnnualScore(soldier) {
        try {
            let soldierId = soldier.objectId&&soldier;

            let result = await Client.Cloud.run('updatePersonSportAnnualScore', {soldier: soldierId}, this.backendService.options);

            result = await this.backendService.fetchItem('PersonSportAnnualScore', result);
            return result;
        } catch (exception) {
            console.log(`updatePersonSportAnnualScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updateOrgSportAnnualScores(organization) {
        try {
            let organizationId = organization.objectId&&organization;

            let result = await Client.Cloud.run('updateOrgSportAnnualScores', {organization: organizationId}, this.backendService.options);
            // result = await this.backendService.fetchItem('OrgSportAnnualScore', result.objectId);
            // console.log('updateOrgSportAnnualScores', result);
            return result.done;
        } catch (exception) {
            console.log(`updateOrgSportAnnualScores failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async updateTroopSportAnnualScore(organization) {
        try {
            let organizationId = organization.objectId&&organization;

            let result = await Client.Cloud.run('updateTroopSportAnnualScore', {organization: organizationId}, this.backendService.options);

            result = await this.backendService.fetchItem('TroopSportAnnualScore', result.objectId);
            return result;
        } catch (exception) {
            console.log(`updateTroopSportAnnualScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async _getSportScoreStandards(course) {
        const courseId = course&&course.objectId || course;
        const parseCourse = this.backendService.getParseObject('Course', courseId);
        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);

        let query = new Client.Query(Client.SportScoreStandard);
        query.matchesQuery('standard', standardQuery);
        query.equalTo('course', parseCourse);
        let result = await this.backendService.queryListAll('SportScoreStandard', query);

        return result.list;
    }

    _findScoreStandard(date, standards, soldier, mainOrg) {
        let options = standards.filter(standard => {
            if (standard.scoreTarget === ScoreTarget.Individual &&
                standard.physicalLevels.includes(soldier.physicalLevel) &&
                standard.troopCategories.includes(soldier.troopCategory) &&
                standard.gender===(soldier.person||{gender:'男'}).gender &&
                standard.isCivilServant === soldier.isCivilServant) {
                return true;
            }
        });

        if (options.length>1) {
            if (mainOrg.height >= 2000) {
                let result = options.find(item =>
                    item.isHighland && mainOrg.height>=item.heightRange.from &&
                    mainOrg.height<=item.heightRange.to
                );
                if (result) return result;
            }
            return options.find(item => !item.isHighland);
        } else {
            return options[0];
        }
    }

    _findAssessReq(date, requires, soldier) {
        return requires.find(req => {
            let found = false;
            if (_.indexOf(req.physicalLevels, soldier.physicalLevel||'二类人员')>=0 &&
                _.indexOf(req.troopCategories, soldier.troopCategory||'地面人员')>=0 &&
                _.indexOf(req.genders, soldier.person.gender)>=0 &&
                (req.isCivilServant || !soldier.isCivilServant)) {
                if (req.ageEnabled) {
                    const age = moment(date).diff(soldier.person.birthday, 'years');
                    return _.isEmpty(req.ageCondition) ||
                        (age>=req.ageCondition.fromAge && age<=req.ageCondition.toAge);
                } else {
                    return true;
                }
            }
        });
    }

    _findSportGroup(groups, soldier) {
        if (soldier.isCivilServant === true) return [];

        return groups.find(group => {
            return group.physicalLevel===soldier.physicalLevel &&
                group.troopCategory===soldier.troopCategory &&
                group.gender===soldier.person.gender;
        });
    }

    async _getTestReqByCourse(course) {
        let ret = {};
        // 查询通用课目列表
        const courseId = course&&course.objectId || course;
        const parseCourse = this.backendService.getParseObject('Course', courseId);
        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);

        let query = new Client.Query(Client.SportAssessReq);
        query.matchesQuery('standard', standardQuery);
        query.equalTo('course', parseCourse);
        let result = await this.backendService.queryListAll('SportAssessReq', query);
        if (!_.isEmpty(result.list)) {
            ret.requires = result.list;
        }

        // 查询专项考核课目列表
        query = new Client.Query(Client.SportCourseGroup);
        query.matchesQuery('standard', standardQuery);
        query.equalTo('courses', parseCourse);
        result = await this.backendService.queryListAll('SportCourseGroup', query);
        if (!_.isEmpty(result.list)) {
            ret.optionals = result.list;
        }

        return ret;
    }

    // 检查对应的成绩登记表是否已经存在
    async _checkSportEvent({organization, assessMethod, date, course}) {
        try {
            // 普考成绩每年录入一次
            let moment = moment(date);
            let startMoment = moment.startOf('year');
            if (assessMethod !== AssessMethod.Normal) {
                startMoment = moment.subtract(7, 'days');
            }

            let query = new Client.Query(Client.AssessEvent);
            query.equalTo('assessMethod', assessMethod);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.equalTo('courseName', course.name);
            query.greaterThan('date', startMoment.toDate());

            let result = await this.backendService.queryListAll('AssessEvent', query);
            return !_.isEmpty(result.list);
        } catch (exception) {
            console.log(`_checkSportEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
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

    async _fetchDatas() {
        if (_.isEmpty(this.personScoreStandards)) {
            this.personScoreStandards = await this._fetchRule('PersonSportScoreStandard');
        }
        if (_.isEmpty(this.bmiStandards)) {
            this.bmiStandards = await this._fetchRule('BMIStandard');
        }
        if (_.isEmpty(this.pbfStandards)) {
            this.pbfStandards = await this._fetchRule('PBFStandard');
        }

        let standardQuery = new Client.Query(Client.TrainStandard);
        standardQuery.equalTo('state', StandardState.Using);

        // 查询通用课目列表
        if (_.isEmpty(this.sportAssessReqs)) {
            let query = new Client.Query(Client.SportAssessReq);
            query.matchesQuery('standard', standardQuery);
            let result = await this.backendService.queryListAll('SportAssessReq', query);
            this.sportAssessReqs = result.list;
        }

        // 查询专项考核课目列表
        if (_.isEmpty(this.sportCourseGroups)) {
            let query = new Client.Query(Client.SportCourseGroup);
            query.matchesQuery('standard', standardQuery);
            let result = await this.backendService.queryListAll('SportCourseGroup', query);
            this.sportCourseGroups = result.list;
        }

        // 查询所有体育课目
        // if (_.isEmpty(this.sportCourses)) {
        //     let query = new Client.Query(Client.SportCourse);
        //     query.matchesQuery('standard', standardQuery);
        //     let result = await this.backendService.queryListAll('SportCourse', query);
        //     this.sportCourses = result.list;
        // }
    }

    async getSportCalculateStatus(organizer,assessMethod){
        try {
            let query = new Client.Query(Client.SportCalculateStatus);
            query.equalTo('organizer', this.backendService.getParseObject('Organization', organizer.objectId || organizer));
            query.equalTo('assessMethod', assessMethod);
            let result = await this.backendService.queryListAll('SportCalculateStatus', query);
            let status = result.list[0];
            if(!_.isEmpty(status)) {
                if (this.backendService.systemTime.getTime()- new Date(status.updatedAt).getTime() < 120 * 1000){
                    return status;
                } else {
                    if (status.soldiersTotalNum === status.solvedNum) {
                        status.soldiersTotalNum = status.solvedNum = 0;
                    } else {
                        status = {error: '服务器数据异常，请重新生成抽考成绩'};
                    }
                }
            }
            return status;
        }catch (exception) {
            console.log(`getSportCalculateStatus failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getPersonAnnualSportScore(organizer,queryChildOrg,query){
        try {
            if(!query) {
                query = new Client.Query(Client.PersonSportAnnualScore);
            }
            query.equalTo('organizer', this.backendService.getParseObject('Organization', organizer.objectId || organizer));
            let queryOrg = new Client.Query(Client.Organization);
            queryOrg.equalTo('parentIds', queryChildOrg.objectId || queryChildOrg);
            query.matchesQuery('organization', queryOrg);
            query.ascending('positionCode');
            let result = await this.backendService.queryListAll('PersonSportAnnualScore', query);
            return result;
        }catch (exception) {
            console.log(`getPersonAnnualSportScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
}

export default SportService;
