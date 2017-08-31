var cron = require('node-cron');
require('newrelic');

console.log('Cron job is ready at 1,8,10,12,14,16,18,20,22:00 ...')

cron.schedule('0 1,8,10,12,14,16,18,20,22 * * *', function(){
    var shell = require('./module/childProcess/child_helper');
    var commandList = ["npm run postVideo"]
    shell.series(commandList , function(err){
        console.log('Post video job done ...')
    });
});
