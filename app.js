
import {getAccessToken, getVideoList, getVideoDetail} from './module/facebook'

(async function () {
  await getAccessToken()

  const pageId = 'LADbible'
  const videoList = await getVideoList(pageId)

  for (let i = 0; i < videoList.length; i++) {
    const videoObj = videoList[i]
    const postId = videoObj.id
    const detail = await getVideoDetail(postId)
    const link = detail.source
    videoObj.source = link
  }
  
  console.log('videoList: ', videoList)
}())
