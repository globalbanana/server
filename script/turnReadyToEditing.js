
import {getAccessToken, videoPost} from '../module/facebook';
import {initDB, videoList, videoUpdate} from '../module/dataBase';

(async function () {
  initDB()
  await getAccessToken()

  let count = 0

  const process100Video = async () => {

    const getReadyVideo =() => videoList({limit: 100}, {status: 'READY'})
  
    const turnReadyToEditing = (videoId) => {
      const condition = {_id: videoId}
      const payload = {
        status: 'EDITING', 
      }
      return videoUpdate(condition, payload)
    }
  
    const videos = (await getReadyVideo())
    
    for(let _v of videos ){
      console.log(`${count} : video is updated .`)
      await turnReadyToEditing(_v._id)
      count += 1
    }

    if(videos.length < 100)
      return
    else
      await process100Video()
  }

  await process100Video()

  process.exit()
}())
