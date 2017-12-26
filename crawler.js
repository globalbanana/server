
import {getAccessToken, getVideoList, getPageDetail} from './module/facebook';
import {uploadLocalFile} from './module/s3';
import {initDB, videoCreate, videoList} from './module/dataBase';
require('newrelic');

// const downloadHelp = require('./module/downloadHelp');
const fileNameHelp = require('./module/utils/fileName');
const downloadAPI = require('download-url');

(async function () {
  initDB()
  await getAccessToken()

  // $ npm run crawler -- LADbible
  const pageId = process.argv[2] || 'linea27py'
  console.log('going to crawler page: ', pageId)

  const pageObject = await getPageDetail(pageId)
  if(!pageObject) console.log('Fetch Data from FB is undefined, check FB access_token ....')


  const fbPageId = pageObject.id
  const fbPageName = pageObject.name

  const _list = []
  let goodVideoCount = 0

  const path = './download'

  var get20GoodLink = async function(__videoList, skip, goodVideoCount, failCount = 0, fbNextPage){

    const limit = 20 
    const fbResponse = (fbNextPage)? await getVideoList(null,null,fbNextPage):await getVideoList(pageId, limit)
    fbNextPage = (fbResponse.paging)?fbResponse.paging.next:null
    
    const fbVideoList = fbResponse.data || []

    for(let _video of fbVideoList){
      const {id, length} = _video
      const isVObjExisted = (await videoList({}, {fbId: id})).length

      if(goodVideoCount >=20 ){
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
        _video.likeCount = _video.likes.summary.total_count
        _video.commentCount = _video.comments.summary.total_count
        delete _video['likes'];         
        delete _video['comments'];         
        __videoList.push(_video)
      }
    }


    if(!fbNextPage){
      return __videoList
    }
    else if (goodVideoCount <20 ){
      return (await get20GoodLink(__videoList, skip+1, goodVideoCount, failCount, fbNextPage))
    } else {
      return __videoList
    }
  }


  let good20link = await get20GoodLink([], 0, 0)

  console.log('fetch 20 good links is done: ')

  const compareLikeCount = (a,b) => (b.likeCount - a.likeCount)

  const good5link = good20link.sort(compareLikeCount).slice(0,5)
  
  for (let i = 0; i < good5link.length; i++) {
    try{
        const videoObject = good5link[i]
        const {id, title, picture, description, source, likes, length, commentCount, likeCount, created_time} = videoObject
        const fileName = fileNameHelp.urlFileName(source)

        console.log(`Downloading the ${i}th file: ${fileName} ......`)
        await (new downloadAPI(source)).setPath(path).start(fileName)

        const s3Source = await uploadLocalFile(`${path}/${fileName}`)
        console.log(`       Uploaded is completed, going to delete: `, s3Source)
        await fileNameHelp.delete(`${path}/${fileName}`)
        console.log(`       Locally delete, going to write DB`)

        const payload = {
          fbId: id,
          title,
          description,
          source,
          s3Source,
          likeCount,
          commentCount,
          originCreatedAt: created_time,
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
