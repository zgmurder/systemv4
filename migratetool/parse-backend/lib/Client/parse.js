if(process.env.IS_BROWSER) {
    module.exports = require('parse');
} else {
    module.exports = require('parse/node');
}
