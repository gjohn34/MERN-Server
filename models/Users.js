const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  user_id: String,
  username: String,
  points: Number
})

module.exports = mongoose.model('User', UserSchema)
