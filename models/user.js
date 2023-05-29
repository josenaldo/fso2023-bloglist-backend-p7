/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
    required: [true, '`username` is required'],
    minlength: [3, '`username` must be at least 3 characters'],
  },
  passwordHash: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
})

userSchema.plugin(uniqueValidator, {
  message: '`{PATH}` must to be unique',
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
