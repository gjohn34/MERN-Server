require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const jwt = require('jsonwebtoken')

function checkJWT(request, response, next) {
  const authed = jwt.verify(request.headers.authorization, 'superSecretKey').authed
  if (authed) {
    next()
  } else {
    response.sendStatus(401)
  }
}

app.use(cors())
app.use(checkJWT)

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

app.use('/users', checkJWT, require('./routes/users'))
app.use('/authUsers', checkJWT, require('./routes/authUsers'))
app.use('/logs', checkJWT, require('./routes/logs'))

// Route to GET the root. Function retrieves all users and sends back the user object.
app.get('/', checkJWT, async function(request, response) {
  const docs = await User.find()
  response.status(200).send(docs)
})

app.listen(process.env.PORT || 5000, () => console.log(`Listening`))
