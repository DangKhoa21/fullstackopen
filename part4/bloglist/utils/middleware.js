const config = require('../utils/config')
const { expressjwt: jwt } = require('express-jwt')

const logger = require('./logger')
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'UnauthorizedError') {
    if (error.message === 'jwt expired') {
      return response.status(401).json({ error: 'token has expired, please log in again.' })
    }
    return response.status(401).json({ error: 'invalid token' })
  }

  next(error)
}

const jwtMiddleware = jwt({ secret: config.SECRET, algorithms: ['HS256'], credentialsRequired: false })

module.exports = {
  unknownEndpoint,
  errorHandler,
  jwtMiddleware
}