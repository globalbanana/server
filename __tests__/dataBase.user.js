import {initDB} from '../module/dataBase'
import UserModel from '../module/dataBase/user'
import {randomInt, randomString} from './util'

initDB()

describe('mongoose module', () => {

  let createdId = randomString(5)
  const mock = {
    fbId: createdId,
    fbName: randomString(5),
    longToken: randomString(5)
  }

  it('User create()', (done) => {

    UserModel.create(mock).then(
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


  it('User getList()', (done) => {
    const field = {_id: createdId}
    UserModel.getList({}, field).then(
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

  it('User deleteById()', (done) => {
    UserModel.deleteById(createdId).then(
      result => {

        const field = {_id: createdId}
        UserModel.getList({}, field).then(
            (result ) => {
                expect(result.length).toBe(0)
                done()
            }
        )
      }
    )
  })

})