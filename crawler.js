
import {getAccessToken, getVideoDetailList} from './module/facebook'
const downloadHelp = require('./module/downloadHelp')
const fileNameHelp = require('./module/utils/fileName')
const fileHelp = require('./module/fileHelp')
const s3 = require('./module/s3');

(async function () {
  await getAccessToken()

  const pageId = process.env.npm_config_pageId || 'LADbible'

  const videoList = await getVideoDetailList(pageId)

  const path = './download'

  for (let i = 0; i < videoList.length; i++) {
    const link = videoList[i].source
    const fileName = fileNameHelp.urlFileName(link)

    console.log(`Downloading the ${i}th file: ${fileName} ......`)

    await downloadHelp(link).setPath(path).start()
    console.log(`${i} : is downloaded`)
    await s3.uploadLocalFile(`${path}/${fileName}`)
    console.log(`${i} : is uploaded to S3`)
    await fileHelp.delete(`${path}/${fileName}`)
    console.log(`${i} : is locally delete`)
  }
}())
