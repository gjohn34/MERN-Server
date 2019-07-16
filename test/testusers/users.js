const assert = require('assert')
const TestUser = require('../../models/Users')
const TestLog = require('../../models/Logs')
const express = require('express')
const app = express()
const request = require('supertest')
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use('/users', require('../../routes/users'))

describe('Checking to see if a user is created or not', function () {
  describe('GET /users/:user_id', function() {
    context('user does not exist', function() {
      it('should return 404', function (done) {
        request(app)
          .get('/users/4567')
          .expect(404, done)
      })
    })
    context('user does exist', function() {
      it('should return user object', function(done) {
        request(app)
        .get('/users/1234')
        .expect(200, done)
        .expect(function(response, error) {
          if (response.body.user_id != '1234') {
            throw new Error
          }
        })
      })
    })
  })

  describe('POST /users', function () {
    context('user does not exist', function() {
      it('should create a new user', function (done) {
        request(app)
          .post('/users')
          .send({ user_id: '5678' })
          .end(function(error, response) {
            if (error) return done(error)
            assert.equal(response.status, 200)
            assert.equal(response.body.user_id, '5678')
            done()
        })
      })
    })
    context('user exists in DB', function() {
      it('should return error', function(done) {
        request(app)
          .post('/users')
          .send({ user_id: '1234' })
          .expect(500, done)
      })
    })
  })

  describe('DELETE /users', function () {
    context('user exists in db', function () {
      it('should return a delete count of 1', function (done) {
        request(app)
          .delete('/users/1234')
          .expect(200)
          .end(function(error, response) {
            if (error) return done(error)
            assert.equal(response.body.deletedCount, '1')
            done()
        })
      });
    });
    context('user does not exist', function () {
      it('should return a delete count of 0', function (done) {
        request(app)
          .delete('/users/5678')
          .expect(404)
          .end(function(error, response) {
            if (error) return done(error)
            assert.equal(response.body.deletedCount, '0')
            done()
        })
      });
    });
  });

  describe('PATCH /users/:user_id', function () {
    context('user exists', function () {
      context('sending through username', function () {
        it('should return updated user', function (done) {
          request(app)
            .patch('/users/1234')
            .send({ username: 'test'})
            .expect(200)
            .end(function(error, response) {
              if (error) return done(error)
              assert.equal(response.body.username, 'test')
              done()
          })
        });
      });
      context('sending through points', function () {
        it('should return updated user', function (done) {
          request(app)
            .patch('/users/1234')
            .send({ points: '123' })
            .expect(200)
            .end(function(error, response) {
              if (error) return done(error)
              assert.equal(response.body.points, 123)
              done()
          })
        });
      });
      context('sending through points and username', function () {
        it('should return updated user', function (done) {
          request(app)
            .patch('/users/1234')
            .send({ username: 'new test', points: '50'})
            .expect(200)
            .end(function(error, response) {
              if (error) return done(error)
              assert.equal(response.body.points, '50')
              assert.equal(response.body.username, 'new test')
              done()
          })
        });
      });
    });
    context('user does not exist', function () {
      it('should return 404', function (done) {
        request(app)
          .patch('/users/5678')
          .expect(404, done)
      });
      it('should return 404', function (done) {
        request(app)
          .patch('/users/9999')
          .send({ username: '1234', points: '5678'})
          .expect(404, done)
      });
    });
  });

  describe('PATCH /users/:user_id/points', function () {
    context('user exists', function () {
      it('should return ok', function (done) {
        request(app)
          .patch('/users/1234/points')
          .expect(200, done)
      });
    });
    context('user does not exist', function () {
      it('should return 404', function (done) {
        request(app)
          .patch('/users/5678')
          .expect(404, done)
      });
    });
  });
});
