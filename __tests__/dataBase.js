import {initDB} from '../module/dataBase'

describe('mongoose module', () => {
  it('initDB', (done) => {
    //* username, password, url should be hidden as env variable
    initDB()
    expect(typeof global.DBInstance).toBe('object')
    done()
  })
})
