/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true,
  },
  author: {
    type: String,
    minlength: 5,
    required: true,
  },
  url: {
    type: String,
    minlength: 5,
    required: true,
    unique: true,
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
