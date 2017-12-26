import {getAccessToken, getVideoDetail} from '../module/facebook';
import {initDB, videoList, videoUpdate} from '../module/dataBase';
import {uploadLocalFile} from '../module/s3';
var colors = require('colors');
const fileNameHelp = require('../module/utils/fileName');
const downloadAPI = require('download-url');

(async function () {
    try {
        initDB()
        await getAccessToken()
        
        const fbId = process.argv[2]
        
        if(!fbId)
            throw new Error('Missed required arg: npm run refetchVideoMp4 fbId');

        const videoObj = (await videoList({},{fbId}))[0]

        if(!videoObj)
            throw new Error('Given fbId is not existed');
                    
        console.log(colors.green(`${videoObj.title} is found, going to refetch video ...`))

        const refetchFbObj = await getVideoDetail(fbId)
        
        const {source} = refetchFbObj
        console.log(colors.green(`Refetch fb object detail ... refetchFbObj: ${JSON.stringify(refetchFbObj)}`))
        
        console.log(colors.green(`Refetch fb object detail ... source: ${source}`))
        
        //*_*_*_*_*_*_*_* download _*_*_*_*_*_*_*_*_
        const path = './download'
        const fileName = fileNameHelp.urlFileName(source)
        console.log(`Downloading file: ${fileName} ......`)
        await (new downloadAPI(source)).setPath(path).start(fileName)

        const s3Source = await uploadLocalFile(`${path}/${fileName}`)
        console.log(`       Uploaded is completed, going to delete: `, s3Source)
        // await fileNameHelp.delete(`${path}/${fileName}`)
        console.log(`       Locally delete, going to write DB`)
        //*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_


        await videoUpdate({fbId},  {s3Source})
        console.log(colors.green('refetch success !!'))


        process.exit()
    } catch (err) {
        console.error(colors.red(err))
        process.exit()
    }
}())
