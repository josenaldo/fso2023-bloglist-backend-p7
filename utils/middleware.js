const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const logger = require('./logger')

morgan.token('body', (request) => JSON.stringify(request.body))

const morganTemplate = `---
METHOD: :method
PATH: :url
STATUS: :status
RES TIME: :response-time ms
RES LENGTH: :res[content-length]
BODY: :body
---`
const requestLogger = morgan(morganTemplate)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error('🔴', error.message)

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
    return
  }

  if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
    return
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }

  next()
}

const userExtractor = (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = decodedToken
  } else {
    request.user = null
  }

  next()
}

const requireAuth = (request, response, next) => {
  if (!request.user) {
    response.status(401).json({ error: 'unauthorized access' })
  }
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  requireAuth,
}
