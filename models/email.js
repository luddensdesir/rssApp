const nodemailer = require('nodemailer');
var mongoose = require('mongoose');

// User Schema
var EmailSchema = mongoose.Schema({
	from: {
		type: String,
	},
	to: {
		type: String
	},
	subject: {
		type: String
	},
	text: {
		type: String
	}
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
	user: 'awwocapp@gmail.com',
	clientId: '367212784837-dhnmv2jmshgb8ad8sgo1dtp9mp6089np.apps.googleusercontent.com',
	clientSecret: '6TDi0WsyjqJQ_LY-tzQnfWVW ',
	refreshToken: '1/Yftr7zaG_t0yzHnk4ivdt4L-u0sd7g2j0yhgLT8ifNiROPXhxxuCXycfV5vS9u-S',
  	accessToken: 'ya29.GltDBCMxm7YS1oexgQAWgfcZ_vMV7ayUgRRHKiUvphpQb5GgOAu9X4UGm9tNIDP3h3Xxi5_J9VldeF9maLhrTQ_xAz321DHefVb0moFT6Q_3wihNPQDH7KAC_euiL'
  }
});

var Email = module.exports = mongoose.model('Email', EmailSchema);

var signupMail = {
    from: 'RSS App <awwocapp@gmail.com>',
    to: 'luddensd@gmail.com',
    subject: 'RSS App Email',
    text: "Empty Mail"
}

module.exports.confirmSignup = function(newUser, callback){
	transporter.sendMail(signupMail, function (err, res) {
	    if(err){
	        console.log(err);
	    } else {
	        console.log('Email Sent.');
	    }
	})
}
