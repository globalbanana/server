import {getAccessToken, getVideoList, getVideoDetail, getPageDetail} from '../module/facebook'

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

    getVideoList(pageId).then(
      list => {
        list.forEach((vObj) => {
            expect(typeof vObj.description ).toBe('string')
            expect(typeof vObj.title ).toBe('string')
            expect(typeof vObj.length ).toBe('number')
            expect(typeof vObj.source ).toBe('string')
            expect(typeof vObj.picture).toBe('string')
            expect(typeof vObj.id     ).toBe('string')
        })
        done()
      },
      err => console.log(err)
    )
  })

  it('GET Video Detail', (done) => {
    const videoId = _videoId

    getVideoDetail(videoId).then(detail => {
      expect(typeof detail.source ).toBe('string')
      expect(typeof detail.picture).toBe('string')
      expect(typeof detail.id     ).toBe('string')
      done()
    })
  })


  it('GET page detail', (done) => {
    const pageId = 'LADbible'

    getPageDetail(pageId).then(detail => {
      expect(typeof detail.name).toBe('string')
      expect(typeof detail.about).toBe('string')
      expect(typeof detail.category).toBe('string')
      expect(typeof detail.emails).toBe('object')
      expect(typeof detail.id).toBe('string')
      expect(typeof detail.description).toBe('string')
      done()
    })
  })
})
