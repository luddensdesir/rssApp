var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	folders: {
		type: Array
	},
	token: {
		type: String
	}
});

var User = mongoose.model('User', UserSchema);
var NewUser = mongoose.model('Newuser', UserSchema);

module.exports = User;

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash
	        newUser.save(callback)
	    })
	})
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback)
}

//not sure if either of these are the best way to do it, taking the whole thing and replacing the whole thing, but i dont care right now
module.exports.updateUser = function(id, replacement, token, callback){
	// https://stackoverflow.com/questions/31120111/mongodb-find-and-then-update
	User.update({ 
        _id: id,
        token: token
    }, { 
        "$set": {
            folders: replacement
        }
    }, {
        "multi": true
    }, function(err, doc){
     //    console.log("***************************************");
    	// console.log(doc)
     //    console.log("***************************************");
    })
 
	// User.findOneAndUpdate({_id: id}, {$set:{folders: replacement}}, function(err, doc){
 //        console.log("***************************************");
	// 	console.log(doc)
	// 	console.log("token")
 //        console.log("***************************************");
	//     if(err){
	//         console.log(err);
	//     }
	// })
}

module.exports.updateUserToken = function(id, replacement, callback){
	// https://stackoverflow.com/questions/31120111/mongodb-find-and-then-update
	User.update({ 
        _id: id
        // token: token
    }, { 
        "$set": {
            token: replacement
        }
    }, {
        "multi": true
    }, function(err, doc){
     //    console.log("***************************************");
    	// console.log(doc)
     //    console.log("***************************************");
    }) 
}

module.exports.cancelToken = function(id, replacement, token, callback){
	// https://stackoverflow.com/questions/31120111/mongodb-find-and-then-update
	User.update({ 
        _id: id,
        token: token
    }, { 
        "$set": {
            token: replacement
        }
    }, {
        "multi": true
    }, function(err, doc){
     //    console.log("***************************************");
    	// console.log(doc)
     //    console.log("***************************************");
    }) 
}

module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback)
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}