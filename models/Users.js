const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

const UserSchema = new Schema({
  user_id: {
      type: String,
      unique: true,
      required: true
    },
  username: {
      type: String,
      required: true
    },
  points: Number
})

// UserSchema.path('user_id').index({ unique: true });

module.exports = mongoose.model('User', UserSchema)
