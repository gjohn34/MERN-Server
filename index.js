const express = require('express')
const cors = require('cors')

const app = express()

//need to set up cors headers
app.use(cors())

const port = 4000
const host = 'localhost'


const mongoose = require('mongoose')
const mongohost = 'localhost'
const database = 'testdatabase'

mongoose.connect(`mongodb://${mongohost}/${database}`, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

app.get('/', function(request, response) {
  response.sendStatus(200)
})

app.listen(port, () => console.log(`Listening to ${host}:${port}`))
