import fetch from 'isomorphic-fetch'

const clientId = process.env.GRAPHAPI_CLIENT_ID
const secret = process.env.GRAPHAPI_SECRET

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

export function getVideoList (pageId) {
  const accessToken = process.env.GRAPHAPI_ACCESS_TOKEN
  const url = `https://graph.facebook.com/v2.9/${pageId}?fields=videos&access_token=${accessToken}`

  return fetch(url).then(
      res => res.json()
  ).then(resultJson => {
    return resultJson.videos.data
  })
}

export function getVideoDetail (videoId) {
  const accessToken = process.env.GRAPHAPI_ACCESS_TOKEN
  const url = `https://graph.facebook.com/v2.9/${videoId}?fields=source&access_token=${accessToken}`

  return fetch(url).then(
      res => res.json()
  ).then(resultJson => {
    return resultJson
  })
}
