var express = require('express');
var router = express.Router();
var parser = require('rss-parser');

// var ips = []

// router.get('/', ensureAuthenticated, function(req, res){
router.get('/', function(req, res){
	res.render('index');
});

router.post('/getFreeFeed', function(req, res) {
	console.log("index")
	console.log(req.body.url)

	parser.parseURL(req.body.url, function(err, parsed) {
		console.log("parsed feed")
		console.log(parsed)
		if(err){
			console.log(err);
			res.json(err);
		} else {
			// parsed.feed.entries.forEach(function(entry) {
			// 	console.log(entry);
			// })
	
			res.json(parsed);
		}
	})
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
		//use ensureAuthenticated.
	}
}

module.exports = router;