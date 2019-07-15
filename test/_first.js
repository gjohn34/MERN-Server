require('dotenv').config()
const assert = require('assert')
const mongoose = require('mongoose')
const TestUser = require('../models/Users')
const TestLog = require('../models/Logs')

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
