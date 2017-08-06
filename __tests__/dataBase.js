import {initDB, videoCreate} from '../module/dataBase'

describe('mongoose module', () => {
  it('initDB', (done) => {
    //* username, password, url should be hidden as env variable
    initDB()
    expect(typeof global.DBInstance).toBe('object')
    done()
  })

  it('videoCreate()', (done) => {
    const payload = {
      title: 'perter title',
      description: 'perter description',
      source: 'perter source',
      s3Source: 'perter s3Source',
      originPage: 'perter page',
      likes: [{user: 'peter'},{user: 'rukeith'}],
      videoLength: 1234,
    }

    videoCreate(payload).then(
        (res) => { 
          done()
        }
    )
  })
})
