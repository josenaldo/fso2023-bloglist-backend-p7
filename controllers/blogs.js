/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', middleware.requireAuth, async (request, response) => {
  const { title, url, author, likes } = request.body

  const authUser = request.user

  const user = await User.findById(authUser.id)

  const blog = new Blog({
    title,
    url,
    author,
    likes: likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('user')

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user')

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete(
  '/:id',
  middleware.requireAuth,
  async (request, response) => {
    const blogToDelete = await Blog.findById(request.params.id)

    if (!blogToDelete) {
      return response.status(204).end()
    }

    if (blogToDelete.user.toString() !== request.user.id.toString()) {
      return response.status(401).json({ error: 'unauthorized access' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
)

blogsRouter.put('/:id', middleware.requireAuth, async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id)

  if (!blogToUpdate) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blogToUpdate.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized access' })
  }

  const { title, url, author, likes } = request.body

  blogToUpdate.title = title
  blogToUpdate.url = url
  blogToUpdate.author = author
  blogToUpdate.likes = likes || 0

  const updatedBlog = await blogToUpdate.save()
  await updatedBlog.populate('user')

  response.json(updatedBlog)
})

blogsRouter.post(
  '/:id/like',
  middleware.requireAuth,
  async (request, response) => {
    const blogToUpdate = await Blog.findById(request.params.id)

    if (!blogToUpdate) {
      return response.status(404).json({ error: 'blog not found' })
    }

    blogToUpdate.likes += 1

    const updatedBlog = await blogToUpdate.save()

    await updatedBlog.populate('user')

    response.json(updatedBlog)
  }
)

blogsRouter.post('/:id/comments', async (request, response) => {
  const { content } = request.body

  if (!content) {
    return response.status(400).json({ error: 'content is required' })
  }

  const blogToUpdate = await Blog.findById(request.params.id)

  if (!blogToUpdate) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blogToUpdate.comments.push({ content })

  const updatedBlog = await blogToUpdate.save()
  await updatedBlog.populate('user')

  response.json(updatedBlog)
})
module.exports = blogsRouter
