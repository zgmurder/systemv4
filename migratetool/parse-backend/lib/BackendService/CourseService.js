import Client from '../Client';
import { ResultCode, RoleId, StandardState, OrgSequence, OrgType, RoleName, InServiceStatus } from '../Constants';
import parseUtils from '../utils/parseUtils';
import _ from 'lodash';

export class CourseService {
    constructor(backend) {
        this.backendService = backend;
    }

    // 获取本单位的所有可训课目, 总部/总队/支队就是首长机关
    async getTrainCoursesByOrgWithLocal(organization) {
        try {

            if (_.isEmpty(organization)) {
                organization = this.backendService.getCurrentOrganization();
            }

            if (_.isString(organization)) {
                organization = await this.backendService.fetchItem('Organization', organization);
            }
            if (_.isEmpty(organization)) return [];

            let orgCategory = organization.orgCategory;
            if (organization.orgType === OrgType.Troop) orgCategory = `${organization.orgCategory}首长机关`;

            let standardQuery = new Client.Query(Client.TrainStandard);
            standardQuery.equalTo('state', StandardState.Using);
            let courseQuery = new Client.Query(Client.TrainCourse);
            courseQuery.matchesQuery('standard', standardQuery);
            courseQuery.equalTo('orgCategories', orgCategory);
            courseQuery.addAscending('createdAt');

            let result = await this.backendService.queryListAll('TrainCourse', courseQuery);

            let courses = result.list;
            // 根据勤务类型过滤掉一些课目
            if (!_.isEmpty(organization.serviceType)) {
                courses = courses.filter(course => {
                    return _.isEmpty(course.serviceReq) || course.serviceReq.includes(organization.serviceType);
                });
            }

            return courses;
        }  catch (exception) {
            console.log(`getTrainCoursesByOrgWithLocal failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }

    // 获取本级单位以下相同编制序列的单位可训课目,总部/总队/支队就是首长机关，大队就是本级，中队包括班排
    async getTrainCoursesByOrgWithAll(organization) {
        try {
            let localOrgs = await this.backendService.orgService.getLocalOrganizations(organization);
            if (_.isEmpty(localOrgs)) return [];

            let orgCategories = _.uniq(localOrgs.map(item => {
                let orgCategory = item.orgCategory;
                if (item.orgType === OrgType.Troop) orgCategory = `${item.orgCategory}首长机关`;
                return orgCategory;
            }));
            let serviceTypes = _.uniq(localOrgs.map(item => item.serviceType));

            if (_.isEmpty(orgCategories)) return [];


            let standardQuery = new Client.Query(Client.TrainStandard);
            standardQuery.equalTo('state', StandardState.Using);

            let courseQuery = new Client.Query(Client['TrainCourse']);
            courseQuery.matchesQuery('standard', standardQuery);
            if (orgCategories.length === 1) {
                courseQuery.equalTo('orgCategories', orgCategories[0]);
            } else {
                courseQuery.containedIn('orgCategories', orgCategories);
            }
            courseQuery.addAscending('createdAt');
            let result = await this.backendService.queryListAll('TrainCourse', courseQuery);
            let courses = result.list;

            // 根据勤务类型过滤掉一些课目
            if (!_.isEmpty(serviceTypes)) {
                courses = courses.filter(course => {
                    if (_.isEmpty(course.serviceReq)) return true;
                    return _.intersection(course.serviceReq, serviceTypes);
                });
            }

            return courses;
        }  catch (exception) {
            console.log(`getTrainCoursesByOrgWithAll failed! exception:${exception}`);
            let result = parseUtils.getErrorMessage(exception);
            if (this.backendService.errorHandler) this.backendService.errorHandler(exception.code, result);
            throw result;
        }
    }
}

export default CourseService;
