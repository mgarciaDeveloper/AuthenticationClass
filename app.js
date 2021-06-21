//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();



app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//mongoose.connect("mongodb+srv://admin-mgarcia:midway10@cluster0.0vq14.mongodb.net/users", { //we only use it to go online
mongoose.connect("mongodb://localhost:27017/authenticationDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//now, we create a schema to a database, or, to a collection
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = "ThisisOurLittkeSecret"
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['email','password'] });

console.log(process.env.SECRET);
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


//and now, we create a collection
const User = new mongoose.model("User", userSchema);


app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (err) {
      console.log(err)
    } else {
      res.render("secrets");
    }
  });
});

//see! we don't have an app.get('/secrets'), because we don't want to give acess to that route.
// the only way to do that, is with the path above: going through a Register


app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
            res.render("secrets");
        }
    }
  }
  });
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});
