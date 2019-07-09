require('dotenv').config()
const express = require('express')
const cors = require('cors')


const app = express()

//need to set up cors headers
app.use(cors())

const port = 4000
const host = 'localhost'


const mongoose = require('mongoose')
// const database = 'testdatabase'


mongoose.connect(process.env.DB_HOST, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

app.get('/', function(request, response) {
  response.sendStatus(200)
})

app.listen(process.env.PORT || port, () => console.log(`Listening on ${port}`))
