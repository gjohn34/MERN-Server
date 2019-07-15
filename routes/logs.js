const express = require('express')
const router = express.Router()
const Log = require('../models/Logs')


router.get('/', async function(request, response) {
  const logs = await Log.find({})
  response.send(logs)
})

module.exports = router
