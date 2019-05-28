import Client from '../Client';
import { ResultCode, RoleId, StandardState, OrgSequence, OrgType, RoleName, InServiceStatus, DayType } from '../Constants';
import parseUtils from '../utils/parseUtils';
import dateUtils from '../utils/dateUtils';
import _ from 'lodash';
import moment from 'moment';

export class HolidayService {
    constructor(backend) {
        this.backendService = backend;
    }

    async getDayType(date, holidays) {
        date = moment(date).hour(0).minute(0).second(0).millisecond(0).toDate();

        if (holidays === undefined) {
            let query = new Client.Query(Client.Holiday);
            query.equalTo('date', date);
            let result = await this.backendService.queryListAll('Holiday', query);
            if (!_.isEmpty(result.list)) {
                return result.list[0].type;
            }
        } else {
            let holiday = holidays.find(item => item.date === date);
            if (holiday) return holiday.type;
        }
        
        return dateUtils.isWeekend(moment(date).weekday())?DayType.Weekend:DayType.Workday;
    }

    async getReportNumber(dateStart, dateEnd) {
        dateStart = moment(dateStart).hour(0).minute(0).second(0).millisecond(0).toDate();
        dateEnd = moment(dateEnd).hour(0).minute(0).second(0).millisecond(0).toDate();
        
        let query = new Client.Query(Client.Holiday);
        query.greaterThanOrEqualTo('date', dateStart);
        query.lessThanOrEqualTo('date', dateEnd);
        let result = await this.backendService.queryListAll('Holiday', query);
        const holidays = result.list;

        let number = 0;
        for (let date = dateStart; date <= dateEnd; date = moment(date).add(1, 'day').toDate()) {
            let dayType = await this.getDayType(date);
            if (dayType === DayType.Workday) number++;
        }

        return number;
    }
}

export default HolidayService;
