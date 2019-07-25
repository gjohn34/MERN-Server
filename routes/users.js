const express = require('express')
const router = express.Router()

const User = require('../models/Users')
const Log = require('../models/Logs')


//Route to GET /users/1234. Bot will make an API call on the user to get their ID/username/points
router.get('/:user_id', async function(request, response) {
  const user = await User.findOne({ user_id: request.params.user_id})
  if (user) {
    response.status(200).send(user)
  } else {
    response.sendStatus(404)
  }
})

// Route for POSTing /users/. Function collects info from the body, creates
// a new AuthUser. A new log is also created then returns either the new user or an error if that user already exists.
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

// Route to DELETE /users/123456. Function takes the ID from params and deletes the matching user
// then a log item is created. Confirmation sent back.
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

// Route to PATCH /users/1234. Function takes the params and finds the user. Depending on what has been
// sent in the request, the user is changed and a new log item is created with those change details.
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

// Route to PATCH /users/1234/points. This is for an API call the bot will make when a user
// message is liked or when they make a new message. The user is found and their points are adjusted.
router.patch('/:user_id/points', async function(request, response) {
  console.log(request.body);
  let from = request.body.reactor == 0 ? `${request.body.reactor}` : 'reacting to others'
  // const reactor = request.body.reactor ? request.body.reactor : 'other user'
  const points = request.body.points
  const this_user_id = request.params.user_id
  let user = await User.findOne({ user_id: this_user_id })
  if (user != null) {
    user.points += points
    await user.save()
    Log.create({
      action: 'update: points',
      user: this_user_id,
      time: new Date,
      extra: `${points} ${points > 1 ? 'points' : 'point'} from: ${request.body.reactor || request.body.author || 'admin dashboard'}`
    })
    response.sendStatus(200)
  } else {
    response.sendStatus(404)
  }
})

module.exports = router
