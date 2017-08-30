var cron = require('node-cron');
require('newrelic');

console.log('Cron job is ready for Every 2 hour:')

cron.schedule('0 */2 * * *', function(){
    var shell = require('./module/childProcess/child_helper');
    var commandList = ["npm run postVideo"]
    shell.series(commandList , function(err){
        console.log('Post video job done ...')
    });
});
