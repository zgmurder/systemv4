import _ from 'lodash';

export default {
    getHostFromUrl: function(url) {
        let splits1 = url.split('://');
        let splits2 = splits1[1].split('/');
        let splits3 = splits2[0].split(':');
        
        return splits3[0];
    },

    isEqualValue: function(a, b) {
        return (_.isEmpty(a) && _.isEmpty(b)) || _.isEqual(a, b);
    }
}