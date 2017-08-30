var cron = require('node-cron');
require('newrelic');

console.log('Cron job is ready 2:30am:')

cron.schedule('48 11 * * *', function(){
    var shell = require('./module/childProcess/child_helper');
    var commandList = ["npm run crawler:all"]
    shell.series(commandList , function(err){
        console.log('cron job done ...')
    });
});
