
require('dotenv').config()// .env

/*var encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;*/
/*var fs = require('fs');
var md5 = require('md5');*/


const express = require('express');
const session = require('express-session');// session ID
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const GoogleStrategy = require('passport-google-oauth20').Strategy;
//https://www.passportjs.org/packages/passport-google-oauth20/
const findOrCreate = require('mongoose-findorcreate');
//https://www.npmjs.com/package/mongoose-findorcreate


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



main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/usersDB');
}

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});//setting the model  

  //passportLocalMongoose and that is what we're going to use to hash and salt our passwords and to save
//our users into our MongoDB database.
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);

  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));


app.get("/", function(req, res){
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });


  app.get("/login", function(req, res){
    res.render("login");
  });
  
  app.get("/register", function(req, res){
    res.render("register");
  });
  
  app.get("/secrets", function(req, res){
    User.find({"secret": {$ne: null}}, function(err, foundUsers){
      if (err){
        console.log(err);
      } else {
        if (foundUsers) {
          res.render("secrets", {usersWithSecrets: foundUsers});
        }
      }
    });
  });
  
  app.get("/submit", function(req, res){
    if (req.isAuthenticated()){
      res.render("submit");
    } else {
      res.redirect("/login");
    }
  });
  
  app.post("/submit", function(req, res){
    const submittedSecret = req.body.secret;
  
  //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
    // console.log(req.user.id);
    User.findById(req.user.id, function(err, foundUser){
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          foundUser.secret = submittedSecret;
          foundUser.save(function(){
            res.redirect("/secrets");
          });
        }
      }
    });
  });
  
  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });
  
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


//process.env.PORT||
app.listen(port,function(){
  console.log(` listening `);
});



