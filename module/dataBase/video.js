const Schema = require('mongoose').Schema

//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var VideoObject = new Schema({
  fbId: { type: String, required: true },
  publishedFbId: { type: String },
  fbPageId: { type: String, required: true },
  title: { type: String },
  newTitle: { type: String },
  description: { type: String },
  newDescription: { type: String },
  status: { type: String }, //READY, EDITING, PUBLISHED, DELETE  
  publishedAt: { type: Date},
  isReady: { type: Boolean },
  source: { type: String, required: true },
  s3Source: { type: String, required: true },
  editedSource: { type: String},
  likes: { type: Object },
  videoLength: { type: Object },
  rate: { type: Number },
  fbPageName: { type: String },
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
  this.status = 'EDITING'
  next()
})

VideoObject.pre('findOneAndUpdate', function (next) {
    this.updatedAt = Date.now();
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

export function getList (payload = {}, field={}, exist={}) {
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

    Object.keys(exist).forEach(
      (key) => {
        query.where(key).exists(exist[key])
      }
    )


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
    const query = Video.findOne({_id: id})
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

export function update (condition, payload) {
  return new Promise((resolve, reject) => {
    const _mongoose = global.DBInstance
    const Video = _mongoose.model('Video', VideoObject)

    Video.findOneAndUpdate(condition,  payload, function (err, vObj) {        
      if (err) reject(err)
      resolve()
    });
  })
}
