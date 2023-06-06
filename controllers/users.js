const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const middleware = require('../utils/middleware')
const User = require('../models/user')

usersRouter.get(
  '/',
  middleware.userExtractor,
  middleware.requireAuth,
  async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
  }
)

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs')
  response.json(user)
})

usersRouter.get(
  '/profile/:username',
  middleware.userExtractor,
  middleware.requireAuth,
  async (request, response) => {
    const { username } = request.params

    if (!username) {
      return response.status(400).json({ error: '`username` is required' })
    }

    const user = await User.findOne({ username }).populate('blogs')

    response.json(user)
  }
)

usersRouter.post('/', async (request, response) => {
  const { name, username, password } = request.body

  if (!password) {
    return response.status(400).json({ error: '`password` is required' })
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: '`password` must be at least 3 characters' })
  }

  const saltRounds = 10

  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name,
    username,
    passwordHash,
  })

  const savedUser = await (await user.save()).populate('blogs')

  response.status(201).json(savedUser)
})

module.exports = usersRouter
