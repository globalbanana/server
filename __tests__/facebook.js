import {getAccessToken, getVideoList, getVideoDetail, getPageDetail, videoPost, getTokenUser} from '../module/facebook'

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


  it('post video', (done) => {
    
     const pageId = '1701611166801933'
     const date = new Date();
     const accessToken = "EAACl1H0CoZCwBAKX2HVg88eMV1h7KMRUeMjH9pjdUZBCeNeU34VJcV3RC0eICLB69E1ZCJrNhhHwcorujT9AKZCgIPFw1ESqDymQm74ptgL42k18sjOTw9fkxzDdw8UTFfrGvfGly6TwBg4wZBn2ZBlfQfFgx3pxxPdad6lyHvCCcrfRxW8YJ6PHEWYldsHRPX6HNSGM3tVAZDZD";
     const payload = {
               title: "title:" + date, 
               description: "description:"+date,
           }
     videoPost(accessToken,
               pageId, 
               "https://banana-video.s3-ap-southeast-1.amazonaws.com/20653962_721942511324521_2724018935165878272_n.mp4",
               payload
              )
              .then(result => {
                  expect(typeof result.id).toBe('string')
                  done()
       })
  })

  it('token', (done) => {
    
     const accessToken = "EAABjktqNhF8BAEUlGQeBpmJGtYE1UW23MXZCzk5JQefZBR7yJDyUtPSTQfCRCcVl5AhfvXwea6WwO1faEQmZCtv95sujXcP0ftJmzsUkfhS4nxM7VqtIapIm6vo7kHTZCvPpUbeMyBYhA4vZC5QDXreBdtpwh9pgveAZB0gDnabQwbpPZCp9ZCjQcfE9Xl3ZAYwQZD";
     getTokenUser(accessToken)
                 .then(result => {
                    expect(typeof result.id).toBe('string')
                    done()
                 })
  })


})
