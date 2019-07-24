require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

function logOrigin(request, response, next) {
  console.log(request);
  next()
}

var corsOptions = {
  origin: process.env.FRONT_END_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(bodyParser.json())
app.use('/api/discord', require('./api/discord'));

const mongoose = require('mongoose')
const User = require('./models/Users')

mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true}, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

app.use('/users', cors(corsOptions), require('./routes/users'))
app.use('/authUsers', cors(), logOrigin(), require('./routes/authUsers'))
app.use('/logs', require('./routes/logs'))

// Route to GET the root. Function retrieves all users and sends back the user object.
app.get('/', cors(corsOptions), async function(request, response) {
  const docs = await User.find()
  response.status(200).send(docs)
})

app.listen(process.env.PORT || 5000, () => console.log(`Listening`))
