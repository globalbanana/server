import {initDB, videoDelete, videoCreate, videoList, videoDetail, videoCount} from '../module/dataBase'

describe('mongoose module', () => {

  let deleteId = ''

  it('initDB', (done) => {
    //* username, password, url should be hidden as env variable
    initDB()
    expect(typeof global.DBInstance).toBe('object')
    done()
  })

  it('videoCreate()', (done) => {
    const payload = {
      fbId: 'perterObjId',
      fbPageId: 'pageId',
      newTitle: 'I am new title',
      newDescription: 'I am new Description',
      isReady: false,
      publishedAt: null,
      title: 'perter title',
      description: 'perter description',
      source: 'perter source',
      s3Source: 'perter s3Source',
      fbPageName: 'perter page',
      originThumb: ' peter originThumb',
      likes: [{user: 'peter'}, {user: 'rukeith'}],
      videoLength: 1234
    }

    videoCreate(payload).then(
        (res) => {
          deleteId = res._id
          done()
        },
        (err) => console.log(err)
    )
  })

  it('videoDelete()', (done) => {
    videoDelete(deleteId).then(
      result => {
        done()
      }
    )
  })


  it('videoList()', (done) => {
    videoList().then(
      result => {
        done()
      }
    )
  })

  it('videoDetail()', (done) => {
    videoDetail().then(
      result => {
        expect(typeof result._id).toBe('object')
        expect(typeof result.s3Source).toBe('string')
        expect(typeof result.source).toBe('string')
        expect(typeof result.description).toBe('string')
        expect(typeof result.fbId).toBe('string')
        done()
      }
    )
  })

  it('videoCount()', (done) => {
    videoCount().then(
      result => {
        expect(typeof result).toBe('number')
        done()
      }
    )
  })
})
