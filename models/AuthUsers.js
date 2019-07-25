const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

const AuthUserSchema = new Schema({
  user_id: {
      type: String,
      unique: true,
      required: true
    },
  username: String
})

module.exports = mongoose.model('AuthUsers', AuthUserSchema)
