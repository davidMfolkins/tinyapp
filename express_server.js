const express = require("express");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { userLookUp, urlsForUser } = require("./helpers");
const app = express();
const salt = bcrypt.genSaltSync(10);
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.set("view engine", "ejs");

// Database with all the test URLs
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// Database with all the test users
const users = {
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

app.get("/", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };

  if (user) {
    const filteredForUser = {
      urls: urlsForUser(urlDatabase, user.id),
      user: users[req.session.user_id]
    };

    res.render("urls_index", filteredForUser);
  } else {
    res.render("urls_login", templateVars);
  }
});
// Displays URLs to logged in user, and only URLs they created
app.get("/urls", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };

  if (user) {
    const filteredForUser = {
      urls: urlsForUser(urlDatabase, user.id),
      user: users[req.session.user_id]
    };

    res.render("urls_index", filteredForUser);
  } else {
    res.render("urls_login", templateVars);
  }
});

// Shows users the page to create new URL, if nto logged in redirects them to register
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = {
    user: users[req.session.user_id]
  };
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.render("urls_login", templateVars);
  }
});

// Displays the newly created URL to the user
app.get("/urls/:shortURL", (req, res) => {
  const urls = {};
  urls["url"] = urlDatabase[req.params.shortURL].longURL;

  const templateVars = {
    urls: urls,
    shortURL: req.params.shortURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

// Redirects user to the URL of that short url
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL
  );
});

// Displays register page for unregistered users
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_register", templateVars);
});

// Displays register page for logged in users
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars);
});

//Creates a new URL, assigns it a random ID and links it to the user by user ID
app.post("/urls", (req, res) => {
  const userID = users[req.session.user_id].id;
  const randomID = Math.random().toString(36).substr(2, 6);
 
  urlDatabase[randomID] = { longURL: req.body.longURL, userID: userID };
  res.redirect(`/urls/${randomID}`);

});

// Deletes a URL from the URL list, only user that created the URL can delete it
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session.user_id];
  if (user) {
    delete urlDatabase[req.params.shortURL];
  } else {
    res.send("You are not authorized to delete this");
  }

  res.redirect("/urls");
});

// Deletes a URL from the URL list, only user that created the URL can delete it
app.post("/urls/:shortURL", (req, res) => {
  const userID = urlDatabase[req.params.shortURL].userID;
  const user = users[req.session.user_id];

  if (user) {
    urlDatabase[req.params.shortURL] = { longURL: req.body.longURL, userID: userID };
    res.redirect("/urls");
  } else {
    res.send("You are not authorized to edit this");
  }
});

//Allows unregistered to register
app.post("/register", (req, res) => {
  const randomID = Math.random().toString(36).substr(2, 6);
  const user = userLookUp(users, req.body.email);
  if (user) {
    res.send("Error 400: Email already exists.");
    return;
  }
  if (req.body.email === "" || req.body.password === "") {
    res.send("Error 400: Cannot leave email or password undefined");
    return;
  }
  users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt)
  };
  console.log(users[randomID]);
  req.session["user_id"] = users[randomID].id;
  res.redirect("/urls");
});

// Allows registered user to login
app.post("/login", (req, res) => {
  const user = userLookUp(users, req.body.email);
  if (user) {
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) {
        req.session["user_id"] = user.id;
        res.redirect("/urls");
      } else if (err) {
        console.log("Bcrypt didn't work");
      } else {
        res.send("403: Failed to login");
      }
    });
  }
});

// Allows logged in user to log out, cookies are deleted
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


//Listens to specified PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});