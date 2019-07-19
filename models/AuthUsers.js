const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuthUserSchema = new Schema({
  user_id: {
      type: String,
      unique: true
    }
})

module.exports = mongoose.model('AuthUsers', AuthUserSchema)
