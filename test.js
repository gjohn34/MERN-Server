require('dotenv').config()

const assert = require('assert')
const express = require('express')
const request = require('supertest')
const mongoose = require('mongoose')

const app = express()


mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true}, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

app.use('/', require('./routes/route'))

// describe('GET /', function() {
//   it('should return json object', function(done) {
//     this.timeout(3000)
//     request(app)
//       .get('/')
//       .expect('Content-Type', /json/)
//       .end(function(error, result) {
//         if (error) return done(error)
//         done()
//       })
//       // .expect(200, done)
//   })
// })

describe('POST /user', function() {
  it('should register a new user', function(done) {
    request(app)
      request.body = { user_id: '1234', username: 'test', points: 10}
      .post('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(error, result) {
        if (error) return done(error)
        done()
    })
  })
})
