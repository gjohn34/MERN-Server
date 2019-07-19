const express = require('express')
const router = express.Router()

const AuthUser = require('../models/AuthUsers')

router.post('/new', function(request, response) {
  const newAuthUser = AuthUser.create({
    user_id: request.body.user_id
  }).then(result => {
    response.status(200).send(result)
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
