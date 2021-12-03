var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator'); 

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var mongo = require('mongodb');
var mongoose = require('mongoose');
var morgan      = require('morgan');
var routes = require('./routes/index');
var users = require('./routes/users');
var keys = require('./apiKeys.js');

console.log(keys);

var targetConnection  = keys.MONGODB_URI;

console.log("targetConnection");
console.log(targetConnection);

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };       

mongoose.connect(targetConnection, options);

var app = express();

app.use(morgan('dev'));

app.use(session({
    secret: 'mySuperSecretSecret',
    saveUninitialized: true,
    resave: true
}));

// ejs.delimiter = "%";
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(function (req, res, next) {
  // res.locals.success_msg = req.flash('success_msg');
  // res.locals.error_msg = req.flash('error_msg');
  // res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.loggedIn = false;
  //get session info about wether user is logged in here
  next();
});

var apiRoutes = express.Router(); 
 
app.use('/', routes);
app.use('/users', users); 

app.set('port', (process.env.PORT || 8081));

app.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port'));
});