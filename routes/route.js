const express = require('express')
const router = express.Router()

const User = require('../models/Users')
const Log = require('../models/Logs')

router.get('/', async function(request, response) {
  const docs = await User.find()
  response.status(200).send(docs)
  //keeping this as a test for future alterations
})

router.get('/users/:user_id', async function(request, response) {
  const user = await User.findOne({ user_id: request.params.user_id})
  if (user) {
    response.status(200).send(user)
  } else {
    response.sendStatus(404)
  }
})

router.post('/users', async function(request, response) {
  const {
    user_id,
    username,
    points
  } = request.body
  const user = await User.create({
    user_id,
    username,
    points
  }).catch(error => {response.status(500).send(error)})
  await Log.create({
    action: 'new',
    user: user_id,
    time: new Date
  }).catch(error => {response.status(500).send(error)})
  response.status(200).send(user)
})

router.delete('/users', async function(request, response) {
  const user_id = request.body.user_id
  const user = await User.deleteOne({
    user_id: user_id
  })
  if (user.deletedCount == 0) {
    response.status(404).send(user)
  } else {
    await Log.create({
      action: 'delete',
      user: user_id,
      time: new Date
    })
    response.status(200).send(user)
  }
})

router.patch('/users/:user_id', async function(request, response) {
  let user = await User.findOne({ user_id: request.params.user_id })
  if (user != null) {
    if (request.body.username) {
      user.username = request.body.username
    }
    if (request.body.points) {
      user.points = request.body.points
    }
    await user.save()
    response.send(user)
  } else {
    response.sendStatus(404)
  }
})

module.exports = router
