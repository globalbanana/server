import {getAccessToken, getVideoList, getVideoDetail} from '../module/facebook'

describe('Facebook module', () => {
  let _videoId = ''

  it('GET AccessToken', (done) => {
    getAccessToken().then((_at) => {
      expect(typeof _at).toBe('string')
      expect(typeof process.env.GRAPHAPI_ACCESS_TOKEN).toBe('string')
      expect(process.env.GRAPHAPI_ACCESS_TOKEN).toBe(_at)
      done()
    })
  })

  it('GET Video List', (done) => {
    const pageId = 'LADbible'

    getVideoList(pageId).then(list => {
      expect(typeof list).toBe('object')
      expect(typeof list.length).toBe('number')
      _videoId = list[0].id
      done()
    })
  })

  it('GET Video List', (done) => {
    const videoId = _videoId

    getVideoDetail(videoId).then(detail => {
      expect(typeof detail.source).toBe('string')
      done()
    })
  })
})
