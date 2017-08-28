
import {getAccessToken, videoPost} from '../module/facebook';
import {initDB, videoList, videoUpdate} from '../module/dataBase';

(async function () {
  initDB()
  await getAccessToken()

  const getPublishedVideo =() => videoList({limit: 100}, {status: undefined})

  const turnPUBLISHEDtoREADY = (videoId) => {
    const condition = {_id: videoId}
    const payload = {
      status: 'READY', 
    }
    return videoUpdate(condition, payload)
  }

  const videos = (await getPublishedVideo())
  
  for(let _v of videos ){
    await turnPUBLISHEDtoREADY(_v._id)
  }

  process.exit()
}())
