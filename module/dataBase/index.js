import {create} from './video'
const mongoose = require('mongoose')

export function initDB () {
  const mongoUsername = process.env.MONGO_USERNAME
  const mongoPw = process.env.MONGO_PASSWORD
  const mongoUrl = process.env.MONGO_URL
  mongoose.connect(
        `mongodb://mongodb://${mongoUsername}:${mongoPw}@${mongoUrl}`
    )
  global.DBInstance = mongoose
}

export { create as videoCreate }
