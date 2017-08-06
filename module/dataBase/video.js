const Schema = require('mongoose').Schema

//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var VideoObject = new Schema({
  fbId: { type: String, required: true },
  title: { type: String },
  description: { type: String, required: true },
  source: { type: String, required: true },
  s3Source: { type: String, required: true },
  likes: { type: Object },
  videoLength: { type: Object },
  rate: { type: Number },
  originPage: { type: String },
  originThumb: { type: String },
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

export function create (payload = {}) {
  return new Promise((resolve, reject) => {
    const _mongoose = global.DBInstance
    const VideoInstance = _mongoose.model('Video', VideoObject)
    const instance = new VideoInstance()
    const {fbId, title, originPage, description, source, s3Source, likes, videoLength, originThumb} = payload

    instance.fbId = fbId
    instance.title = title
    instance.description = description
    instance.source = source
    instance.s3Source = s3Source
    instance.likes = likes
    instance.originPage = originPage
    instance.videoLength = videoLength
    instance.originThumb = originThumb

    instance.save(function (err, obj) {
      if (err) reject(err)
      else {
        resolve(obj)
      }
    })
  })
}

export function getList (payload = {}) {
  return new Promise((resolve, reject) => {
    const _mongoose = global.DBInstance

    const {limit, skip} = payload

    const _payload = {
      limit: limit || 10,
      skip: skip || 0
    }

    const Video = _mongoose.model('Video', VideoObject)
    const query = Video.find({}, null, _payload)
    query.exec(function (err, vObjList) {
      if (err) reject(err)
      resolve(vObjList)
    })
  })
}

export function getDetail (id) {
  return new Promise((resolve, reject) => {
    const _mongoose = global.DBInstance

    const Video = _mongoose.model('Video', VideoObject)
    const query = Video.findOne({id})
    query.exec(function (err, vObj) {
      if (err) reject(err)
      resolve(vObj)
    })
  })
}
