import {uploadLocalFile} from '../module/s3'

describe('S3 module', () => {
  it('uploadLocalFile(file) to S3', (done) => {
    const path = './package.json'
    const expectRes = 'https://banana-video.s3.amazonaws.com/package.json'
    
    uploadLocalFile(path).then(
        (res) => {
          expect(res).toBe(expectRes)
          done()
        }
    )
  })
})
