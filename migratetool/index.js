require('babel-core/register');
const program = require('commander');
const Parse = require('parse/node');
const config = require('./app.config').default;
const Migrator = require('./Migrator').default;

Parse.initialize(config.AppId, config.JsKey, config.MasterKey);
// Parse.User.enableUnsafeCurrentUser();

program
    .version('0.1.0');

program
    .command('all')
    .description('migrate all models from armysystem to armysystemv2')
    .option('-f, --from [ip]', 'set the armysystem parse-server ip address', '127.0.0.1')
    .option('-t, --to [ip]', 'set the armysystemv2 api server ip address', '127.0.0.1')
    .action(function(options) {
        const from = options.from||'';
        const to = options.to||'';

        console.log('Start to migrate all models from ' + from + ' to ' + to);

        Parse.serverURL = `http://${from}:1337/parse`;
        const apiServerBaseURL = `http://${to}:8080/api`;
        migrateAll(apiServerBaseURL);
    });

program.parse(process.argv);


function migrateAll(baseURl) {
    const migrator = new Migrator(baseURl, config);
    migrator.start().then(() => {
        console.log('migrate completely!');
    }).catch(err => {
        console.error('migrate failed with error: ' + err);
    })
}