import {uploadLocalFile, deleteFile} from '../module/s3'
var downloadable = require("downloadable");

describe('S3 module', () => {
  it('uploadLocalFile(file) to S3', (done) => {
    const path = './package.json'
    const expectRes = 'https://banana-video.s3.amazonaws.com/package.json'
    
    uploadLocalFile(path).then(
        (res) => {
          expect(res).toBe(expectRes)

          downloadable(expectRes).then(
            ()=> done()
          )
        }
    )
  })


  it('deleteFile(fileName) from S3', (done) => {
    const fileName = 'package.json'
    const downloadUrl = 'https://banana-video.s3.amazonaws.com/package.json'
    
    deleteFile(fileName).then(
        (res) => {
          downloadable(downloadUrl).then(
            ()=>{},
            (err) => done()
          )
        }
    )
  })
})
