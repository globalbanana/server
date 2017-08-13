import {initDB, videoDelete, videoCreate, videoList, videoDetail, videoCount} from '../module/dataBase'

import {randomInt, randomString} from './util'

describe('mongoose module', () => {

    let idList = []
    const FB_PAGEID = randomString(10)

    beforeAll((done) => {
        const genVideoPayload = () => {
                return {
                    fbId: randomString(5),
                    fbPageId: FB_PAGEID, 
                    description: randomString(5),
                    source: randomString(5),
                    s3Source: randomString(5),
                }
        }

        initDB()

        Promise.all([
            videoCreate(genVideoPayload()),
            videoCreate(genVideoPayload()),
        ]). then(
            (result) => {
                idList = result.map( (_t) => _t._id )
                done()
            }
        )
    });

    afterAll((done) => {
        Promise.all( idList.map( _id => videoDelete(_id) )). then(
            (result) => {
                done()
            }
        )
    });

  it('Condition: videoList()', (done) => {
    const field = {fbPageId: FB_PAGEID}
    videoList({}, field).then(
      result => {
        expect(result.length).toBe(2)
        done()
      }
    )
  })

  it('Sortby: videoList()', (done) => {
    const field = {fbPageId: FB_PAGEID}
    const payload = { sort: '-createdAt'}
    const payloadOp = { sort: 'createdAt'}

    Promise.all([
        videoList(payload, field),
        videoList(payloadOp, field)
    ]).then(
        (result) => {
            expect(result[1]._id).toBe(result[0]._id)
            done()

        }
    )

    // videoList({}, field).then(
    //   result => {
    //     expect(result.length).toBe(2)
    //     done()
    //   }
    // )
  })

})
