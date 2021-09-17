
require('dotenv').config()// .env
var encrypt = require('mongoose-encryption');

const bcrypt = require('bcrypt');
const saltRounds = 10;
//const myPlaintextPassword = 's0/\/\P4$$w0rD';
//const someOtherPlaintextPassword = 'not_bacon';


var fs = require('fs');
var md5 = require('md5');


const express = require('express');
const session = require('express-session');// session ID
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//var methodOverride = require('method-override')
//app.set(methodOverride('_method'))
  const app = express();

 var bodyParser = require('body-parser');
 const _=require('lodash');
 const {render} = require("ejs");
 const mongoose = require('mongoose');
const { isElement } = require('lodash');



  const port=3000;

 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended:true}));

 app.set('view engine','ejs');


 app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
 
}));
app.use(passport.initialize());
app.use(passport.session());

//mongoose.set("useCreateIndex", true);

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/users');
}

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,});//setting the model  

  //passportLocalMongoose and that is what we're going to use to hash and salt our passwords and to save
//our users into our MongoDB database.
userSchema.plugin(passportLocalMongoose);



const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});

app.post("/login", function(req, res){
/*
route where we of course check whether if they are indeed authenticated or not.
So both when they've successfully registered and when they've successfully logged in using the right
credentials, we're going to send a cookie and tell the browser to hold onto that cookie because the cookie
has a few pieces of information that tells our server about the user, namely that they are authorized
to view any of the pages that require authentication.
So let's go ahead and hit save and
*/


  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});


app.get("/secrets", function(req, res){
  /*it inside this cookie called connect.sid and it's set to expire when our browsing session ends.
  So that means that when I quit Chrome and I open it again and I try to go back to localhost:3000/
  /secrets, you can see that I am now no longer authenticated because that cookie got deleted
  by my browser because it's set to expire when I close down my browser.*/
  console.log("is "+req.isAuthenticated());
  if(req.isAuthenticated()){
    res.render("secrets"); 
  }else{
    res.redirect("/login");
  }
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/", function(req, res){
  res.render("home");
});

app.get("/logout", function(req, res){
  console.log("logout");
  req.logout();
  
  res.redirect("/");
});

app.get("/register", function(req, res){
  res.render("register");
});
//process.env.PORT||
app.listen(port,function(){
  console.log(` listening `);
});



