
import {getAccessToken, getVideoList, getPageDetail} from './module/facebook';
import {uploadLocalFile} from './module/s3';
import {initDB, videoCreate, videoList} from './module/dataBase';
// const downloadHelp = require('./module/downloadHelp');
const fileNameHelp = require('./module/utils/fileName');
const fileHelp = require('./module/fileHelp');
const downloadAPI = require('download-url');

(async function () {
  initDB()
  await getAccessToken()

  // $ npm run crawler -- LADbible
  const pageId = process.argv[2] || 'LADbible'
  console.log('going to crawler page: ', pageId)

  const pageObject = await getPageDetail(pageId)
  const fbPageId = pageObject.id
  const fbPageName = pageObject.name


  const _list = await getVideoList(pageId)

  const path = './download'

  for (let i = 0; i < _list.length; i++) {
    try{

        const videoObject = _list[i]
        const {id, title, picture, description, source, likes, length} = videoObject
        const fileName = fileNameHelp.urlFileName(source)
        let s3Source = ''

        const isVObjExisted = (await videoList({}, {fbId: id})).length

        if(isVObjExisted >0 ){
          console.log('Video is already downloaded : SKIP: ')
          continue
        }
        if(length >1200 ){
          console.log('Video is longer than 2min : SKIP: ')
          continue
        }

        console.log(`Downloading the ${i}th file: ${fileName} ......`)
        await (new downloadAPI(source)).setPath(path).start(fileName)
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
          videoLength: length,
          fbPageId,
          fbPageName
        }

        await videoCreate(payload)
        console.log(`       DB is writen: `)
    } 
    catch (err){
      console.error (err)
      continue
    }
  }

  process.exit()
}())
