
import weekJson from '../pageId/day.json'
import {initDB} from '../module/dataBase'
import {create, getList} from '../module/dataBase/page'

import {getPageDetail as getPageDetailFromFacebook, getAccessToken} from'../module/facebook'

(async function () {
    initDB()
    await getAccessToken()
    const _feq = 'DAY'
    const createPageObject = async (_pageObj) => {
        const _t = {
            ..._pageObj,
            picture: _pageObj.picture.data.url,
            fbName: _pageObj.name,
            fbPageId: _pageObj.id,
            fanCount: _pageObj.fan_count,
            talkAboutCount: _pageObj.talking_about_count,
            feq: _feq
        }
        const _result = await create(_t)
        console.log(`${_pageObj.name} is created : `, _result)
        return 
    }


    for(let pageName of weekJson){
        const pageObj = await getPageDetailFromFacebook(pageName)

        const field = {fbPageId: pageObj.id}
        const isPageExisted = ((await getList({}, field)).length >0)

        if(isPageExisted)
            console.log('SKIP: ', pageObj.name , ' is alreayd in DB')
        else {
            await createPageObject(pageObj)
        }
    }

    process.exit()
}())


// import {getAccessToken, videoPost} from '../module/facebook';
// import {initDB, videoList, videoUpdate} from '../module/dataBase';

// (async function () {
//   initDB()
//   await getAccessToken()

//   const getPublishedVideo =() => videoList({}, {status: 'PUBLISHED'})

//   const turnPUBLISHEDtoREADY = (videoId) => {
//     const condition = {_id: videoId}
//     const payload = {
//       status: 'READY', 
//     }
//     return videoUpdate(condition, payload)
//   }

//   const videos = (await getPublishedVideo())
  
//   for(let _v of videos ){
//     await turnPUBLISHEDtoREADY(_v._id)
//   }

//   process.exit()
// }())
