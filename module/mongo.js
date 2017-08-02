const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const mongoUsername = process.env.MONGO_USERNAME
const mongoPw = process.env.MONGO_PASSWORD
const mongoUrl = process.env.MONGO_URL
mongoose.connect(`mongodb://mongodb://${mongoUsername}:${mongoPw}@${mongoUrl}`);

//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Schema Definition
//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var Comment = new Schema({
  name: { type: String, default: 'hahaha' },
  age: { type: Number, min: 18, index: true },
  bio: { type: String, match: /[a-z]/ },
  date: { type: Date, default: Date.now },
  buff: Buffer
});
 
// a setter 
Comment.path('name').set(function (v) {
  return capitalize(v);
});

// middleware 
Comment.pre('save', function (next) {
//   notify(this.get('email'));
  next();
});


//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
// Operating Mongo Object
//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
var MyModel = mongoose.model('Ticket', Comment);

var instance = new MyModel();
instance.bio = 'hello';
instance.save(function (err) {
  console.log('save .... ')
});