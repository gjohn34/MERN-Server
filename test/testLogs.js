require('dotenv').config()
//
const assert = require('assert')
const mongoose = require('mongoose')
const TestUser = require('../models/Users')
const TestLog = require('../models/Logs')
const express = require('express')
const app = express()
const request = require('supertest')
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use('/', require('../routes/route'))

mongoose.connect(process.env.DB_TEST_HOST, {useNewUrlParser: true}, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

after(() => { mongoose.connection.close() })

beforeEach(async function() {
  await TestUser.create({user_id: '1234'});
  // await TestLog.create({action: 'new', user: '1234', time: new Date});
});

afterEach(async function() {
  await TestUser.deleteMany({});
  await TestLog.deleteMany({});
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
        .delete('/users')
        .send({ user_id: '1234'})
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
