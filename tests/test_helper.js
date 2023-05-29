/* eslint-disable no-underscore-dangle */
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
]

const initialUsers = [
  {
    name: 'Root',
    username: 'root',
    password: 'sekret',
  },
]

const resetDB = async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = initialUsers[0]

  const passwordHash = await bcrypt.hash(user.password, 10)

  const newUser = new User({
    name: user.name,
    username: user.username,
    passwordHash,
  })

  await newUser.save()

  const blogs = initialBlogs.map(
    (blog) => new Blog({ ...blog, user: newUser._id })
  )

  const insertedBlogs = await Blog.insertMany(blogs)

  const blogsIds = insertedBlogs.map((blog) => blog._id.toString())
  newUser.blogs = blogsIds
  await newUser.save()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user')

  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const existingBlog = async () => {
  const blogs = await Blog.find({}).populate('user')

  return blogs[0].toJSON()
}

const existingUser = async () => {
  const users = await User.find({}).populate('blogs')

  return users[0].toJSON()
}

const nonExistingBlogId = async () => {
  const blog = new Blog({
    title: 'Inexistent Id',
    author: 'Jesus Josephson',
    url: 'http://livropog.com.br',
    likes: 10,
  })

  await blog.save()
  await blog.remove()

  // eslint-disable-next-line no-underscore-dangle
  return blog._id.toString()
}

const login = async (username, password) => {
  const response = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)

  return response.body.token
}

module.exports = {
  initialBlogs,
  initialUsers,
  resetDB,
  blogsInDb,
  usersInDb,
  existingBlog,
  existingUser,
  nonExistingBlogId,
  login,
}
