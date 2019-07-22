require('dotenv').config()

const assert = require('assert')
const express = require('express')
const app = express()
const request = require('supertest')
const bodyParser = require('body-parser')
const TestAuthUser = require('../../models/AuthUsers')
const mongoose = require('mongoose')

app.use(bodyParser.json());
app.use('/authUsers', require('../../routes/authUsers'))


mongoose.connect(process.env.DB_TEST_HOST, {useNewUrlParser: true}, (error) => {
  if (error) {
    console.error("Error connecting to database.", error);
  } else {
    console.log("Connected to database");
  }
})

after(() => { mongoose.connection.close() })

beforeEach(async function() {
  await TestAuthUser.create({user_id: '1234'});
});

afterEach(async function() {
  await TestAuthUser.deleteMany({});
})

describe('GET /authUsers', function () {
  context('authUsers do exist', function () {
    it('should return all authUsers', function (done) {
      request(app)
        .get('/authUsers/')
        .expect(200)
        .end(function(error, response) {
          if (error) return done(error)
          assert.equal(response.body.length, 1)
          done()
        })
      });
    });
  context('authUsers do not exist', function () {
    it('should return 0 users', function (done) {
      TestAuthUser.deleteMany().then(() => {
        request(app)
          .get('/authUsers')
          .expect(200)
          .end(function(error, response) {
            if (error) return done(error)
            assert.equal(response.body.length, 0)
            done()
        })
      })
    });
  });
});
describe('POST /authUsers', function () {
  context('creating a user without error', function () {
    it('should return the new authUser', function (done) {
      request(app)
        .post('/authUsers')
        .send({ user_id: '5678', username: 'test'})
        .expect(200)
        .end(function(error, response) {
          if (error) return done(error)
          assert.equal(response.body.user_id, '5678')
          done()
        })
    });
  });
  context('creating a duplicate user', function () {
    it('should return an error', function (done) {
      request(app)
        .post('/authUsers')
        .send({ user_id: '1234'})
        .expect(500)
        .end(async function(error, response) {
          const docs = await TestAuthUser.find()
          assert.equal(docs.length, 1)
          assert.equal(response.body.code, 11000)
          done()
        })
    });
  });
});
describe('DELETE /authusers/:id', function () {
  context('user exists', function () {
    it('should return confirmation of delete', function (done) {
      request(app)
        .delete('/authUsers/1234')
        .expect(200)
        .end(function(error, response) {
          if (error) return done(error)
          assert.equal(response.body.deletedCount, 1)
          done()
        })
    });
  });
  context('user does not exist', function () {
    it('should return 0 user deleted', function (done) {
      request(app)
        .delete('/authUsers/5678')
        .expect(200)
        .end(function(error, response) {
          if (error) return done(error)
          assert.equal(response.body.deletedCount, 0)
          done()
        })
    });
  });
});
