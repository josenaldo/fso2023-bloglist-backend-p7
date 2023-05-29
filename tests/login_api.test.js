const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('POST /api/login', () => {
  beforeEach(async () => {
    await helper.resetDB()
  })

  it('should return a token and user information if the username and password are correct', async () => {
    const authData = { username: 'root', password: 'sekret' }

    await api
      .post('/api/login')
      .send(authData)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('username', 'root')
        expect(res.body).toHaveProperty('name', 'Root')
      })
  })

  it('should fail with status 401 for an incorrec username', async () => {
    const authData = { username: 'wrongusername', password: 'sekret' }

    await api
      .post('/api/login')
      .send(authData)
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'invalid username or password')
      })
  })

  it('should fail with status 401 for an incorrec password', async () => {
    const authData = { username: 'root', password: 'wrongpassword' }

    await api
      .post('/api/login')
      .send(authData)
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'invalid username or password')
      })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
