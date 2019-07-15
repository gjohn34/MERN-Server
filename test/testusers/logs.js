const assert = require('assert')
const TestUser = require('../../models/Users')
const TestLog = require('../../models/Logs')
const express = require('express')
const app = express()
const request = require('supertest')
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use('/users', require('../../routes/users'))

describe('POST /users', function () {
  context('creating a new user should add a log file', function () {
    it('should create a log with user data',  function (done) {
      request(app)
        .post('/users')
        .send({ user_id: '5678', username: 'test', points: '1' })
        .expect(200)
        .end(async function(error, response) {
          if (error) return done(error)
          const logs = await TestLog.find({})
          assert.equal(logs.length, 1)
          assert.equal(logs[0].action, 'new')
          assert.equal(logs[0].user, '5678')
          done()
      })
    });
  })
  context('user already exists', function () {
    it('should throw an error and not create a log', function (done) {
      request(app)
        .post('/users')
        .send({ user_id: '1234'})
        .expect(500)
        .end(async function(error, response) {
          if (error) return done(error)
          const logs = await TestLog.find({})
          assert.equal(logs.length, 0)
          done()
      })
    });
  });
});

describe('DELETE /users', function () {
  context('user exists', function () {
    it('should create a log with user data', function (done) {
      request(app)
        .delete('/users/1234')
        .expect(200)
        .end(async function(error, response) {
          if (error) return done(error)
          const logs = await TestLog.find({})
          assert.equal(logs.length, 1)
          done()
      })
    });
  });
  context('user does not exist', function () {
    it('should return an error and not create a log', function (done) {
      request(app)
        .delete('/users')
        .send({ user_id: '5678'})
        .expect(404)
        .end(async function(error, response) {
          if (error) return done(error)
          const logs = await TestLog.find({})
          assert.equal(logs.length, 0)
          done()
        })
    });
  });
});

describe('/PATCH /user/:user_id', function () {
  context('user exists but no data passed', function () {
    it('should create a log with no change', function (done) {
      request(app)
        .patch('/users/1234')
        .expect(200)
        .end(async function(error, reponse) {
          if (error) return done(error)
          const logs = await TestLog.find({})
          assert.equal(logs.length, 1)
          assert.equal(logs[0].action, 'update: nothing')
          done()
      })
    });
  });
  context('user exists with valid data', function () {
    it('should create a log with user data', function (done) {
      request(app)
      .patch('/users/1234')
      .send({ username: 'test', points: '50' })
      .expect(200)
      .end(async function(error, response) {
        if (error) return done(error)
        const logs = await TestLog.find({})
        assert.equal(logs.length, 1)
        assert.equal(logs[0].action, 'update: username points')
        assert.equal(logs[0].user, '1234')
        done()
      })
    });
  });
  context('user does not exist', function() {
    it('should return 404 with no log', function (done) {
      request(app)
        .patch('/users/5678')
        .send({ username: 'test', points: '100'})
        .expect(404, done)
    });
  })
});
