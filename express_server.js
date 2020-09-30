const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_login", templateVars);
});

app.post("/urls", (req, res) => {
  const randomID = Math.random().toString(36).substr(2, 6);
  urlDatabase[randomID] = req.body.longURL;
  res.redirect(`/urls/${randomID}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const user = userLookUp(users, req.body.email);
  if (user) {
    if (user.password === req.body.password) {
      res.cookie("user_id", user.id);
      res.redirect("/urls");
    }
  } else {
    res.send("403: Failed to login");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

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
    password: req.body.password
  };
  res.cookie("user_id", randomID);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});