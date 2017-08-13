const Schema = require('mongoose').Schema

//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var VideoObject = new Schema({
  fbId: { type: String, required: true },
  fbPageId: { type: String, required: true },
  title: { type: String },
  newTitle: { type: String },
  description: { type: String, required: true },
  newDescription: { type: String },
  publishedAt: { type: Date},
  isReady: { type: Boolean },
  source: { type: String, required: true },
  s3Source: { type: String, required: true },
  likes: { type: Object },
  videoLength: { type: Object },
  rate: { type: Number },
  originPage: { type: String },
  originThumb: { type: String },
  createdAt: { type: Date, default: Date.now },
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

const assignKeyValue  = (from, to) => {
  Object.keys(from).forEach(
    (key) => {
      to[key] = from[key]
    }
  )
}

export function create (payload = {}) {
  return new Promise((resolve, reject) => {
    const _mongoose = global.DBInstance
    const VideoInstance = _mongoose.model('Video', VideoObject)
    const instance = new VideoInstance()

    assignKeyValue(payload, instance)

    instance.save(function (err, obj) {
      if (err) reject(err)
      else {
        resolve(obj)
      }
    })
  })
}


export function deleteById (id) {
  return new Promise((resolve, reject) => {
    const _mongoose = global.DBInstance
    const Video = _mongoose.model('Video', VideoObject)

    Video.findByIdAndRemove(id, function (err, vObj) {  
      if (err) reject(err)
      resolve(vObj)
    });

  })
}

export function getList (payload = {}, field={}) {
  return new Promise((resolve, reject) => {
    const _mongoose = global.DBInstance

    const _payload = {
      limit: 10,
      skip: 0,
      sort: '-date',
      ...payload
    }

    const Video = _mongoose.model('Video', VideoObject)
    const query = Video.find(field, null, _payload)
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


export function count () {
  return new Promise((resolve, reject) => {
    const _mongoose = global.DBInstance
    const Video = _mongoose.model('Video', VideoObject)

    Video.count({}, function (err, count) {  
      if (err) reject(err)
      resolve(count)
    });
  })
}
