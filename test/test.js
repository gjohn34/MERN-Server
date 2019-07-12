require('dotenv').config()
//
const assert = require('assert')
const mongoose = require('mongoose')
const TestUser = require('../models/Users')
const express = require('express')
const app = express()
const request = require('supertest')
const bodyParser = require('body-parser')



mongoose.connect(process.env.DB_TEST_HOST, {useNewUrlParser: true}, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

beforeEach(async function() {
  await TestUser.create({user_id: '1234'})
});

afterEach(async function() {
  await TestUser.deleteMany({})
})


describe('basics', function () {
  it('should equal 2', function () {
    assert.equal(1+1, 2)
  });
  it('should equal 4', function () {
    assert.equal(2+2, 4)
  });
});

describe('finding', function() {
  it('should find a user', async function() {
    const docs = await TestUser.findOne()
    assert.equal(docs.user_id, '1234')
    assert.notEqual(TestUser.countDocuments(), 0)
  })
})


// app.use(bodyParser.json());
// app.use('/', require('./routes/route'))
// TestUser = mongoose.model('TestUser', new mongoose.Schema({ user_id: String}))
//
// describe('Connect to DB', async function(done) {

//   })
//
//   beforeEach(async function(done) {
//     mongoose.dropCollection('users', async function(error) {
//       if (error) return done(error)
//       await User.create({ user_id: '1234'})
//       done()
//     })
//   })
// })
//
//
// // describe('GET /', function() {
// //   it('should return json object of users', function(done) {
// //     this.timeout(10000)
// //     request(app)
// //       .get('/')
// //       .expect('Content-Type', /json/)
// //       .end(function(error, response) {
// //         if (error) return done(error)
// //         done()
// //       })
// //   })
// // })
//
// // describe('GET /users/:user_id', function() {
// //   it('should return json object of correct user', function(done) {
// //     this.timeout(10000)
// //     TestUser.create({ user_id: '1234'})
// //
// //     request(app)
// //       .get('/users/1234')
// //       .set('Accept', 'application/json')
// //       .expect('Content-Type', /json/)
// //       .end(function(error, response) {
// //         if (error) return done(error)
// //         .expect(response.body.user_id == '1234')
// //         done()
// //       })
// //   })
// // })
//
// // describe('POST /users', function() {
// //   it('should register a new user', function(done) {
// //     this.timeout(10000)
// //     request(app)
// //     //compare result to sent data
// //       .post('/users')
// //       .send({ user_id: "1234", username: "test", points: "10"})
// //       .set('Accept', 'application/json')
// //       .expect('Content-Type', /json/)
// //       .end(function(error, response) {
// //         assert.equal(response.body.username, 'test')
// //         if (error) return done(error)
// //         done()
// //     })
// //   })
// // })
//
// describe('PATCH /users/:user_id', function() {
//   context('user exists in database', function() {
//     it('should return the user', function(done) {
//       this.timeout(10000)
//       request(app)
//         .patch('/users/1234')
//         .expect(200, {
//           user_id: '1234'
//           })
//         })
//       })
//   context('user does not exist in database', function(done) {
//     it('should return 404', function () {
//       request(app)
//         .patch('/users/1234')
//         .expect(404, done)
//     })
//   })
// })
//
// // describe('DELETE /users', function() {
// //   it('should remove a user from the database', function (done) {
// //     this.timeout(10000)
// //     TestUser.create({ user_id: '1234'})
// //
// //     request(app)
// //       .delete('/users')
// //       .send({ user_id: 1234})
// //       .set('Accept', 'application/json')
// //       .end(function(error, response) {
// //         if (error) return done(error)
// //         .expect(response.body.deletedCount == 1)
// //         done()
// //     })
// //   })
// // })
