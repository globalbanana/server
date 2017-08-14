import fetch from 'isomorphic-fetch'
import {Facebook, FacebookApiException} from 'fb';
const FB = new Facebook({
  version: 'v2.10',
  appId: process.env.GRAPHAPI_CLIENT_ID,
  appSecret: process.env.GRAPHAPI_SECRET
});

const clientId = process.env.GRAPHAPI_CLIENT_ID
const secret = process.env.GRAPHAPI_SECRET

/**
 * getVideoList
 * @param {String} pageId
 * @param {Object} options The video post's params
 * @param {String} options.title The video's title
 * @param {String} options.description The post's text
 * @param {String} options.file_url The vidoe's download url which facebook will upload to fan page
 * @param {Boolean} options.embeddable Allow user to embedda this post or not, default is false
 * @param {Boolean} options.social_actions This can be used to enable or prohibit the use of Facebook socialactions (likes, comments, and sharing) on an unlisted video. Default value is false
 * @param {String} options.thumb The video thumbnail raw data to be uploaded and associated with a video.
 * @param {Number} options.file_size The size of the entire video file in bytes.
 * @param {String} options.content_category Content category of this video.  {BEAUTY_FASHION, BUSINESS, CARS_TRUCKS, COMEDY, CUTE_ANIMALS, ENTERTAINMENT, FAMILY, FOOD_HEALTH, HOME, LIFESTYLE, MUSIC, NEWS, POLITICS, SCIENCE, SPORTS, TECHNOLOGY, VIDEO_GAMING, OTHER}
 * @return {Array}
 */
export default function videoPost (pageId, options = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getAccessToken();
      FB.api(`/${pageId}/feed`, 'POST', options, (res) => {
        if(!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
        }
        res0 = JSON.parse(res[0].body);
 
        if (res0.error) {
          console.log(res0.error);
        } else {
          console.log('Post Id: ' + res0.id);
        }
        resolve(res0);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function getAccessToken (x) {
  const url = `https://graph.facebook.com/oauth/access_token?client_id=${clientId}&client_secret=${secret}&grant_type=client_credentials`

  return fetch(url).then(
      res => res.json()
  ).then(resultJson => {
    const _at = resultJson.access_token
    process.env.GRAPHAPI_ACCESS_TOKEN = _at
    return _at
  })
}

/**
 * getVideoList
 * @param {String} pageId
 * @return {Array}
 * [{ description: '...',
    updated_time: '2017-08-01T12:02:34+0000',
    id: '...' }]
 */
export function getVideoList (pageId, limit) {
  const accessToken = process.env.GRAPHAPI_ACCESS_TOKEN
  const _limit = limit || 10
  const url = `https://graph.facebook.com/v2.9/${pageId}/videos?fields=length,description,title,picture,source&limit=${_limit}&access_token=${accessToken}`

  return fetch(url).then(
      res => res.json()
  ).then(resultJson => {
    return resultJson.data
  })
}

export function getVideoDetail (videoId) {
  const accessToken = process.env.GRAPHAPI_ACCESS_TOKEN
  const url = `https://graph.facebook.com/v2.10/${videoId}?fields=source,picture&access_token=${accessToken}`

  return fetch(url).then(
      res => res.json()
  ).then(resultJson => {
    return resultJson
  })
}

/**
 * getVideoDetailList
 * @param {String} pageId
 * @return {Array}
 * [{ description: 'string',
    updated_time: '2017-07-31T03:00:00+0000',
    id: 'string',
    source:'string'
    picture:'string']
 */
export async function getVideoDetailList (pageId) {
  const videoList = await getVideoList(pageId)

  for (let i = 0; i < videoList.length; i++) {
  // for (let i = 0; i < videoList.length; i++) {
    const videoObj = videoList[i]
    const postId = videoObj.id
    const detail = await getVideoDetail(postId)
    
    videoObj.source = detail.source
    videoObj.picture = detail.picture
  }

  return videoList
}

export function getPageDetail (pageId) {
  const accessToken = process.env.GRAPHAPI_ACCESS_TOKEN
  const url = `https://graph.facebook.com/v2.9/${pageId}?fields=name,about,category,emails,fan_count,description&access_token=${accessToken}`

  return fetch(url).then(
      res => res.json()
  ).then(resultJson => {
    return resultJson
  })
}