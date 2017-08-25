
import {getAccessToken, videoPost} from './module/facebook';
import {initDB, videoList} from './module/dataBase';

(async function () {
  initDB()
  await getAccessToken()


  const getPublishVideo =() => videoList({}, {status: 'READY'})

  const postVideoToFacebook = (_video) => {
    const accessToken = 'EAABjktqNhF8BAA2gXKUBjqO4vmPELlVHk6lltv1PSDRtwatkPI3x5609VwKIY7iuCR4WSybueYg2JCt8EZCOVxdgfq6fOYkA1ZAYVptLaWtXzhLD67zz2FE5GrVZCvqsQPJuHWVTAsXyNXxHZAt9Y1HJ9mZCAPt1Ys6ZC0Ulgc8cOID2gygljmtI2T9RkwHchtZBTMZCMcJJQAZDZD'
    const pageId = '1701611166801933'

    const {title, newTitle, description, newDescription, originThumb, s3Source, editedSource} = _video

    // console.log('title: ', title)

    const payload = {
      title: newTitle,
      description: newDescription,
      picture: originThumb
    }

    const videoUrl = editedSource || s3Source
    


    return videoPost (accessToken, pageId, videoUrl, payload) 
  }



  const video = (await getPublishVideo())[0]
  const publishedVideoId = await postVideoToFacebook(video)

  console.log('publishedVideoId: ', publishedVideoId)

//   updatePublishedDB (video, publishedVideoId)

  process.exit()
}())
