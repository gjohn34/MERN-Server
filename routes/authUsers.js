const express = require('express')
const router = express.Router()

const AuthUser = require('../models/AuthUsers')

router.get('/', async function(request, response) {
  const authUsers = await AuthUser.find()
  response.send(authUsers)
})


router.post('/', function(request, response) {
  const newAuthUser = AuthUser.create({
    user_id: request.body.user_id,
    username: request.body.username
  }).then(result => {
    response.status(200).send(result)
  }).catch(error => {
    console.log(error);
    response.status(500).send(error)
  })
})

router.delete('/:user_id', function(request, response) {
  AuthUser.deleteOne({
    user_id: request.params.user_id
  }).then(result => {
    response.status(200).send(result)
  }).catch(error => {
    response.status(404).send(error)
  })
})

module.exports = router
