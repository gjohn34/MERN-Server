const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = new Schema({
  action: String,
  user: String,
  time: Date,
  extra: String
})

module.exports = mongoose.model('Log', LogSchema)
