const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.username || body.username.length < 3) {
    return response.status(400).json({ error: 'username must be at least 3 characters long' })
  }
  if (!body.password || body.password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }
  const existingUser = await User.findOne({
    username: body.username
  })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})


module.exports = usersRouter