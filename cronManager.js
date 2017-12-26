var cron = require('node-cron');
var getCurrentDateString = require('./module/utils/dateUtil.js').getCurrentDateString
require('newrelic');

const HR_CRAWLER = [2]
const HR_COUNT = [1]
const HR_POST = [19]
const offset = 12

const converHr = (hrArray) => {
    return hrArray.map( hr => {
        if((hr + offset)>=24) 
            return (offset - (24 - hr))
        else
            return hr + offset
    })
}

console.log(`Cron Manager is ready : `, getCurrentDateString())

cron.schedule(`0 ${HR_POST.toString()} * * *`, function(){
    var shell = require('./module/childProcess/child_helper');
    var commandList = ["npm run postVideo"]
    shell.series(commandList , function(err){
        console.log('Post video job done ... ', getCurrentDateString())
    });
});

cron.schedule(`0 ${HR_COUNT.toString()} * * *`, function(){
    var shell = require('./module/childProcess/child_helper');
    var commandList = ["npm run countPage"]
    shell.series(commandList , function(err){
        console.log('CountPage job done ... ', getCurrentDateString())
    });
});

cron.schedule(`0 ${HR_CRAWLER.toString()} * * 3`, function(){
    var shell = require('./module/childProcess/child_helper');
    var commandList = ["npm run crawler:all DAY"]
    shell.series(commandList , function(err){
        console.log('crawler:all DAY job done ... ', getCurrentDateString())
    });
});

cron.schedule(`0 ${HR_CRAWLER.toString()} * * 0`, function(){
    var shell = require('./module/childProcess/child_helper');
    var commandList = ["npm run crawler:all WEEK"]
    shell.series(commandList , function(err){
        console.log('crawler:all WEEK job done ... ', getCurrentDateString())
    });
});