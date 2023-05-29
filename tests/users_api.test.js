const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await helper.resetDB()
})

describe('GET /users', () => {
  test('should return all users as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('should return all users', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.initialUsers.length)
  })

  test('should return users with the correct fields', async () => {
    const response = await api.get('/api/users')

    const users = response.body

    expect(users).toBeDefined()

    users.forEach((user) => {
      expect(user.id).toBeDefined()
      expect(user.name).toBeDefined()
      expect(user.username).toBeDefined()
      expect(user.passwordHash).not.toBeDefined()
      expect(user.blogs).toBeDefined()
      expect(user.blogs[0].title).toBeDefined()
      expect(user.blogs[0].url).toBeDefined()
      expect(user.blogs[0].author).toBeDefined()
    })
  })
})

describe('POST /users', () => {
  it('should create a valid user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'New User',
      username: 'newuser',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  it('should not create a user with an empty username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'New User',
      username: '',
      password: 'password',
    }

    const respose = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).not.toContain(newUser.username)

    expect(respose.body.error).toContain('`username` is required')
  })

  it('should not create a user with an invalid username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'New User',
      username: 'ne',
      password: 'password',
    }

    const respose = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).not.toContain(newUser.username)

    expect(respose.body.error).toContain(
      '`username` must be at least 3 characters'
    )
  })

  it('should not create a user with an empty password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'New User',
      username: 'newuser',
      password: '',
    }

    const respose = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).not.toContain(newUser.username)

    expect(respose.body.error).toContain('`password` is required')
  })

  it('should not create a user with an invalid password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'New User',
      username: 'newuser',
      password: '12',
    }

    const respose = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).not.toContain(newUser.username)

    expect(respose.body.error).toContain(
      '`password` must be at least 3 characters'
    )
  })

  it('should not create a user with a duplicate username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'root',
      username: 'root',
      password: 'root',
    }

    const respose = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    expect(respose.body.error).toContain('`username` must to be unique')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
