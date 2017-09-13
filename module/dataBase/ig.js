const Schema = require('mongoose').Schema
import Abstract from './abstract'
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var IGObject = new Schema({
  igId: { type: String, required: true },
  username: { type: String, required: true },
  profile_picture: { type: String, required: true },
  full_name: { type: String, required: true },
  bio: { type: String, required: true },
  website: { type: String, required: true },
  is_business: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

IGObject.pre('save', function (next) {
    this.updatedAt = Date.now();
    next()
})

const IGModel = new Abstract('User' , IGObject)

export default IGModel
