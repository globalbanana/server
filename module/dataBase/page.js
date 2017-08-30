const Schema = require('mongoose').Schema
import Abstract from './abstract'

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
  talkAboutCount: {type: Number},
  picture: { type: String,},
  feq: { type: String,},  //DAY, WEEK, MONTH
  createdAt: { type: Date, default: Date.now },
})


PageObject.pre('save', function (next) {
    this.updatedAt = Date.now();
    next()
})

const PageModel = new Abstract('User' , PageObject)

export default PageModel
