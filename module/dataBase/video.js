const Schema = require('mongoose').Schema

//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var VideoObject = new Schema({
  name: { type: String, default: 'hahaha' },
  age: { type: Number, min: 18, index: true },
  bio: { type: String, match: /[a-z]/ },
  date: { type: Date, default: Date.now },
  buff: Buffer
})

// a setter
VideoObject.path('name').set(function (v) {
  return capitalize(v)
})

// middleware
VideoObject.pre('save', function (next) {
//   notify(this.get('email'));
  next()
})


export function create () {  
    return new Promise(async (resolve, reject) => {

        const _mongoose = global.DBInstance

        const VideoInstance = _mongoose.model('Video', VideoObject)

        const instance = new VideoInstance()
        instance.bio = 'hello'
        instance.save(function (err, obj) {
            if(err) reject(err)
            else {
                resolve(obj)
            }
        })
    })
}