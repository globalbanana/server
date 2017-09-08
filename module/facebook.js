import fetch from 'isomorphic-fetch'
var queryString = require('query-string');

const clientId = process.env.GRAPHAPI_CLIENT_ID
const secret = process.env.GRAPHAPI_SECRET

/**
 * videoPost
 * @param {String} accessToken
 * @param {String} pageId
 * @param {String} videoUrl
 * @return {Array} key: title, description
 */
export function videoPost (accessToken, pageId, videoUrl, payload = {}) 
{
    const url = `https://graph.facebook.com/v2.10/${pageId}/videos?access_token=${accessToken}`;
    payload["file_url"] = videoUrl
    const option = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    }
    return fetch(url, option)
           .then(
             res => res.json()
            ,err => console.error(err)
          )
}

/**
 * getTokenUser
 * @param {String} accessToken
 */
export function getTokenUser(accessToken)
{
    const url = `https://graph.facebook.com/v2.10/me?fields=id&access_token=${accessToken}`;
    return fetch(url)
        .then(res => res.json(),
              err => console.error(err)
             )
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
export function getVideoList (pageId, limit = 10,  nextPage) {

  
  const accessToken = process.env.GRAPHAPI_ACCESS_TOKEN
  const url = (nextPage)? nextPage
              :`https://graph.facebook.com/v2.9/${pageId}/videos?fields=length,description,title,picture,source,likes.limit(0).summary(true),comments.summary(true),created_time&limit=${limit}&access_token=${accessToken}`

  return fetch(url).then(
      res => res.json()
  )
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

export function isAdmin (accessToken) {
  const url = `https://graph.facebook.com/v2.9/me?fields=id,name&access_token=${accessToken}`

  return fetch(url).then(
    res => res.json()
  ).then(resultJson => {
    if(resultJson.id === process.env.FB_PUBLISH_PAGE_ID)
      return Promise.resolve(true)
    else
      return Promise.reject(false)
  })
}


/**
 * extendToken
 * @param {String} accessToken
 * @return {Object}
 * {access_token}
 */
export function extendToken (accessToken) {
  
    const clientId = process.env.GRAPHAPI_CLIENT_ID
    const secret = process.env.GRAPHAPI_SECRET
  
    const query = queryString.stringify({
      grant_type: 'fb_exchange_token',
      client_id: clientId,
      client_secret: secret,
      fb_exchange_token: accessToken
    })
    const url = `https://graph.facebook.com/v2.10/oauth/access_token?${query}`
  
    return fetch(url).then(
      res => res.json()
    )
  }
  

export function getPageDetail (pageId) {
  const accessToken = process.env.GRAPHAPI_ACCESS_TOKEN
  const url = `https://graph.facebook.com/v2.9/${pageId}?fields=about,fan_count,category,description,location,name,talking_about_count,picture{url}&access_token=${accessToken}`

  return fetch(url).then(
      res => res.json()
  )
}
