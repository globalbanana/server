
import {getAccessToken, getVideoDetailList} from './module/facebook'
const downloadHelp = require('./module/downloadHelp');

(async function () {
  await getAccessToken()

  const pageId = process.env.npm_config_pageId || 'LADbible'

  const videoList = await getVideoDetailList(pageId)

  const path = "./download"

  for (let i = 0; i < videoList.length ; i++) {
    const link = videoList[i].source

    console.log(`Downloading the ${i}th file: ${link} ......`, )

    await downloadHelp(link).setPath(path).start()
  }

}())
