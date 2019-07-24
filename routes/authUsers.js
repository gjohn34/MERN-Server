const express = require('express')
const router = express.Router()

const AuthUser = require('../models/AuthUsers')

// Route for GET /authusers/. Function retrieves all Authusers and sends back the user object.
router.get('/', async function(request, response) {
  console.log(request);
  const authUsers = await AuthUser.find()
  response.send(authUsers)
})

// Route for POSTing /authusers/. Function collects info from the body, creates
// a new AuthUser then returns either the new user or an error if that user already exists.
router.post('/', function(request, response) {
  console.log(request);
  const newAuthUser = AuthUser.create({
    user_id: request.body.user_id,
    username: request.body.username
  }).then(result => {
    response.status(200).send(result)
  }).catch(error => {
    response.status(500).send(error)
  })
})

// Route to DELETE /authUsers/123456. Function takes the ID from params and deletes the matching user.
// Confirmation sent back.

router.delete('/:user_id', function(request, response) {
  console.log(request);
  AuthUser.deleteOne({
    user_id: request.params.user_id
  }).then(result => {
    response.status(200).send(result)
  }).catch(error => {
    response.status(404).send(error)
  })
})

module.exports = router
