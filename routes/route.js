const express = require('express')
const router = express.Router()

const User = require('../models/Users')

router.get('/', async function(request, response) {
  const docs = await User.find()
  response.status(200).send(docs)
  //keeping this as a test for future alterations
})

router.get('/users/:user_id', async function(request, response) {
  const user =  await User.find({ user_id: request.params.userId})
  response.send(user)
})

router.post('/users', function(request, response) {
  const {
    user_id,
    username,
    points
  } = request.body
  User.create({
    user_id,
    username,
    points
  })
  .then(user => response.send(user))
  .catch(error => response.status(500).send({
    error: error.message
  }))
})

router.delete('/users', async function(request, response) {
  const user_id = request.body.user_id
  await User.deleteOne({ user_id: user_id})
    .then(result => {response.send(result)})
    .catch(error => {response.status(500).send(error)})

})

module.exports = router
