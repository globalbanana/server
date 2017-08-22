
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
  const pageId = process.argv[2] || 'linea27py'
  console.log('going to crawler page: ', pageId)

  const pageObject = await getPageDetail(pageId)
  const fbPageId = pageObject.id
  const fbPageName = pageObject.name

  const _list = []
  let goodVideoCount = 0

  const path = './download'

  var get5GoodLink = async function(__videoList, skip, goodVideoCount, failCount = 0, fbNextPage){

    const limit = 5 
    const fbResponse = (fbNextPage)? 
            await getVideoList(null,null,fbNextPage)
            :await getVideoList(pageId, limit)
    const fbVideoList = fbResponse.data || []
    fbNextPage = (fbResponse.paging)?fbResponse.paging.next:null
    
    for(let _video of fbVideoList){
      const {id, length} = _video;
      const isVObjExisted = (await videoList({}, {fbId: id})).length

      if(goodVideoCount >=5 ){
        return __videoList
      }
      else if(isVObjExisted >0 ){
        failCount+=1
        console.log('Video is already downloaded : SKIP: ', id)
      }
      else if(length >1200 ){
        failCount+=1
        console.log('Video is longer than 2min : SKIP: ', id)
      }
      else {
        goodVideoCount = goodVideoCount + 1        
        __videoList.push(_video)
      }
    }


    if(!fbNextPage){
      return __videoList
    }
    else if (goodVideoCount <5 ){
      return (await get5GoodLink(__videoList, skip+1, goodVideoCount, failCount, fbNextPage))
    } else {
      return __videoList
    }
  }


  const good5link = await get5GoodLink([], 0, 0)

  for (let i = 0; i < good5link.length; i++) {
    try{

        const videoObject = good5link[i]
        const {id, title, picture, description, source, likes, length} = videoObject
        const fileName = fileNameHelp.urlFileName(source)

        console.log(`Downloading the ${i}th file: ${fileName} ......`)
        await (new downloadAPI(source)).setPath(path).start(fileName)

        const s3Source = await uploadLocalFile(`${path}/${fileName}`)
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
