
import {getAccessToken, videoPost} from './module/facebook';
import {initDB, videoList, videoUpdate} from './module/dataBase';
import UserModel from './module/dataBase/user'

(async function () {
  initDB()
  await getAccessToken()

  const getNewestToken = async () => (await UserModel.getList({limit:1, sort: '-createdAt'}))[0].longToken

  const getOneReadyVideo = async () => (await videoList({}, {status: 'READY'}))[0]

  const postVideoToFacebook = (_video, longtoken) => {
    const pageId = process.env.FB_PUBLISH_PAGE_ID
    const {title, newTitle, description, newDescription, originThumb, s3Source, editedSource} = _video

    const payload = {
      title: newTitle,
      description: newDescription || newTitle,
      picture: originThumb
    }

    const videoUrl = editedSource || s3Source
    return videoPost (longtoken, pageId, videoUrl, payload) 
  }

  const updatePublishedDB = (videoId, publishedVideoId) => {
    const condition = {_id: videoId}
    const payload = {
      status: 'PUBLISHED', 
      publishedFbId: publishedVideoId
    }
    return videoUpdate(condition, payload)
  }

  const newestToken = await getNewestToken()
  
  const video = await getOneReadyVideo()
  
  console.log(`Going to publish '${video.fbPageName}' ...`)

  const publishedVideoId = (await postVideoToFacebook(video, newestToken)).id

  console.log(`     Video is posted on FB: ${publishedVideoId}`)

  await updatePublishedDB(video._id, publishedVideoId)

  console.log(`     DB updated ... `)
  process.exit()
}())
