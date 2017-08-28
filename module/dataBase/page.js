const Schema = require('mongoose').Schema

//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var PageObject = new Schema({
  fbName: { type: String, required: true },
  fbPageId: { type: String, required: true },
  about: { type: String },
  category: { type: String },
  description: { type: String },
  location: { type: Object },
  fanCount: {type: Number},
  picture: { type: String,},
  createdAt: { type: Date, default: Date.now },
})


PageObject.pre('save', function (next) {
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
    const PageInstance = _mongoose.model('Page', PageObject)
    const instance = new PageInstance()

    assignKeyValue(payload, instance)

    instance.save(function (err, obj) {
      if (err) reject(err)
      else {
        resolve(obj)
      }
    })
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

    const PageQuery = _mongoose.model('Page', PageObject)
    const query = PageQuery.find(field, null, _payload)

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