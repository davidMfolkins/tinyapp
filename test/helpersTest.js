const { assert } = require('chai');

const { userLookUp, urlsForUser } = require('../helpers.js');

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

  it('should return undefined if we dont have a valid email', function() {
    const user = userLookUp(testUsers, "user3@example.com")
    const expectedOutput = undefined


    assert(JSON.stringify(user) === JSON.stringify(expectedOutput))
  })
});

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  i7m3n2: { longURL: "https://www.google.ca", userID: "0m8j6g" }
};

describe('urlsForUser', function() {
  it('should return URLs only for that user', function() {
    const userUrl = urlsForUser(urlDatabase, "0m8j6g")
    const expectedOutput = { i7m3n2: { longURL: "https://www.google.ca", userID: "0m8j6g" } }


    assert(JSON.stringify(userUrl) === JSON.stringify(expectedOutput))
  });

  it('should return {} if that user doesnt have associated URLs', function() {
    const userUrl = urlsForUser(testUsers, "0m8999")
    const expectedOutput = {}

    console.log(userUrl)
    console.log(expectedOutput)


    assert(JSON.stringify(userUrl) === JSON.stringify(expectedOutput))
  })
});

