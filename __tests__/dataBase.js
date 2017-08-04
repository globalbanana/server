import {initDB, videoCreate} from '../module/dataBase'

describe('mongoose module', () => {
  it('initDB', (done) => {
    //* username, password, url should be hidden as env variable
    initDB()
    expect(typeof global.DBInstance).toBe('object')
    done()
  })

  it('videoCreate()', (done) => {
    videoCreate().then(
        (res)=> {console.log('res: ', res)}
    )
    done()
  })
})
