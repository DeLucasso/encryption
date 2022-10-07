//jshint esversion:6

const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption"); // the mongoose encryption module

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
  useNewUrlParser: true
});

app.set('view engine', 'ejs');

// DB Schema // Added new mongoose.Schema () to include encryption
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// our encryption key
const secret = "Thisisourlittlesecret.";

// our schema that is utilizing encryption, and encrypting ONLY password item in db.
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

// Model
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

// ------------------------------------------
app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save( (err) => {
    if (!err) {
      console.log("User saved");
      res.render("secrets");
    } else {
      res.render(err);
      console.log(err);
    }
  });
});
// ------------------------------------------

app.post("/login", (req, res) => {
const username = req.body.username ;
const password = req.body.password;

User.findOne({ email: username }, (err, foundUser) => {
  if (err) {
    console.log(err);
  } else {
    if (foundUser) {
      if (foundUser.password === password) {
        console.log("Logging you in!");
        res.render("secrets");
      } else {
        console.log("Not registered! Try again!");
        res.render("login");
      }
    }
  }
});
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
