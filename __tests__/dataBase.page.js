import {initDB} from '../module/dataBase'
import {create, getList} from '../module/dataBase/page'
import {randomInt, randomString} from './util'

initDB()

describe('mongoose module', () => {

  let createdId = randomString(5)
  const mock = {
    fbPageId: randomString(5),
    fbName: randomString(5),
    about: randomString(5),
    category: randomString(5),
    description: randomString(5),
    location: {
        "city": randomString(5),
        "country": randomString(5),
        "state": randomString(5),
      },
    fanCount: randomInt(1,100),
    picture: randomString(5),
  }

  it('page create()', (done) => {

    create(mock).then(
      (res) => {
        createdId = res._id
        Object.keys(mock).forEach((key) => {
            expect(mock[key]).toBe(res[key])
        })
        done()
      },
      (err) => console.log(err)
    )
  })


  it('page getList()', (done) => {
    const field = {_id: createdId}
    getList({}, field).then(
      (res) => {
        const result = res[0]
        Object.keys(mock).forEach((key) => {
          if(key !== 'location')
            expect(mock[key]).toBe(result[key])
        })
        done()
      },
      (err) => console.log(err)
    )
  })
})