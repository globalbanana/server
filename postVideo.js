
import {getAccessToken, videoPost} from './module/facebook';
import {initDB, videoList, videoUpdate} from './module/dataBase';

(async function () {
  initDB()
  await getAccessToken()


  const getPublishVideo =() => videoList({}, {status: 'READY'})

  const postVideoToFacebook = (_video) => {
    const accessToken = process.env.FB_ACCESS_TOKEN
    const pageId = process.env.FB_PUBLISH_PAGE_ID
    const {title, newTitle, description, newDescription, originThumb, s3Source, editedSource} = _video

    const payload = {
      title: newTitle,
      description: newDescription || newTitle,
      picture: originThumb
    }

    const videoUrl = editedSource || s3Source
    return videoPost (accessToken, pageId, videoUrl, payload) 
  }

  const updatePublishedDB = (videoId, publishedVideoId) => {
    const condition = {_id: videoId}
    const payload = {
      status: 'PUBLISHED', 
      publishedFbId: publishedVideoId
    }
    
    return videoUpdate(condition, payload)
  }

  const video = (await getPublishVideo())[0]

  const publishedVideoId = (await postVideoToFacebook(video)).id

  await updatePublishedDB(video._id, publishedVideoId)

  process.exit()
}())
