import Client from '../Client';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';
import { OrgSequence, OrgSequences, AssessCourseCategory, InServiceStatus, AssessMethod, ScoreCriteria, OrgType, ScoreLevel, StandardState, PersonProperty, CourseState } from '../Constants';
import moment from 'moment';
import SportService from "./SportService";

export class AssessEventService {
    constructor(backend) {
        this.backendService = backend;
        this.sportService = new SportService(backend);

        this.orgCourseScoreRules = [];
        this.multipleTargetScoreRules = [];
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

            if (organization.orgSequence >= OrgSequence.Battalion) {
                let localOrgs = await this.backendService.orgService.getLocalOrganizations(organization);
                if (_.isEmpty(localOrgs)) return list;

                let diffOrgs = localOrgs.filter(item => item.orgCategory !== organization.orgCategory);
                diffOrgs = _.uniqBy(diffOrgs, 'orgCategory');
                if (!_.isEmpty(diffOrgs)) list = list.concat(diffOrgs);
            }

            return list;
        } catch (exception) {
            console.log(`getAvailableOrgs failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取下级考核等级表请调用queryListByOrganization, 本级登记表请调用queryListByOrganizationLocal

    // 根据成绩表单中的训练单元类型（即编制序列类型），获取可选课目类别(trainUnit=OrgSequence)
    async getOptionalCourses(organization, trainUnit) {
        try {
            if (_.isEmpty(organization)) return [];
            organization = organization.objectId||organization;
            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) return [];
            const sequenceItem = OrgSequences.find(item => item.type === trainUnit);
            if (!sequenceItem) return [];

            let courseList = [];
            const allcourses = await this.backendService.courseService.getTrainCoursesByOrgWithLocal(organization);
            const trainUnitStr = sequenceItem.name;
            let otherCourses = await this.backendService.courseService.getTrainCoursesByOrgWithLocal({orgCategory: '后勤分队', orgType: '分队'});
            otherCourses = otherCourses.filter(item => item.trainUnits&&(item.trainUnits.findIndex(item => item === trainUnitStr)>=0));

            if (organization.orgSequence < OrgSequence.Battalion) {
                // 支队或总队
                if (trainUnit === OrgSequence.Soldier) {
                    courseList = allcourses.filter(item => !(item.name.startsWith('战术')||item.name.endsWith('演习')));
                } else {
                    courseList = allcourses.filter(item => (item.name.startsWith('战术')||item.name.endsWith('演习')));
                }
            } else if (organization.orgSequence === OrgSequence.Battalion) {
                // 大队，只获取警官课目
                courseList = allcourses.filter(item =>
                    item.personProperties&&item.personProperties.length===1&&item.personProperties[0]===PersonProperty.Officer
                );
                courseList = courseList.concat(otherCourses);
            } else {
                // 大队以下
                courseList = allcourses.filter(item => item.trainUnits&&(item.trainUnits.findIndex(item => item === trainUnitStr)>=0));
                courseList = courseList.concat(otherCourses);
            }
            courseList = courseList.filter(item => item.name !== '机动');

            return courseList;
        }  catch (exception) {
            console.log(`getOptionalCourses failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据所选课目，查询可任教该课目的所有教练员列表
    async getTrainersByCourse(course) {
        try {
            if (_.isEmpty(course)) return [];

            let list = [];
            let organization = this.backendService.getCurrentOrganization();

            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) return list;
            const courseId = course.objectId || course;

            let localOrgs = undefined;
            if (organization.orgSequence < OrgSequence.Battalion) {
                // 支队或总队, 获取机关的教练员列表
                localOrgs = await this.backendService.orgService.getLocalOrganizations(organization);
            } else {
                // 大队及以下，获取分队的教练员列表
            }

            let query1 = new Client.Query(Client.Trainer);
            let query2 = new Client.Query(Client.Trainer);
            let parseCourse = this.backendService.getParseObject('Course', courseId);
            query1.equalTo('inserviceStatus', InServiceStatus.InService)
                .equalTo('availableCourses', parseCourse);
            query2.equalTo('inserviceStatus', InServiceStatus.InService)
                .equalTo('availableAssistCourses', parseCourse);
            if (!_.isEmpty(localOrgs)) {
                localOrgs = localOrgs.map(item => this.backendService.getParseObject('Organization', item.objectId));
                query1.containedIn('organization', localOrgs);
                query2.containedIn('organization', localOrgs);
            }

            let compoundQuery = Client.Query.or(query1, query2);
            const result = await this.backendService.queryListAll('Trainer', compoundQuery);

            return result;
        }  catch (exception) {
            console.log(`getTrainersByCourse failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 检查是不是单兵课目
    _isSoldierCourse(course) {
        if (_.isEmpty(course)) return false;
        if (_.isEmpty(course.trainUnits)) {
            return !(course.name && (course.name.startsWith('战术')||course.name.endsWith('演习')))
        } else {
            return (course.trainUnits.findIndex(item=>item === '单兵')>=0);
        }
    }

    async _getSoldiersByCourse(organization, course) {
        try {
            // let isRootOrg = false;
            let curOrg = this.backendService.getCurrentOrganization();
            let curOrgId = (curOrg&&curOrg.objectId) || curOrg;
            // 如果没有传入单位，则使用当前根单位
            if (!organization) organization = curOrg;
            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) return [];
            // 如果查询根单位下的课目，则不需要单位检索条件
            // if (organization.objectId === curOrgId) isRootOrg = true;

            if (_.isString(course)) {
                course = await this.backendService.fetchItem('Course', course);
            }
            if (_.isEmpty(course)) return [];
            if(!this._isSoldierCourse(course)) return [];

            let personProperties = course.personProperties;
            let orgCategories = course.orgCategories||[];
            let majorReqs = _.isEmpty(course.majorReq)?[]:[course.majorReq];
            let rankL2Reqs = course.rankL2Reqs;
            let gunnerType = course.gunnerType;

            let query = new Client.Query(Client.CourseTime);
            query.equalTo('courses', this.backendService.getParseObject('Course', course.objectId));
            let result = await this.backendService.queryListAll('CourseTime', query);
            if (!_.isEmpty(result.list)) {
                let tmpMajors = result.list.map(item => item.major).filter(item => !_.isEmpty(item));
                if (!_.isEmpty(tmpMajors)) majorReqs = tmpMajors;
            }

            let soldierQuery = new Client.Query(Client.Soldier);
            // if (!isRootOrg || (isRootOrg && organization.orgSequence < OrgSequence.Battalion))
            {
                let queryOrg = new Client.Query(Client.Organization);
                queryOrg.equalTo('parentIds', organization.objectId);
                // 支队或总队只需查出本级首长机关的人员
                if (organization.orgSequence < OrgSequence.Battalion) {
                    queryOrg.equalTo('orgSequence', organization.orgSequence);
                    orgCategories.push(organization.orgCategory);
                }
                // 要满足单位分类条件
                if (!_.isEmpty(orgCategories)) {
                    queryOrg.containedIn('orgCategory', orgCategories);
                }

                soldierQuery.matchesQuery('organization', queryOrg);
            }
            // 查出课目要求的人员属性的人员
            if (!_.isEmpty(personProperties)) {
                soldierQuery.containedIn('personProperty', personProperties);
            }

            soldierQuery.equalTo('inserviceStatus', InServiceStatus.InService);
            soldierQuery.addAscending('orgCode').addAscending('positionCode');

            result = await this.backendService.queryListAll('Soldier', soldierQuery);

            let soldiers = result.list;
            if (!orgCategories.includes('后勤分队')) {
                soldiers = result.list.filter(item => orgCategories.includes(item.organization.orgCategory));

                // 按专业进行过滤
                if (!_.isEmpty(majorReqs)) {
                    soldiers = soldiers.filter(item => item.personProperty === PersonProperty.Officer || (!_.isEmpty(item.majorType) && majorReqs.includes(item.majorType)));
                }
                // 按枪手类型进行过滤
                if (!_.isEmpty(gunnerType)) {
                    soldiers = soldiers.filter(item => item.personProperty === PersonProperty.Officer || item.gunnerType === gunnerType);
                }
                // 按军衔过滤
                if (!_.isEmpty(rankL2Reqs)) {
                    soldiers = soldiers.filter(item => item.personProperty === PersonProperty.Officer || rankL2Reqs.findIndex(rank => rank===item.rank)>=0);
                }
            } else {
                // 按专业进行过滤
                if (!_.isEmpty(majorReqs)) {
                    soldiers = soldiers.filter(item => (!_.isEmpty(item.majorType) && majorReqs.includes(item.majorType)));
                }
                // 按枪手类型进行过滤
                if (!_.isEmpty(gunnerType)) {
                    soldiers = soldiers.filter(item => item.gunnerType === gunnerType);
                }
                // 按军衔过滤
                if (!_.isEmpty(rankL2Reqs)) {
                    soldiers = soldiers.filter(item => rankL2Reqs.findIndex(rank => rank===item.rank)>=0);
                }
            }

            return soldiers;
        } catch (exception) {
            console.log(`_getSoldiersByCourse failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 检查对应的成绩登记表是否已经存在
    async checkAssessEvent({organization, assessMethod, date, course, testContent}) {
        try {
            // 普考成绩每年录入一次
            let momentDate = moment(date);
            let startMoment = momentDate.startOf('year');
            if (assessMethod !== AssessMethod.Normal) {
                startMoment = momentDate.subtract(7, 'days');
            }

            let query = new Client.Query(Client.AssessEvent);
            query.equalTo('assessMethod', assessMethod);
            query.equalTo('organization', this.backendService.getParseObject('Organization', organization.objectId));
            query.equalTo('course', this.backendService.getParseObject('Course', course.objectId));
            query.greaterThan('date', startMoment.toDate());

            let result = await this.backendService.queryList('AssessEvent', query);
            if (_.isEmpty(result.list)) {
                return undefined;
            } else {
                const index = result.list.findIndex(item => ((_.isEmpty(testContent)&&_.isEmpty(item.testContent))||testContent===item.testContent));
                return index >= 0 ? result.list[index] : undefined;
            }
        } catch (exception) {
            console.log(`checkAssessEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async getSoldierOptions(assessEvent) {
        try {
            const {organization, course} = assessEvent;

            let soldiers = await this._getSoldiersByCourse(organization, course);

            return _.differenceWith(soldiers, assessEvent.personScores, (a, b) => a.objectId === (b.soldier||{}).objectId);
        } catch (exception) {
            console.log(`getSoldierOptions failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async addSoldier(assessEvent, soldier) {
        try {
            let personScore = {
                organization: soldier.organization,
                orgCode: (soldier.organization||{}).orgCode,
                soldier: soldier,
                position: soldier.position,
                positionCode: soldier.positionCode,
                rankCode: soldier.rankCode,
                enlistedAt: soldier.enlistedAt,
                isCommander: soldier.isCommander,
                isMaster: soldier.isMaster,
                score: ScoreLevel.Pass,         // 默认所有人及格
                makeupScore: 0,
                isMakeup: false
            };
            if (!_.isEmpty(assessEvent.deletedItems)) {
                const index = assessEvent.deletedItems.findIndex(item => item.soldier.objectId === soldier.objectId);
                if (index >= 0) {
                    personScore = assessEvent.deletedItems.splice(index, 1)[0];
                }
            }

            assessEvent.personScores.push(personScore);
            assessEvent.personScores = _.sortBy(assessEvent.personScores, ['orgCode', 'organization.displayName', 'positionCode', 'enlistedAt']);

            assessEvent.total++;
            assessEvent.passCount++;

            await this.evaluateAssessEventScore(assessEvent);

            return assessEvent;
        } catch (exception) {
            console.log(`addSoldier failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async removeSoldier(assessEvent, soldierId) {
        try {
            const index = assessEvent.personScores.findIndex(item => item.soldier.objectId === soldierId);
            const deletedItem = assessEvent.personScores.splice(index, 1);

            assessEvent.deletedItems = (assessEvent.deletedItems||[]).concat(deletedItem);

            if (assessEvent.total > 0) assessEvent.total--;

            await this.evaluateAssessEventScore(assessEvent);

            console.log(111, assessEvent)

            return assessEvent;
        } catch (exception) {
            console.log(`removeSoldier failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 生成初始单课目成绩登记表单
    async getInitAssessEvent({assessment, organization, date, course, testContent, trainer}) {
        try {
            let organizer = assessment.organization;
            let assessMethod = assessment.assessMethod;
            if (!date) date = assessment.date;

            if (assessMethod === AssessMethod.Sampling) throw '暂不支持登记抽考军事课目成绩';

            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) throw '考核单位找不到';
            if (_.isString(organizer)) {
                organizer = await this.backendService.fetchItem('Organization', organizer);
            }
            // if (assessMethod === AssessMethod.Sampling && _.isEmpty(organizer)) throw '请设置抽考组织单位';
            // if (assessMethod === AssessMethod.Sampling && organizer.orgSequence>organization.orgSequence) throw '不能对上级单位组织抽考';

            if (_.isString(course)) {
                course = await this.backendService.fetchItem('Course', course);
            }
            if (_.isEmpty(course)) throw '所选课目找不到';
            if (_.isString(trainer)) {
                trainer = await this.backendService.fetchItem('Trainer', trainer);
            }

            // 有考核内容的课目只能登记考核内容的成绩
            if (!_.isEmpty(course.testContents) && _.isEmpty(testContent)) {
                throw `请选择课目${course.name}的考核内容进行成绩登记`;
            }
            // 对于普考课目，检查是否已经登记
            // let existedPersonScores = [];
            // if (assessMethod === AssessMethod.Normal) {
            //     let existed = await this.checkAssessEvent({organization, assessMethod, date, course, testContent});
            //     if (existed) {
            //         let name = course.name;
            //         (!_.isEmpty(testContent)) && (name=`${name}-${testContent}`)
            //         throw `课目${name}的${assessMethod}成绩已经登记过，请不要重复登记`;
            //     }
            // }

            date = date||(this.backendService.getSystemTime());

            let assessEvent = {
                assessment,
                course,
                organization,
                organizer,
                trainer,
                assessMethod,
                date,
                year: moment(date).year(),
                courseName: course.name,
                testContent: testContent,
                trainerLevel: trainer&&trainer.level,
                orgCode: organization.orgCode,
                isMakeup: false,
                state: 0,
                scoreSriteria: course.scoreCriteria,
                category: AssessCourseCategory.Train,

                score: ScoreLevel.Pass,
                total: 0,
                passCount: 0,
                passRate: 0,
                unpassCount: 0,
                unpassRate: 0,
                goodCount: 0,
                goodRate: 0,
                excellentCount: 0,
                excellentRate: 0
            };

            // 构造人员成绩
            let soldiers = await this._getSoldiersByCourse(organization, course);
            soldiers = _.sortBy(soldiers, ['orgCode', 'organization.displayName', 'positionCode', 'enlistedAt']);
            let personScores = soldiers.map(item => {
                // if (!_.isEmpty(existedPersonScores)) {
                //     const found = existedPersonScores.find(ps => (ps.soldier||{}).objectId === item.objectId);
                //     if (found && (found.score >= ScoreLevel.Pass || found.makeupScore >= ScoreLevel.Pass)) return undefined;
                // }

                return {
                    organization: item.organization,
                    orgCode: (item.organization||{}).orgCode,
                    soldier: item,
                    position: item.position,
                    positionCode: item.positionCode,
                    rankCode: item.rankCode,
                    enlistedAt: item.enlistedAt,
                    isCommander: item.isCommander,
                    isMaster: item.isMaster,
                    score: ScoreLevel.Pass,         // 默认所有人及格
                    makeupScore: 0,
                    isMakeup: false,
                    untestedReason: ''
                };
            });

            personScores = personScores.filter(item => !!item);
            assessEvent.total = personScores.length;
            assessEvent.passCount = personScores.length;
            assessEvent.passRate = 100;                 // 及格率100%
            assessEvent.personScores = personScores;

            return assessEvent;
        } catch (exception) {
            console.log(`getInitAssessEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 根据objectId获取完整的AssessEvent
    async getAssessEventDetails(assessEvent) {
        try {
            if (_.isString(assessEvent)) {
                assessEvent = await this.backendService.fetchItem('AssessEvent', assessEvent);
            }

            let query = new Client.Query(Client.PersonScore);
            query.equalTo('assessEvent', this.backendService.getParseObject('AssessEvent', assessEvent.objectId));
            query.addAscending('orgCode').addAscending('positionCode');
			//query.addAscending('orgCode');
            let result = await this.backendService.queryListAll('PersonScore', query);

            assessEvent.personScores = result.list;
			assessEvent.personScores = _.sortBy(assessEvent.personScores, ['orgCode', 'organization.displayName', 'positionCode', 'enlistedAt']);

            return assessEvent;
        } catch (exception) {
            console.log(`getAssessEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async _updateCourseStatus(assessEvent) {
        if (assessEvent.assessMethod != AssessMethod.Normal) return;

        try {
            if (!_.isEmpty(assessEvent.testContent)) {
                let contentCount = (assessEvent.course.testContents||[]).length;

                let query = new Client.Query(Client.AssessEvent);
                query.equalTo('course', this.backendService.getParseObject('Course', assessEvent.course.objectId));
                query.equalTo('organization', this.backendService.getParseObject('Organization', assessEvent.organization.objectId));
                query.greaterThanOrEqualTo('date', moment(assessEvent.date).startOf('year').toDate());
                query.lessThanOrEqualTo('date', moment(assessEvent.date).endOf('year').toDate());
                let result = await this.backendService.queryListAll('AssessEvent', query);
                if (result.total != contentCount+1) return;
            }

            let query = new Client.Query(Client.CourseStatus);
            query.equalTo('course', this.backendService.getParseObject('Course', assessEvent.course.objectId));
            query.equalTo('organization', this.backendService.getParseObject('Organization', assessEvent.organization.objectId));
            query.equalTo('year', moment(assessEvent.date).year());
            let result = await this.backendService.queryListAll('CourseStatus', query);
            let courseStatus = result.list[0];
            if (_.isEmpty(courseStatus)) {
                courseStatus = {
                    year: moment(assessEvent.date).year(),
                    course: assessEvent.course,
                    category: 0,
                    organization: assessEvent.organization,
                    state: CourseState.Finished,
                    needTest: true,
                    startAt: assessEvent.date,
                    endAt: assessEvent.date,
                    hoursInDay: 0,
                    hoursAtNight: 0,
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
            } else {
                if (courseStatus.state === CourseState.Finished) return;

                courseStatus.state = CourseState.Finished;
            }


            await this.backendService.addOrUpdateItem('CourseStatus', courseStatus);
        } catch (exception) {
            console.log(`_updateCourseStatus failed! exception:`, exception);
        }
    }

    // 添加或修改单课目成绩登记表
    async addOrUpdateAssessEvent(assessEvent) {
        try {
            assessEvent = await this.evaluateAssessEventScore(assessEvent);
            let personScores = assessEvent.personScores;
            let deletedItems = assessEvent.deletedItems;
            delete assessEvent.personScores;
            delete assessEvent.deletedItems;

            deletedItems = (deletedItems||[]).filter(item => item.objectId);

            let resultAssessEvent = await this.backendService.addOrUpdateItem('AssessEvent', assessEvent);

            // personScoreGroups.forEach(item => personScores.concat(item.personScores));
            personScores = personScores.map(item => {
                // if (item.objectId) {
                //     item.isMakeup = (item.makeupScore>0);
                // }

                return {
                    objectId: item.objectId,
                    assessEvent: resultAssessEvent.objectId,
                    assessAt: assessEvent.date,
                    course: assessEvent.course,
                    courseName: assessEvent.courseName,
                    testContent: assessEvent.testContent,
                    organization: item.organization,
                    orgCode: item.organization.orgCode,
                    soldier: item.soldier,
                    age: item.soldier.person&&moment(assessEvent.date).diff(item.soldier.person.birthday, 'years'),
                    gender: item.soldier.person&&item.soldier.person.gender,
                    cardId: item.soldier.cardId,
                    departmentPosition: `${item.organization.displayName}${item.soldier.position}`,
                    position: item.soldier.position,
                    positionCode: item.soldier.positionCode,
                    rankCode: item.soldier.rankCode,
                    enlistedAt: item.soldier.enlistedAt,
                    isCommander: item.soldier.isCommander,
                    isMaster: item.soldier.isMaster,
                    assessMethod: assessEvent.assessMethod,
                    scoreCriteria: assessEvent.scoreSriteria,
                    score: item.score,
                    makeupScore: item.makeupScore,
                    isMakeup: item.isMakeup,
                    untestedReason: item.untestedReason
                }
            });

            let resultPersonScores = await this.backendService.addOrUpdateList('PersonScore', personScores);
            if (!_.isEmpty(deletedItems)) {
                await this.backendService.deleteList('PersonScore', deletedItems);
            }

            const soldiers = personScores.map(item => item.soldier);
            let masterEvent = assessEvent;

            // 自动更新主课目成绩
            if (!_.isEmpty(assessEvent.testContent)) {
                masterEvent = await this.updateMasterAssessEvent(assessEvent);
            } else {
                masterEvent = resultAssessEvent;
            }

            // 远程自动更新个人年度成绩以及所属单位年度成绩表（分队或首长机关）
            if (assessEvent.assessMethod === AssessMethod.Normal) {
                this.backendService.scoreService.updatePersonScoresV2(soldiers)
                    .then((done) => {
                        const orgType = assessEvent.organization.orgType;
                        let orgIds = [];
                        if (orgType === OrgType.UnitForce) {
                            personScores.map(item => {
                                orgIds = orgIds.concat(item.organization.parentIds);
                            });
                            orgIds = _.uniq(orgIds);
                        } else {
                            orgIds = [assessEvent.organization.objectId];
                        }

                        return this.backendService.scoreService.updateLocalOrgAnnualScores(orgIds, orgType);
                    })
                    .then((done) =>{})
                    .catch((_) => {});
            }

            // 获取完整数据
            let updatedResult = await this.getAssessEventDetails(resultAssessEvent.objectId);

            // 异步更新对应课目状态，不做同步等待
            this._updateCourseStatus(updatedResult).then(_ => {});

            // 添加操作记录
            await this.backendService.addOperateRecord({
                tblName: 'AssessEvent',
                targetId: resultAssessEvent.objectId,
                operateType: assessEvent.objectId ? '修改' : '创建',
                description: ''
            });

            return updatedResult;
        } catch (exception) {
            console.log(`addOrUpdateAssessEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    async deleteAssessEvent(assessEvent) {
        try {
            // const currOrg = this.backendService.getCurrentOrganization();

            // if (_.isString(assessEvent)) {
            //     assessEvent = await this.backendService.fetchItem('AssessEvent', assessEvent);
            // }

            // if (currOrg && assessEvent.organization && assessEvent.organization.objectId != currOrg.objectId) throw '无权限删除其他单位创建的军事成绩登记表';

            let query = new Client.Query(Client.PersonScore);
            query.equalTo('assessEvent', this.backendService.getParseObject('AssessEvent', assessEvent.objectId));
            let result = await this.backendService.queryListAll('PersonScore', query);
            const personScores = result.list;

            await this.backendService.deleteItem('AssessEvent', assessEvent);
            if (_.isEmpty(personScores)) return;

            await this.backendService.deleteList('PersonScore', personScores);

            const soldiers = personScores.map(item => item.soldier);
            // 远程自动更新个人年度成绩以及所属单位年度成绩表（分队或首长机关）
            if (assessEvent.assessMethod === AssessMethod.Normal) {
                this.backendService.scoreService.updatePersonScoresV2(soldiers)
                    .then((done) => {
                        const orgType = assessEvent.organization.orgType;
                        let orgIds = [];
                        if (orgType === OrgType.UnitForce) {
                            personScores.map(item => {
                                orgIds = orgIds.concat(item.organization.parentIds);
                            });
                            orgIds = _.uniq(orgIds);
                        } else {
                            orgIds = [assessEvent.organization.objectId];
                        }

                        return this.backendService.scoreService.updateLocalOrgAnnualScores(orgIds, orgType);
                    })
                    .then((done) =>{})
                    .catch((_) => {});
            }
        } catch (exception) {
            console.log(`deleteAssessEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 自动计算单课目成绩评定, 返回评定成绩score
    async evaluateAssessEventScore(assessEvent, personScores=[]) {
        try {
            if (_.isEmpty(this.orgCourseScoreRules)) {
                let standardQuery = new Client.Query(Client.TrainStandard);
                standardQuery.equalTo('state', StandardState.Using);
                let query = new Client.Query(Client.OrgSingleCourseScoreRule);
                query.matchesQuery('standard', standardQuery);
                query.descending('score')
                const result = await this.backendService.queryListAll('OrgSingleCourseScoreRule', query);
                this.orgCourseScoreRules = result.list;
            }
            if (_.isEmpty(personScores)) {
                personScores = assessEvent.personScores;
                // assessEvent.personScoreGroups.map(item => {
                //     personScores.concat(item.personSco;res);
                // });
            }
            const stats = this._statLevelCount(personScores);
            assessEvent.total = stats.total;
            assessEvent.isMakeup = stats.isMakeup;
            if (stats.isMakeup) {
                assessEvent.passCount = stats.makeup.passCount;
                assessEvent.passRate = stats.makeup.passRate;
                assessEvent.unpassCount = stats.makeup.unpassCount;
                assessEvent.unpassRate = stats.makeup.unpassRate;
                assessEvent.goodCount = stats.makeup.goodCount;
                assessEvent.goodRate = stats.makeup.goodRate;
                assessEvent.excellentCount = stats.makeup.excellentCount;
                assessEvent.excellentRate = stats.makeup.excellentRate;
            } else {
                assessEvent.passCount = stats.normal.passCount;
                assessEvent.passRate = stats.normal.passRate;
                assessEvent.unpassCount = stats.normal.unpassCount;
                assessEvent.unpassRate = stats.normal.unpassRate;
                assessEvent.goodCount = stats.normal.goodCount;
                assessEvent.goodRate = stats.normal.goodRate;
                assessEvent.excellentCount = stats.normal.excellentCount;
                assessEvent.excellentRate = stats.normal.excellentRate;
            }

            let score = this._calcScore(this.orgCourseScoreRules, assessEvent);

            // 军政主官有一人单课目训练成绩不及（合）格，该课目单位成绩降一等
            if (score > ScoreLevel.Unpass) {
                let unpassMasterCount = 0;
                if (!_.isEmpty(personScores)) {
                    personScores.map(personScore => {
                        if (personScore.isMaster && personScore.score<ScoreLevel.Pass && personScore.makeupScore<ScoreLevel.Pass) {
                            unpassMasterCount++;
                        }
                    });
                }

                score -= unpassMasterCount;
                (score<ScoreLevel.Unpass)&&(score=ScoreLevel.Unpass);
            }
            assessEvent.score = score;

            return assessEvent;
        } catch (exception) {
            console.log(`evaluateAssessEventScore failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 统计各个内容的成绩等级数(通过率/良好率/优秀率)
    _statLevelCount(personScores) {
        let filtered = personScores.filter(item => (item.score > 0 && !item.isMakeup) || (item.makeupScore > 0 && item.isMakeup));
        let total = filtered.length;
        let isMakeup = (personScores.findIndex(item => item.isMakeup) >= 0);

        let stats = personScores.reduce((prev, curr) => {
            if (curr.score >= ScoreLevel.Pass) {
                prev.normal.passCount++;
            }
            if (curr.score >= ScoreLevel.Good) {
                prev.normal.goodCount++;
            }
            if (curr.score >= ScoreLevel.Excellent) {
                prev.normal.excellentCount++;
            }

            if (isMakeup) {
                let score = (curr.isMakeup)?curr.makeupScore:curr.score;
                if (score >= ScoreLevel.Pass) {
                    prev.makeup.passCount++;
                }
                if (score >= ScoreLevel.Good) {
                    prev.makeup.goodCount++;
                }
                if (score >= ScoreLevel.Excellent) {
                    prev.makeup.excellentCount++;
                }
            }

            return prev;
        }, {normal:{passCount: 0, goodCount: 0, excellentCount: 0}, makeup:{passCount: 0, goodCount: 0, excellentCount: 0}});

        stats.total = total;
        stats.isMakeup = isMakeup;
        stats.normal.scoreSriteria = ScoreCriteria.Level4.name;
        stats.normal.passRate = +(stats.normal.passCount*100/total).toFixed(2);
        stats.normal.goodRate = +(stats.normal.goodCount*100/total).toFixed(2);
        stats.normal.excellentRate = +(stats.normal.excellentCount*100/total).toFixed(2);
        stats.normal.unpassCount = total-stats.normal.passCount;
        stats.normal.unpassRate = +(stats.normal.unpassCount*100/total).toFixed(2);

        stats.makeup.scoreSriteria = ScoreCriteria.Level4.name;
        stats.makeup.passRate = +(stats.makeup.passCount*100/total).toFixed(2);
        stats.makeup.goodRate = +(stats.makeup.goodCount*100/total).toFixed(2);
        stats.makeup.excellentRate = +(stats.makeup.excellentCount*100/total).toFixed(2);
        stats.makeup.unpassCount = total-stats.makeup.passCount;
        stats.makeup.unpassRate = +(stats.makeup.unpassCount*100/total).toFixed(2);

        return stats;
    }

    async _evaluateMasterPersonScore(masterScore, personScores) {
        if (_.isEmpty(masterScore)||_.isEmpty(personScores)) return masterScore;
        if (_.isEmpty(this.multipleTargetScoreRules)) {
            let standardQuery = new Client.Query(Client.TrainStandard);
            standardQuery.equalTo('state', StandardState.Using);
            let query = new Client.Query(Client.MultipleTargetScoreRule);
            query.matchesQuery('standard', standardQuery);
            query.descending('score');
            const result = await this.backendService.queryListAll('MultipleTargetScoreRule', query);
            this.multipleTargetScoreRules = result.list;
        }

     	// 统计成绩等级数量
        const stats = this._statLevelCount(personScores);

        masterScore.isMakeup = stats.isMakeup;
        // 计算首考成绩
        masterScore.score = this._calcScore(this.multipleTargetScoreRules, stats.normal);
        if (masterScore.isMakeup) {
            // 计算补考成绩
            masterScore.makeupScore = this._calcScore(this.multipleTargetScoreRules, stats.makeup);
        }

        return masterScore;
    }

    // 自动更新主课目成绩登记表
    async updateMasterAssessEvent(assessEvent) {
        try {
            if (!assessEvent.testContent) return undefined;

            let momentDate = moment(assessEvent.date);
            let startMoment = momentDate.startOf('year');
            if (assessEvent.assessMethod !== AssessMethod.Normal) {
                startMoment = momentDate.subtract(7, 'days');
            }

            let query = new Client.Query(Client.PersonScore);
            query.equalTo('courseName', assessEvent.courseName);
			query.equalTo('assessMethod', assessEvent.assessMethod);
            query.greaterThan('assessAt', startMoment.toDate());

            let result = await this.backendService.queryListByOrganization({className: 'PersonScore', query, organization: assessEvent.organization, withLocal:true});

            // 按人员ID分组
			let groupResults = _.groupBy(result.list, (item) => {
                return item.soldier.objectId;
            });

            let masterScores = [];
            let masterAssessEvent = undefined;
            for (let personScores of _.values(groupResults)) {
				// 没有考核内容的成绩为主课目成绩
                if (_.isEmpty(personScores)) continue;
                let masterScore = personScores.find(item => _.isEmpty(item.testContent));
                if (masterScore) {
                    // 主课目成绩已经存在
                    (!masterAssessEvent) && (masterAssessEvent = masterScore.assessEvent);
                    _.remove(personScores, (item) => _.isEmpty(item.testContent));
                    if (_.isEmpty(personScores)) continue;
                } else {
                    // 主课目成绩还未创建，拷贝一个
                    if (!masterAssessEvent) {
                        masterAssessEvent = _.cloneDeep(assessEvent);
                        delete masterAssessEvent.personScores;
                        delete masterAssessEvent.objectId;
                        delete masterAssessEvent.testContent;
                    }

                    masterScore = _.cloneDeep(personScores[0]);
                    delete masterScore.objectId;
                    delete masterScore.testContent;
                }
                masterScore.assessAt = assessEvent.date;
                masterScore.assessEvent = masterAssessEvent.objectId;
                masterAssessEvent.date = assessEvent.date;

                // 去重处理，获取最好成绩
                if (!_.isEmpty(personScores)) {
                    const personScoreGroups = _.groupBy(personScores, 'testContent');
                    personScores = _.toPairs(personScoreGroups).map(groupItem => {
                        return _.maxBy(groupItem[1], ps => _.max([ps.score, ps.makeupScore]));
                    });
                    console.log('after remove duplicated: ', personScores);
                }

                masterScore = await this._evaluateMasterPersonScore(masterScore, personScores);
                masterScores.push(masterScore);
		    }

            // 统计该课目的成绩等级人数
            if (masterAssessEvent) {
                // 自动计算成绩
				masterAssessEvent.isAuto = true;
                masterAssessEvent = await this.evaluateAssessEventScore(masterAssessEvent, masterScores);

                // 批量提交保存
                let resultAssessEvent = await this.backendService.addOrUpdateItem('AssessEvent', masterAssessEvent);
                if (!masterAssessEvent.objectId) {
                    masterScores = masterScores.map(item => {
                        item.assessEvent = resultAssessEvent.objectId;
                        return item;
                    })
                }
                await this.backendService.addOrUpdateList('PersonScore', masterScores);

				return resultAssessEvent;
            }

            return undefined;
        } catch (exception) {
            console.log(`updateMasterAssessEvent failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }



    // 内部使用，计算单位单课目成绩
    _calcScore(rules, stats) {
        if (_.isEmpty(rules)) return 0;

        let score = ScoreLevel.Unpass;
        for (let rule of rules) {
            const existed = rule.conditions.findIndex(item => item.scoreCriteria === stats.scoreSriteria);
            if (existed >= 0) {
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
        }

        return score;
    }


}

export default AssessEventService;
