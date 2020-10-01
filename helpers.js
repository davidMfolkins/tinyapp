// function that looks up a user and returns the user object
const userLookUp = function(obj, email) {
  let user = [];
  for (const key in obj) {
    user.push(obj[key]);
  }
  for (const item of user) {
    if (item.email === email)
      return item;
  }
};

//function that only shows URLs created by the logged in user, other links aren't shown
const urlsForUser = function(urlDatabase, userId) {
  const filteredUrls = {};

  for (let shortURL in urlDatabase) {
    const urlObj = urlDatabase[shortURL]
    if (urlObj.userID === userId) {
      filteredUrls[shortURL] = urlObj;
    }
  }
  return filteredUrls
}

module.exports = { userLookUp, urlsForUser }