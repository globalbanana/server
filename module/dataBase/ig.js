const Schema = require('mongoose').Schema
import Abstract from './abstract'
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var IGObject = new Schema({
  igId: { type: String, required: true },
  username: { type: String, required: true },
  profile_picture: { type: String},
  full_name: { type: String},
  bio: { type: String},
  website: { type: String},
  is_business: { type: String},
  access_token: { type: String},
  createdAt: { type: Date, default: Date.now },
})

IGObject.pre('save', function (next) {
    this.updatedAt = Date.now();
    next()
})

const IGModel = new Abstract('IG' , IGObject)

export default IGModel
