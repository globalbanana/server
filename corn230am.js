var cron = require('node-cron');
const m = new ( require('js-meter')) ({isPrint: false, isMs: false, isKb: true})

require('newrelic');

console.log('Cron job is ready 2:30am:')

cron.schedule('48 11 * * *', function(){
    var shell = require('./module/childProcess/child_helper');
    var commandList = ["npm run crawler:all"]
    
    shell.series(commandList , function(err){
        const meter = m.stop()        
        console.log('cron job done, it is spent : ' + meter.diffTime + 's')
    });
});
