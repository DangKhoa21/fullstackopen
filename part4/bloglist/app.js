const config = require('./utils/config')
const express = require('express')
const path = require('path')
const app = express()
require('express-async-errors')
const cors = require('cors')
const morgan = require('morgan')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/user')
const blogsRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl).then(() => {
  logger.info('connected to MongoDB')
})
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.use(express.static('dist'))

app.use(middleware.jwtMiddleware)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app