const assert = require('assert')
const express = require('express')
const app = express()
const request = require('supertest')
const TestLog = require('../../models/Logs')


const testLogs = [{
  action: 'new',
  user: '1234',
  time: new Date
}, {
  action: 'kick',
  user: '1234',
  time: new Date
}, {
  action: 'new',
  user: '3456',
  time: new Date
}]

app.use('/logs', require('../../routes/logs'))

describe('GET /logs', function () {
  it('should return okay', function (done) {
    TestLog.create(testLogs).then(() => {
      request(app)
        .get('/logs')
        .expect(200)
        .end(function(error, response) {
          if (error) return done(error)
          assert.equal(response.body.length, 3)
          done()
        })
    })
  });
});
