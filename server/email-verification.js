var fs = require('fs');
var uuid = require('uuid');

var models = require('./models');
var Token = models.getCollection('Token');
var User = models.getCollection('User');

var mailgun = require('./mailgun');


var emailToSendFrom = "SE3316 <noreply@jaypatel.co>"; //using private email for demo purposes
var emailSubject = "Please verify your email.";

/**
 * @param user: user obj
 */
var verifyUser = function(user) {
	// create verification token
	var newToken = new Token({
		created: new Date(),
		expires: new Date(Date.now() + (1000 /*milisec*/ * 60 /*sec*/ * 60 /*min*/ * 24 /*hr*/ * 5 /*day*/)),
		data: uuid(),
		category: 'EmailVerification',
		recipientId: user._id,
	});
	newToken.save({ validateBeforeSave: true }, function(err, verificationToken) {
		if (err) {
			return console.log(err);
		};
		// send email
		var verificationUrl = "http://" + global.__environmentDomainName + "/verify/" + verificationToken.data;
		var emailBody = '<p>Hey ' + user.name + ',<br/>Verify your email by clicking the following link: <a href="' + verificationUrl + '" target="_blank">' + verificationUrl + '</a></p>';

		var toField = {};
		toField[user.name] = user.email.address;
		var sendData = {
			to: new mailgun.builders.MailToOrFromField([toField]),
			from: new mailgun.builders.MailToOrFromField([emailToSendFrom]),
			subject: emailSubject,
			html: emailBody,
		};

		var mailJob = mailgun.create(sendData);
		if (mailJob) {
			mailJob.send(function(err) {
				if (err) {
					return console.log(err);
				};
			});
		};
	});
};

var confirmToken = function(tokenData, callback) {
	Token.findOne({data: tokenData}).exec(function(err, tok) {
		if (err) {
			return callback(err);
		}
		if (tok) {
			if (new Date() < new Date(tok.expires)) {
				User.findById(tok.recipientId).exec(function(err, user) {
					if (err || !user) {
						return callback(new Error('User does not exist'));
					};
					user.email.isVerified = true;
					user.save({validateBeforeSave: true}, callback);
				});
			} else {
				callback(new Error('Token expired.'));
			};
			Token.findByIdAndRemove(tok._id, function() {});
		} else {
			callback(new Error('Token does not exist.'));
		};
	});
};


module.exports = {
	verifyUser: verifyUser,
	confirmToken: confirmToken,
};