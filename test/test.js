require('dotenv').config()
//
const assert = require('assert')
const mongoose = require('mongoose')
const TestUser = require('../models/Users')
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

// app.listen(process.env.PORT || 4000, () => console.log(`Listening`))

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
        .delete('/users')
        .send({ user_id: '1234'})
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
        .delete('/users')
        .send({ user_id: '5678'})
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

// mongoose.connection.close()


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
