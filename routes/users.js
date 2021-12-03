var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt    = require('jsonwebtoken');
var EmailSystem = require('../models/email');
var parser = require('rss-parser');
var User = require('../models/user');
var secret  = require("../apiKeys").secret;

var AES = require('gibberish-aes/src/gibberish-aes.js'); 
//https://www.npmjs.com/package/gibberish-aes

var aesSecret = "This sentence is not so secret";
var aesPass = "1234"
AES.size(128);

router.post('/loginPage', function(req, res){
	res.render('partials/login');
})

router.post('/registerPage', function(req, res){
	res.render('partials/register');
})

router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var newUsername = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: newUsername,
			password: password,
			password: password,
			token: '',
			folders: [
					    {
					        "name":"Folder 1",
					        "description":"Folder 1",
					        // "dateAdded":"2017-05-13T18:50:53.716Z",
					        "totalSubs":0,
					        "subscriptions":[

					        ],
					        "renaming":false,
					        "actions":{
					            "Search":{
					                "name":"RSS Search",
					                "active":true
					            },
					            "Rename":{
					                "name":"Rename",
					                "active":true
					            },
					            "Delete":{
					                "name":"Delete",
					                "active":true
					            }
					        }
					    }
					]
		})

	   User.getUserByEmail(email, function(err, user){ 
	   		if(user){
				// console.log("Email " + email +  " already in use")
	   		} else{
			   	User.getUserByUsername(newUsername, function(err, user){
			   		if(user){
			   			// console.log("Username " + newUsername + " already in use")
			   		} else {
						User.createUser(newUser, function(err, user){
							if(err){
								throw err
							} else {
			   					console.log("User created")
								EmailSystem.confirmSignup(newUser, function(err, user){

								})
							}
						})
			   		}
				})
	   		}
		})

		// req.flash('success_msg', 'You are registered and can now login')

		res.render('partials/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'})
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'})
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user)
  });
});  

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
	User.getUserByUsername(req.body.username, function(err, user){
		if(err){
			console.log( user.username + ' login failure.');
			res.status(404);
			throw err
		} else {
	        if(user != null){
	        	encoded = user.username 
				encoded = AES.enc(encoded, aesPass);
		        var token = jwt.sign({name: encoded}, secret, {
		          expiresIn: '1m'
		        });

		        console.log(token)

				user.token = token 

			  	User.updateUserToken(user._id, user.token, function(error){
			  	})

				console.log( user.username + ' login success.');
			    res.render('partials/account', {
			    	folders: JSON.stringify(user.folders),
			    	user: user._id,
				  	username: user.username,
			        token: token
			    })
		    } else {
				console.log("Invalid user, try logging in")
				// res.status(403).render('partials/login');
				res.status(404);
			}
		}
	})
  });
router.post('/logout/:id', function(req, res){

  	// User.getUserById(req.params.id, function(err, user){
  		// console.log(req.body.token)
    	//check if stored token matches req.body.token, then remove
	  	User.cancelToken(req.params.id, '', req.body.token, function(error, NEWUSER){
	  	})
  	// })  	

	console.log("Logging Out")
 
	res.render('partials/login');
	// clear the login info screen
});

router.use(function(req, res, next) {
  var token = req.body.token/* || req.query.token || req.headers['authorization']*/; 

  if (token) {
  	console.log('Valid Token')
    jwt.verify(token, secret, function(err, decoded) {      
      if (err) {
  		console.log('Token Expired or Failed')
		res.status(403).render('partials/login');
      } else {
        console.log("Token Cleared")   
        console.log(token)   
        console.log(req.decoded)   
        req.decoded = decoded;
        next();
      }
    })

  } else {
    return res.status(403).render('partials/login');
  }
});

router.post('/preauth', function(req, res){
	var decoded = req.decoded.name
	decoded = AES.dec(decoded, aesPass)
	User.getUserByUsername(decoded, function(err, user){
		if(err){
			console.log( user.username + ' preauth failure.');
			throw err
		} else {
	        if(user != null){ 
				if(req.body.token == user.token){
					console.log( user.username + ' preauth success.');
				    res.render('partials/account', {
				    	folders: JSON.stringify(user.folders),
				    	user: user._id,
				    	username: user.username,
				        token: req.body.token
				    })
				} else {
					console.log("User logged out, try logging back in.")
					res.status(403).render('partials/login');
				}

			} else {
				console.log("Invalid user, try logging in")
				res.status(403).render('partials/login');
			}
		}
		res.end();
	})
})

router.post('/getfeed', function(req, res) {
	parser.parseURL(req.body.url, function(err, parsed) {
		if(err){
			console.log(err)
		}
	  parsed.feed.entries.forEach(function(entry) {
	    // console.log(entry.title + ':' + entry.link);
	  })
	  
	res.json(parsed);

	})
  });

//hit whenever saveUserInfo is run and user is logged in
router.post('/update/:id', function(req, res) {
  	console.log('update')
  	User.updateUser(req.params.id, req.body.folders, req.body.token, function(error, NEWUSER){
  	})
  });

module.exports = router;