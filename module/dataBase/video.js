const Schema = require('mongoose').Schema


//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var VideoObject = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  source: { type: String, required: true },
  s3Source: { type: String, required: true },
  likes: { type: Object },
  videoLength: { type: Object },
  rate: { type: Number },
  originPage: { type: String },
  buff: Buffer
})

// a setter
// VideoObject.path('name').set(function (v) {
//   return capitalize(v)
// })

// middleware
VideoObject.pre('save', function (next) {
//   notify(this.get('email'));
  next()
})

export function create (payload={}) {
  return new Promise(async (resolve, reject) => {
    const _mongoose = global.DBInstance
    const VideoInstance = _mongoose.model('Video', VideoObject)
    const instance = new VideoInstance()
    const {title, originPage, description, source, s3Source, likes, videoLength} = payload

    instance.title = title
    instance.description = description
    instance.source = source
    instance.s3Source = s3Source
    instance.likes = likes
    instance.originPage = originPage
    instance.videoLength = videoLength
    
    instance.save(function (err, obj) {
      if (err) reject(err)
      else {
        resolve(obj)
      }
    })
  })
}
