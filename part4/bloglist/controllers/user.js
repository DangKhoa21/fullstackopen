const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !name || !password) {
    return response.status(400).json({
      error: 'missing username, name or password'
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'password is shorter than the minimum allowed length (3)'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    password: passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json({ username: savedUser.username, name: savedUser.name })
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs')

  response.json(users)
})

module.exports = usersRouter