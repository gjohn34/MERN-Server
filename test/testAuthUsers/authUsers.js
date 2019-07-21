const assert = require('assert')
const express = require('express')
const app = express()
const request = require('supertest')
const bodyParser = require('body-parser')
const TestAuthUser = require('../../models/AuthUsers')

app.use(bodyParser.json());
app.use('/authUsers', require('../../routes/authUsers'))

describe('checking if an auth user is created', function () {
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
        request(app)
          .get('/authUsers')
          .expect(200)
          .end(function(error, response) {
            if (error) return done(error)
            assert.equal(response.body.length, 0)
            done()
        })
      });
    });
  });
});
