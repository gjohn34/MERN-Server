const express = require('express')
const router = express.Router()

const User = require('../models/Users')
const Log = require('../models/Logs')

router.get('/:user_id', async function(request, response) {
  const user = await User.findOne({ user_id: request.params.user_id})
  if (user) {
    response.status(200).send(user)
  } else {
    response.sendStatus(404)
  }
})

router.post('/', async function(request, response) {
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

router.delete('/:user_id', async function(request, response) {
  const user_id = request.params.user_id
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

router.patch('/:user_id', async function(request, response) {
  let user = await User.findOne({ user_id: request.params.user_id })
  if (user != null) {
    let changes = ''
    if (request.body.username) {
      user.username = request.body.username
      changes += ' username'
    }
    if (request.body.points) {
      user.points = request.body.points
      changes += ' points'
    }
    await user.save()
    await Log.create({
      action: 'update:' + (changes || ' nothing'),
      user: user.user_id,
      time: new Date
    })
    response.send(user)
  } else {
    response.sendStatus(404)
  }
})

router.patch('/:user_id/points', async function(request, response) {
  let user = await User.findOne({ user_id: request.params.user_id })
  if (user != null) {
    user.points += request.body.points
    await user.save()
    response.sendStatus(200)
  } else {
    response.sendStatus(404)
  }
})

module.exports = router
