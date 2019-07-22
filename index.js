require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

// var whitelist = ['https://elated-lovelace-d9b735.netlify.com', 'https://supermarche-croissant-13272.herokuapp.com/' ]
// // uncomment when working local
// // whitelist.push('http://localhost:3000')
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// const corsOptions = {
//   origin: [
//     'https://elated-lovelace-d9b735.netlify.com/*',
//     'https://stormy-tundra-35633.herokuapp.com/*',
//     'https://supermarche-croissant-13272.herokuapp.com/*',
//   ],
//
// }




app.use(cors())
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

app.use('/users', require('./routes/users'))
app.use('/authUsers', require('./routes/authUsers'))
app.use('/logs', require('./routes/logs'))

// app.get('/', (req, res) => {
//   res.status(200).sendFile(path.join(__dirname, 'front.html'));
// });


app.get('/', async function(request, response) {
  const docs = await User.find()
  response.status(200).send(docs)
  //keeping this as a test for future alterations
})

app.listen(process.env.PORT || 5000, () => console.log(`Listening`))
