import _ from 'lodash';
import { MapRankToLevel1, MapRankToLevel2, MapRankL2ToLevel1 } from '../Constants';

export default {
    makeupCourseName: function(item) {
        if (_.isEmpty(item)) return '';

        let name = `${item.seq}. ${item.name}`;
        (item.personProperties&&item.personProperties.length===1) && (name=`${name}(${item.personProperties[0]})`);
        (item.tasks&&item.tasks.length===1) && (name=`${name}(${item.tasks[0]})`);
        (!_.isEmpty(item.gunnerType)) && (name = `${name}(${item.gunnerType}训)`);
        (!_.isEmpty(item.serviceReq)) && (name = `${name}(${item.serviceReq.join(';')})`);
        (!_.isEmpty(item.majorReq)) && (name = `${name}(${item.majorReq})`);
        (!_.isEmpty(item.major)) && (name = `${name}(${item.major})`);
        
        const courseRanks = item.rankL2Reqs || item.ranks;
        if (!_.isEmpty(courseRanks) && !name.includes('士官')) {
            if (courseRanks.length===1) {
                name=`${name}(${courseRanks[0]})`;
            } else {
                let ranks = _.uniq(courseRanks.map(rank => MapRankToLevel2(rank)));
                if (ranks.length > 2) {
                    ranks = _.uniq(courseRanks.map(rank => MapRankToLevel1(rank)));
                }
                name = `${name}(${ranks.join('、')}训)`
            }
        }

        return name;
    }
}