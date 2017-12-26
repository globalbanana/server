import {initDB} from './module/dataBase'
import PageModel from './module/dataBase/page'
var shell = require('./module/childProcess/child_helper');
var colors = require('colors');

(async function () {

    initDB()
    var commandConverter = (_urls) => _urls.map(url => 'npm run crawler -- ' + url)

    const _feq = process.argv[2] || 'DAY'
    const field = {feq: _feq}
    const pageList = await PageModel.getList({limit:100}, field)
    const pageNames = pageList.map(_i => _i.fbName)
    const pageFbIds = pageList.map(_i => _i.fbPageId)

    console.log(colors.green(`Going to process ${pageList.length} pages:`))    
    pageList.forEach( (_i, index) => console.log(colors.cyan(`   ${index}.  ${_i.fbName}: ${_i.fbPageId}`)))

    var commandList = commandConverter(pageFbIds)
    
    shell.series(commandList, function (err) {
        //    console.log('executed many commands in a row');
        console.log('done')
        process.exit()
    });
}())

// var urls = require('../../pageId/day.json') var shell =
// require('./child_helper'); var commandConverter = (_urls) => urls.map( url =>
// 'npm run crawler -- ' + url) var commandList = commandConverter (urls)
// shell.series(commandList , function(err){ //    console.log('executed many
// commands in a row');     console.log('done') });