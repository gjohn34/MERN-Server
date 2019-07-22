const assert = require('assert')
const express = require('express')
const app = express()
const request = require('supertest')
const bodyParser = require('body-parser')
const TestAuthUser = require('../../models/AuthUsers')

app.use(bodyParser.json());
app.use('/authUsers', require('../../routes/authUsers'))

describe('checking /authUsers is created', function () {
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
          .end(function(error, response) {
            if (error) return done(error)
            console.log(response);
            done()
          })
      });
    });
  });
});
