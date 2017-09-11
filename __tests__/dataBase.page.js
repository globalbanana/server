import {initDB} from '../module/dataBase'
import PageModel from '../module/dataBase/page'
import {randomInt, randomString} from './util'

initDB()

describe('mongoose module', () => {

  let createdId = randomString(5)

  const videoCountObj = {
    total: 0,
    new: 0,
    editing: 0,
    ready: 0,
    published: 0,
    deleted: 0
}


  const mock = {
    fbPageId: randomString(5),
    fbName: randomString(5),
    about: randomString(5),
    category: randomString(5),
    description: randomString(5),
    videoCount: videoCountObj,
    videoCountHistory: [videoCountObj],
    location: {
        "city": randomString(5),
        "country": randomString(5),
        "state": randomString(5),
      },
    fanCount: randomInt(1,100),
    picture: randomString(5),
  }

  it('page create()', (done) => {

    PageModel.create(mock).then(
      (res) => {
        createdId = res._id
        Object.keys(mock).forEach((key) => {
          if(key !== 'location' && key !== 'videoCount' && key !== 'videoCountHistory')            
            expect(mock[key]).toBe(res[key])
        })
        done()
      },
      (err) => console.log(err)
    )
  })


  it('page getList()', (done) => {
    const field = {_id: createdId}
    PageModel.getList({}, field).then(
      (res) => {
        const result = res[0]
        Object.keys(mock).forEach((key) => {
          if(key !== 'location' && key !== 'videoCount' && key !== 'videoCountHistory')
            expect(mock[key]).toBe(result[key])
        })

        //check result.videoCount
        Object.keys(mock.videoCount).forEach((key) => {
            expect(mock.videoCount[key]).toBe(result.videoCount[key])
        })

        done()
      },
      (err) => console.log(err)
    )
  })

  it('page updateById()', (done) => {
    const newFbName = randomString(10)

    PageModel.updateById(createdId,{fbName: newFbName})
    .then(() => {
      return PageModel.getList({}, {_id: createdId})
    })
    .then( res => {
      expect(res[0].fbName).toBe(newFbName)
      done()
    })
  })

  it('page count()', (done) => {
    PageModel.count({_id: createdId})
    .then(count => {
      expect(count).toBe(1)
      done()
    })
  })
  
  it('page deleteById()', (done) => {
    PageModel.deleteById(createdId).then(
      result => {

        const field = {_id: createdId}
        PageModel.getList({}, field).then(
            (result ) => {
                expect(result.length).toBe(0)
                done()
            }
        )
      }
    )
  })
})