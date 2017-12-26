const Schema = require('mongoose').Schema
import Abstract from './abstract'
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var UserObject = new Schema({
  fbName: { type: String, required: true },
  fbId: { type: String, required: true },
  email: { type: String, required: true },
  longToken: { type: String, required: true },
  shortToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

UserObject.pre('save', function (next) {
    this.updatedAt = Date.now();
    next()
})

const UserModel = new Abstract('User' , UserObject)

export default UserModel
