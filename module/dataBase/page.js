const Schema = require('mongoose').Schema
import Abstract from './abstract'

//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//* _*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*

const countObj = {
  total: 0,
  new: 0,
  editing: 0,
  ready: 0,
  published: 0,
  deleted: 0,
}

var PageObject = new Schema({
  fbName: { type: String, required: true },
  fbPageId: { type: String, required: true },
  about: { type: String },
  category: { type: String },
  description: { type: String },
  location: { type: Object },
  fanCount: {type: Number},
  videoCount: {type: Object, default: countObj}, //READY, NEW, EDITING, PUBLISHED, DELETED  
  videoCountHistory: [],      //READY, NEW, EDITING, PUBLISHED, DELETED  
  talkAboutCount: {type: Number},
  picture: { type: String,},
  feq: { type: String,},  //DAY, WEEK, MONTH, SEARCH_LARGE
  createdAt: { type: Date, default: Date.now },
})


PageObject.pre('save', function (next) {
    this.updatedAt = Date.now();
    next()
})

const feqList = ['DAY', 'WEEK', 'MONTH', 'SEARCH_LARGE']

const PageModel = new Abstract('Page' , PageObject)

PageModel.config = {feqList}

export default PageModel
