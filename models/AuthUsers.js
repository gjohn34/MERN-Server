const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuthUserSchema = new Schema({
  user_id: {
      type: String,
      unique: true
    },
  username: String
})

module.exports = mongoose.model('AuthUsers', AuthUserSchema)
