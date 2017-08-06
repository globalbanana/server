
import {getAccessToken, getVideoDetailList} from './module/facebook'
import {uploadLocalFile} from './module/s3'
import {initDB, videoCreate} from './module/dataBase'
const downloadHelp = require('./module/downloadHelp')
const fileNameHelp = require('./module/utils/fileName')
const fileHelp = require('./module/fileHelp')

(async function () {
  initDB()
  await getAccessToken()

  const pageId = process.env.npm_config_pageId || 'LADbible'

  const videoList = await getVideoDetailList(pageId)

  const path = './download'

  for (let i = 0; i < videoList.length; i++) {
    const videoObject = videoList[i]
    const {id, title, picture, description, source, likes, length} = videoObject
    const fileName = fileNameHelp.urlFileName(source)
    let s3Source = ''

    console.log(`Downloading the ${i}th file: ${fileName} ......`)
    await downloadHelp(source).setPath(path).start()

    console.log(`       Download is completed, going to upload :`)
    s3Source = await uploadLocalFile(`${path}/${fileName}`)
    console.log(`       Uploaded is completed, going to delete: `, s3Source)
    await fileHelp.delete(`${path}/${fileName}`)
    console.log(`       Locally delete, going to write DB`)

    const payload = {
      fbId: id,
      title,
      description,
      source,
      s3Source,
      likes,
      originThumb: picture,
      videoLength: length
    }

    await videoCreate(payload)
    console.log(`       DB is writen: `)
  }
}())
