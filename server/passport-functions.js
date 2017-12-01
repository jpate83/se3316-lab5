var bcrypt = require('bcryptjs');
var Q = require('q');
var models = require('./models');
var User = models.getCollection('User');
var sanitizeHtml = require('sanitize-html');
var EmailVerification = require('./email-verification.js');

var sanitizeStringForUserDocument = function(str) {
	return sanitizeHtml(str, {
		allowedTags: [],
	});
};

var saltOffset = 10; // for Salt and Hash

module.exports = {
	localReg: function(email, password, details) { // signup
		var name = sanitizeStringForUserDocument(details.name);

		var deferred = Q.defer();

		// check if email exists
		User.findOne({ 'email.address': email }).exec(function(err, emailMatch) {
			if (err) {
				return console.log(err);
			};
			if (emailMatch) {
				deferred.resolve({
					error: 'account exists',
				});
			} else { // if new account, generate password hash and save user to db
				bcrypt.genSalt(saltOffset, function(err, salt) {
					if (err) {
						console.log(err);
						deferred.resolve({
							error: 'internal error',
						});
					} else {
						bcrypt.hash(password, salt, function(err, hash) {
							if (err) {
								console.log(err);
								deferred.resolve({
									error: 'internal error',
								});
							} else {
								var newUser = new User({
									created: new Date(),
									email: email,
									name: name,
									password: hash,
								});
								newUser.save({ validateBeforeSave: true }, function(err, usr) {
									if (err) {
										console.log(err);
										deferred.resolve({
											error: err.message,
										});
									} else {
										deferred.resolve({
											result: usr,
										});
										EmailVerification.verifyUser(usr);
									};
								});
							};
						});
					};
				});
			};
		});

		return deferred.promise;
	},
	localAuth: function(email, password) { // login
		var deferred = Q.defer();

		User.findOne({ 'email.address' : email.toLowerCase() }).exec(function(err, result) {
			if (err) {
				return console.log(err);
			};
			if (!result) {
				deferred.resolve({
					error: 'account does not exist',
				});
			} else {
				var hash = result.password;
				bcrypt.compare(password, hash, function(err, res) {
					if (err || !res) {
						deferred.resolve({
							error: 'incorrect password',
						});
					} else {
						deferred.resolve({
							result: result,
						});
					};
				});
			}
		});

		return deferred.promise;
	},
};