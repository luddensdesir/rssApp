var tryRequire = require('try-require')
var private = require('./private.js')

var privateData;

if(process.env.HEROKU){
    var env = process.env
    privateData = {
        MONGODB_URI: env.MONGODB_URI,
        secret: env.secret
    }
    console.log("Heroku...")
} else {
    // var url = __dirname + '\\private.js'
    // if(tryRequire.resolve(url)){
      privateData = private;
    // }

    console.log("Localhost...")
    console.log(tryRequire.lastError())
}

module.exports = privateData