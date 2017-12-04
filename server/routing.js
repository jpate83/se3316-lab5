var ADMIN_PASSWORD = 'password';


var express = require('express');
var sanitizeHtml = require('sanitize-html');
var EmailVerification = require('./email-verification.js');

var models = require('./models');

var DMCANotice = models.getCollection('DMCANotice');
var DMCAReport = models.getCollection('DMCAReport');
var ImageCollection = models.getCollection('ImageCollection');
var PublicPolicies = models.getCollection('PublicPolicies');
var Token = models.getCollection('Token');
var User = models.getCollection('User');

var sanitizeString = function(str) {
	return sanitizeHtml(str, {
		allowedTags: [],
	});
};

var router = express.Router();

module.exports = function(passport) {

	// ---------------------------------- authentication ---------------------------------- //

	router.post('/login', function(req, res, next) {
		req.body.username = req.body["email"];
		req.body.password = req.body["password"];
		passport.authenticate('local-login', function(info, user) {
			if (req.session.error) {
				res.json({
					error: req.session.error,
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						return res.json({
							error: 'Error logging you in',
						});
					};
					res.json({
						data: user
					});
				});
			};
		})(req, res, next);
	});

	router.get('/isAuthenticated', function(req, res) { // this is useless in current proxy usage
		res.json({
			isAuthenticated: req.isAuthenticated(),
		});
	});

	router.post('/register', function(req, res, next) {
		req.body.username = req.body["email"];
		req.body.password = req.body["password"];
		req.body.name = req.body["name"];
		passport.authenticate('local-signup', function(info, user) {
			if (req.session.error) {
				res.json({
					error: req.session.error,
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						console.log(err);
						return res.json({
							error: 'Error logging you in',
						});
					};
					res.json({
						data: user
					});
				});
			};
		})(req, res, next);
	});

	router.post('/logout', function(req, res) {
		req.logout();
		res.json({
			success: true,
		});
	});
	
	router.post('/resend-verification-email', function(req, res) {
		EmailVerification.verifyUser(req.body);
		res.send({success: true});
	});

	// confirma user's email address when they follow this link sent in their inbox
	router.post('/verify/:verificationToken', function(req, res) {
		var tokenData = req.params.verificationToken;
		EmailVerification.confirmToken(tokenData, function(err) {
			if (err) {
				res.json({
					error: 'Error verifying email. Token may have expired.',
				});
			} else {
				res.json({
					success: true,
				});
			};
		});
	});


	// ---------------------------------- public info ---------------------------------- //

	// get top ten public collections
	router.get('/collections/top-ten-public', function(req, res) {
		ImageCollection.find({
			isPublic: true,
			isDeleted: { $ne: true },
		}).sort({ averageRating: -1 }).limit(10).exec(function(err, collections) {
			if (err) {
				res.json({
					error: 'Error retrieving public collections.'
				});
			} else {
				res.json({
					data: collections,
				});
			};
		});
	});

	// get public policy info
	router.get('/policy-info', function(req, res) {
		PublicPolicies.findOne({}).sort({ created: -1 }).exec(function(err, policyData) {
			if (err) {
				res.json({
					error: 'Error retrieving policies.'
				});
			} else {
				res.json({
					data: policyData,
				});
			};
		});
	});


	// ---------------------------------- authenticated only ---------------------------------- //

	// get a collection if accessor has sufficient privileges
	router.get('/collection/:collectionId', function(req, res) {
		var handleQuery = function(err, result) {
			res.json({
				data: result,
			});
		};

		if(req.query.password && req.query.password == ADMIN_PASSWORD) { // if is admin

			ImageCollection.findOne({
				isDeleted: { $ne: true },
				_id: req.params.collectionId,
			}).populate('ownerId').exec(handleQuery);

		} else if (req.query.userId) { // if user logged in

			ImageCollection.findOne({
				$or: [{
					isPublic: true,
				}, {
					ownerId: req.query.userId,
				}],
				isDeleted: { $ne: true },
				_id: req.params.collectionId,
			}).populate('ownerId').exec(handleQuery);

		} else { // if publicly accessed

			ImageCollection.findOne({
				isPublic: true,
				_id: req.params.collectionId,
				isDeleted: { $ne: true }
			}).populate('ownerId').exec(handleQuery);

		};
	});

	// get logged in users collections (i know this is not very secure, but this is not going to run in a real prod env + angular is a bad framework so it's not worth the effort to have more secure communications)
	router.get('/collections/this-user', ensureAuthenticated, function(req, res) {
		ImageCollection.find({
			ownerId: req.query.userId,
			isDeleted: { $ne: true },
		}).exec(function(err, results) {
			res.json({
				data: results,
			});
		});
	});

	// get all public collections for an authenticated user
	router.get('/collections/public', ensureAuthenticated, function(req, res) {
		ImageCollection.find({
			isPublic: true,
			isDeleted: { $ne: true },
		}).populate('ownerId').exec(function(err, results) {
			res.json({
				data: results,
			});
		});
	});


	// create a collection
	router.post('/user/create-collection', ensureAuthenticated, function(req, res) {
		var bod = req.body;
		var newCollection = new ImageCollection({
			created: new Date(),
			ownerId: req.body.user._id.toString(),
			name: sanitizeString(bod.name),
			description: sanitizeString(bod.description),
			images: [],
			ratings: [],
			averageRating: 0,
			isPublic: bod.isPublic,
		});
		newCollection.save({ validateBeforeSave: true }, function(err, savedCollection) {
			if (err) {
				res.json({
					error: 'Error saving collection',
				});
			} else {
				res.json({
					data: savedCollection,
				});
			};
		});
	});

	// update a collection's fields
	router.post('/user/update-collection', ensureAuthenticated, function(req, res) {
		var updatedCollection = req.body.updatedCollection;
		ImageCollection.findOne({
			_id: req.body.updatedCollectionId,
			ownerId: req.body.user._id,
		}).exec(function(err, collection) {
			if (err || !collection) {
				res.json({
					error: 'Error updating collection.'
				});
			} else {
				collection.name = sanitizeString(updatedCollection.name);
				collection.description = sanitizeString(updatedCollection.description);
				collection.images = updatedCollection.images;
				collection.isPublic = updatedCollection.isPublic;
				collection.save({validateBeforeSave: true}, function(err, savedCollection) {
					if (err) {
						res.json({
							error: 'Error saving collection',
						});
					} else {
						res.json({
							data: savedCollection,
						});
					};
				});
			};
		});
	});

	// delete a collection
	router.post('/user/delete-collection', ensureAuthenticated, function(req, res) {
		ImageCollection.find({
			_id: req.body.collectionId,
			ownerId: req.body.user._id,
		}).remove().exec(function(err, success) {
			if (err || !success.result.n) {
				res.json({error: 'Error removing collection.'});
			} else {
				res.json({success: true});
			};
		});
	});

	// Rate a collection
	router.post('/user/rate-collection', ensureAuthenticated, function(req, res) {
		ImageCollection.findById(req.body.collectionId).exec(function(err, collection) {
			if (err) {
				res.json({error: ''});
			} else {
				if (collection.ownerId.toString() == req.body.user._id.toString()) { // ensure this collection does not belong to the rater
					return res.json({error: ''});
				};

				// if there's no rating, add a new one. If rating exists, update it.
				var existing = collection.ratings.findIndex(function(el) {
					return el.ownerId.toString() == req.body.user._id.toString();
				});
				if (existing != -1) {
					collection.ratings[existing].rating = req.body.rating;
				} else {
					collection.ratings.push({
						ownerId: req.body.user._id,
						rating: req.body.rating,
					});
				};
				// update average rating calculation
				collection.averageRating = collection.ratings.reduce(function(accum, curr) {
					return accum + curr.rating;
				}, 0);
				collection.averageRating = collection.averageRating/collection.ratings.length;
				collection.save({validateBeforeSave: true}, function(err, newCollection) {
					if (err) {
						res.json({error: ''});
					} else {
						res.json({data: newCollection});
					};
				});
			};
		});
	});

	// request a collection for takedown
	router.post('/user/report-collection', ensureAuthenticated, function(req, res) {
		var newReport = new DMCAReport({
			created: new Date(),
			creatorId: req.body.user._id,
			reportedEntityId: req.body.reportedEntityId,
			message: sanitizeString(req.body.message),
		});
		newReport.save({validateBeforeSave: true}, function(err, saved) {
			res.json({
				data: saved,
			});
		});
	});

	// get a user's DMCA takedown notices sent from the admin
	router.get('/user/takedown-notices', ensureAuthenticated, function(req, res) {
		DMCANotice.find({to: req.query.userId}).populate('for').exec(function(err, noticies) {
			res.json({
				data: noticies,
			});
		});
	});

	// dispute a takedown notice
	router.post('/user/dispute-takedown-notice', ensureAuthenticated, function(req, res) {
		DMCANotice.findById(req.body.noticeId).exec(function(err, notice) {
			notice.disputeDate = new Date();
			notice.disputeMessage = sanitizeString(req.body.message);
			notice.save({validateBeforeSave: true}, function(err, saved) {
				res.json({
					data: saved,
				});
			});
		});
	});

	// not used in the app atm
	router.post('/user/read-takedown-notice', ensureAuthenticated, function(req, res) {
		DMCANotice.findById(req.body.noticeId).exec(function(err, notice) {
			notice.read = true;
			notice.save({validateBeforeSave: true}, function(err, saved) {
				res.json({
					data: saved,
				});
			});
		});
	});





	// ---------------------------------- site admin ---------------------------------- //

	// ensure user's an admin
	router.post('/admin/verify', function(req, res) {
		res.json({
			verified: req.body.password == ADMIN_PASSWORD,
		});
	});

	// update policies
	router.post('/admin/updatePolicies', function(req, res) {
		if (req.body.password != ADMIN_PASSWORD) {
			res.status(403).send('Forbidden.');
		}
		var newPolicies = new PublicPolicies({
			created: new Date(),
			securityPolicy: sanitizeString(req.body.securityPolicy),
			privacyPolicy: sanitizeString(req.body.privacyPolicy),
			DMCAPolicy: sanitizeString(req.body.DMCAPolicy),
			infringementContactInfo: sanitizeString(req.body.infringementContactInfo),
		});

		newPolicies.save({validateBeforeSave: true}, function(err, saved) {
			res.json({
				data: saved,
			});
		});
	});

	// get all takedown requests/collection reports
	router.get('/admin/takedown-requests', function(req, res) {
		if (req.query.password != ADMIN_PASSWORD) {
			res.status(403).send('Forbidden.');
		}
		DMCAReport.find({}).populate('creatorId').populate('reportedEntityId').exec(function(err, reports) {
			res.json({
				data: reports,
			});
		});
	});

	// get all previously sent takedown notices, including ones that have been disputed
	router.get('/admin/takedown-notices', function(req, res) {
		if (req.query.password != ADMIN_PASSWORD) {
			res.status(403).send('Forbidden.');
		}
		DMCANotice.find({}).populate('to').populate('for').exec(function(err, notices) {
			res.json({
				data: notices,
			});
		});
	});

	// create a takedown notice
	router.post('/admin/create-takedown-notice', function(req, res) {
		if (req.body.password != ADMIN_PASSWORD) {
			res.status(403).send('Forbidden.');
		}
		var newNotice = new DMCANotice({
			created: new Date(),
			to: req.body.to,
			for: req.body.for,
			message: sanitizeString(req.body.message),
		});
		newNotice.save({validateBeforeSave: true}, function(err, saved) {
			res.json({
				data: saved,
			});
			if (saved) {
				DMCAReport.findById(req.body.reportId).exec(function(err, res) {
					if (res) {
						res.noticeSent = true;
						res.save({validateBeforeSave: true});
					};
				});
			}
		});
	});


	// take down a collection
	router.post('/admin/disable-collection', function(req, res) {
		if (req.body.password != ADMIN_PASSWORD) {
			res.status(403).send('Forbidden.');
		};
		ImageCollection.findById(req.body.collectionId).exec(function(err, collection) {
			if (err || !collection) {
				res.json({
					error: 'Error.'
				});
			} else {
				collection.isDeleted = true;
				collection.save({validateBeforeSave: true}, function(err, saved) {
					res.json({
						data: saved,
					});
				});
			};
		});
	});

	// restore a collection
	router.post('/admin/undo-disable-collection', function(req, res) {
		if (req.body.password != ADMIN_PASSWORD) {
			res.status(403).send('Forbidden.');
		}
		ImageCollection.findById(req.body.collectionId).exec(function(err, collection) {
			if (err || !collection) {
				res.json({
					error: 'Error.'
				});
			} else {
				collection.isDeleted = false;
				collection.save({ validateBeforeSave: true }, function(err, saved) {
					res.json({
						data: saved,
					});
				});
			};
		});
	});


	return router;
};


// this is no longer used as angular is proxied.
function ensureAuthenticated(req, res, next) {
	next();
	// if (req.isAuthenticated()) {
	// 	return next();
	// };
	// req.session.error = 'Please log in.';
	// res.status(500).json({
	// 	error: 'Unauthorized access',
	// });
}