require('dotenv').config()//
var encrypt = require('mongoose-encryption');

const bcrypt = require('bcrypt');
const saltRounds = 10;
//const myPlaintextPassword = 's0/\/\P4$$w0rD';
//const someOtherPlaintextPassword = 'not_bacon';


var fs = require('fs');
var md5 = require('md5');


const express = require('express');
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


main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/testencryption');
}
const userSchema = new mongoose.Schema ({
  email: String,
  password: String,});//setting the model  


// Add any other plugins or middleware here. For example, middleware for hashing passwords


const User = new mongoose.model("User", userSchema);

        mongoose-encryption
// we  have encryption key and We can decrypt it .
var encKey = process.env.SOME_32BYTE_BASE64_STRING;
var sigKey = process.env.SOME_64BYTE_BASE64_STRING;
userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });
// This adds _ct and _ac fields to the schema, as well as pre 'init' and pre 'save' middleware,
// and encrypt, decrypt, sign, and authenticate instance methods
// exclude age from encryption, still encrypt name. _id will also remain unencrypted
userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, excludeFromEncryption: ['password'] });
// encrypt age regardless of any other options. name and _id will be left unencrypted
userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['password'] });
userSchema.plugin(encrypt, { encryptionKey: encKey,  encryptedFields: ['password'] });




 //        md5
 app.post("/register", function(req, res){
  const user = new User({
    username: req.body.username,
    password: md5(req.body.password)// make hash password 
    //And this will be impossible to reverse.
//We can't decrypt it and we don't have any sort of encryption key that leaves it vulnerable.
  });
   user.save(function(err){
  if(err){
   console.log(err);
  }else{
    res.render("secrets");
  }
   })
});
app.post("/login", function(req, res){
  username=req.body.username;
  password= md5(req.body.password);
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{//else if err
      if(foundUser.password===password){
         res.render("secrets"); 
      }else{// foundUser
        res.render("login");
      }
    }
  });
 
});



    bcrypt
So now we have qwerty and a random set of salt.
We pass it through our hash function, bcrypt, and we end up with a hash.
Now that's one round of salting.
If we wanted to have two rounds of salting, then we take the hash that was generated in round 1 and we
add the same salt from before. And now we run it through bcrypt the hash function again and we end up
with a different hash. And the number of times you do this is the number of salt rounds.


app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
   

  const user = new User({
    email: req.body.username,
    password: hash
  });

   user.save(function(err){
  if(err){
   console.log(err);
  }else{
    res.render("secrets");
  }

   })

  });// hash

});



app.post("/login", function(req, res){
  username=req.body.username;
  password= req.body.password;

  User.findOne({email:username},function(err,foundUser){
    
    if(err){
      console.log(err);
    }else{
      if(foundUser){

        bcrypt.compare(password,foundUser.password, function(err, result) {
          // result == true
            if(result===true){
              res.render("secrets");
            }else{
              console.log("bcrypt: "+result);
              res.render("login");
            }
         });//bcrypt
      
      }else{// foundUser
        res.render("login");

      }
   

    }//else if err

  

  });
 
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/", function(req, res){
  res.render("home");
});

app.get("/logout", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});
//process.env.PORT||
app.listen(port,function(){
  console.log(` listening `);
});
