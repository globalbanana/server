import {getUserProfile, getMediaByCode} from '../service/ig'

describe('IG module', async () => {

  let mediaCodes = []

  it('GET getUserProfile', (done) => {
    const username = 'coolbanananig'
    getUserProfile(username).then( (result) => {
      const getMediaUrl = node => node.code
      mediaCodes = result.user.media.nodes.map(getMediaUrl)
      done()
    })
  })

  it('GET getMediaByCode',  async (done) => {
    for(let code of mediaCodes){
      const mediaObj = await getMediaByCode(code)
      console.log('mediaObj: ', mediaObj)
    }
    done()
  })
})
