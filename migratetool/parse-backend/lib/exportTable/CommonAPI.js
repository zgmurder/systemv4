import moment from 'moment'
import {ScoreCriteria2} from 'src/lib/Constants'
import _ from 'lodash'

export default {
    format(date, layout = 'YYYY年MM月DD日') {
        if(!date) return '';
        return date ? moment(date).format(layout) : ''
    },
    handlerReduce(reduceData){
        return reduceData.reduce((prev, cur, index)=>{
            prev.push([0+ (index && prev[index-1][1] || 0), cur.length+ (index && prev[index-1][1] || 0), cur]);
            return prev;
        }, []);
    },
    handlerLevel4Score(Score){
        return Score === 0 ? '' : ScoreCriteria2.Level4.optionalScores[Score];
    },
}
