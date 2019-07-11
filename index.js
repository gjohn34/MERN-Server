require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
//need to set up cors headers
app.use(cors())
app.use(bodyParser.json())



const mongoose = require('mongoose')

const User = require('./models/Users')
const Log = require('./models/Logs')

// console.log(User.schema);
// console.log(Log);


mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true}, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

app.use('/', require('./routes/route'))

app.listen(process.env.PORT || 4000, () => console.log(`Listening`))
