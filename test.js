require('dotenv').config()

const assert = require('assert')
const express = require('express')
const request = require('supertest')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


const app = express()


mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true}, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

app.use(bodyParser.json());
app.use('/', require('./routes/route'))

describe('GET /', function() {
  it('should return json object of users', function(done) {
    this.timeout(3000)
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .end(function(error, result) {
        if (error) return done(error)
        done()
      })
      // .expect(200, done)
  })
})

describe('POST /users', function() {
  it('should register a new user', function(done) {
    this.timeout(4000)
    request(app)
    //compare result to sent data
      .post('/users')
      .send({ user_id: "1234", username: "test", points: "10"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function(error, response) {
        assert.equal(response.body.username, 'test')
        if (error) return done(error)
        done()
    })
  })
})

describe('DELETE /users', function() {
  it('should remove a user from the database', function (done) {
    this.timeout(6000)
    TestUser = mongoose.model('TestUser', new mongoose.Schema({ user_id: String}))
    TestUser.create({ user_id: '1234'})

    request(app)
      .delete('/users')
      .send({ user_id: 1234})
      .set('Accept', 'application/json')
      .end(function(error, result) {
        if (error) return done(error)
        .expect(result.body.deletedCount == 1)
        done()
    })
  })
})
