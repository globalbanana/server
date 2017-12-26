// var child_process = require('child_process');

// var url1 = 'https://tw.yahoo.com'
// var url2 = 'https://www.npmjs.com'
// var url3 = 'https://www.waheng.co/'

var urls = require('../../pageId/day.json')

var shell = require('./child_helper');

var commandConverter = (_urls) => urls.map( url => 'npm run crawler -- ' + url)
var commandList = commandConverter (urls)

shell.series(commandList , function(err){
//    console.log('executed many commands in a row'); 
    console.log('done')
});