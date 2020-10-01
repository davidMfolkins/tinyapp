const { assert } = require('chai');

const { userLookUp } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('userLookUp', function() {
  it('should return a user object with valid email', function() {
    const user = userLookUp(testUsers, "user@example.com")
    const expectedOutput = {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    }


    assert(JSON.stringify(user) === JSON.stringify(expectedOutput))
  });

  it('should return undefined is we dont have a valid email', function() {
    const user = userLookUp(testUsers, "user3@example.com")
    const expectedOutput = undefined


    assert(user === expectedOutput)
  })
});

