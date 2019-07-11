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

app.get('/', async function(request, response) {
  const docs = await User.find()
  response.send(docs)
  //keeping this as a test for future alterations
})

app.post('/users', function(request, response) {
  const {
    user_id,
    username,
    points
  } = request.body
  User.create({
    user_id,
    username,
    points
  })
  .then(user => response.send(user))
  .catch(error => response.status(500).send({
    error: error.message
  }))
})

app.delete('/users', function(request, response) {
  const user_id = request.body.user_id
  User.deleteOne({ user_id: user_id})
    .then(result => {response.send(result)})
    .catch(error => {response.status(500).send(error)})

})


app.listen(process.env.PORT || 4000, () => console.log(`Listening`))
