
import {getAccessToken, videoPost} from './module/facebook';
import {initDB, videoList, videoUpdate} from './module/dataBase';

(async function () {
  initDB()
  await getAccessToken()


  const getPublishVideo =() => videoList({}, {status: 'READY'})

  const postVideoToFacebook = (_video) => {
    const accessToken = 'EAABjktqNhF8BAF3tSknynNEqFFBpp5V0QzJh3gKJjvilLCpEGazIZAisAG1nsjpBeHT9g4rjSSq5KPd1zashVRZCjwlyBVTTzn54dga6SrN9sQukj6NGl4yIs3NdbeN32ZCuMZAwNVpna8UUQMWDIszDEN0IZBsxHK3ILlZCiwwtFRk2cENQUvWGdM78jbWD8ZD'
    const pageId = '1701611166801933'
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
