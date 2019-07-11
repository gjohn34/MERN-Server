require('dotenv').config()
const express = require('express')
const cors = require('cors')


const app = express()

//need to set up cors headers
app.use(cors())

const mongoose = require('mongoose')

const User = require('./models/Users')

console.log(User);



mongoose.connect(process.env.DB_HOST, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

app.get('/', function(request, response) {
  response.send('<h1>It Just Works</h1>')
  // response.sendStatus(200)
})

app.listen(process.env.PORT || 4000, () => console.log(`Listening`))
