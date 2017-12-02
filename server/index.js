// ------------------------------ consts ------------------------------ //

/* NOTE: move these to env variables for prod */
var PORT = 8081;
var DB_URI = 'mongodb://user:password@ds125556.mlab.com:25556/se3316';
var SESSION_MIDDLEWARE_SECRET = 'se3316supersecret';


// ------------------------------ requires ------------------------------ //

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = require('express')();
var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


// ------------------------------ mongoose ------------------------------ //

mongoose.Promise = global.Promise;

mongoose.connect(DB_URI, {
	useMongoClient: true,
});
mongoose.connection.on('error', function(err) {
	console.log('mongoose connection error: ' + err);
});

// when node closes, close connection
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		process.exit(0);
	});
});


// ------------------------------ [app.use] ------------------------------ //


app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var sessionMidware = session({
	secret: SESSION_MIDDLEWARE_SECRET,
	saveUninitialized: true,
	resave: true,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
	}),
});
app.use(sessionMidware);
app.use(passport.initialize());
app.use(passport.session());


// ------------------------------ models for use below in script ------------------------------ //

var models = require('./models');
var User = models.getCollection('User');


// ------------------------------ Passport ------------------------------ //

var passportFunctions = require('./passport-functions.js');

// Session-persisted message middleware
app.use(function(req, res, next) {
	var err = req.session.error;
	var msg = req.session.notice;
	var success = req.session.success;

	delete req.session.error;
	delete req.session.success;
	delete req.session.notice;

	if (err)
		res.locals.error = err;
	if (msg)
		res.locals.notice = msg;
	if (success)
		res.locals.success = success;

	next();
});

passport.use('local-login', new LocalStrategy({ passReqToCallback: true },
	function(req, email, password, done) {
		delete req.session.error;
		passportFunctions.localAuth(email, password).then(function(result) {
			if (result.error) {
				req.session.error = result.error;
			};
			done(null, result.result);
		}).fail(function(err) {
			console.log(err.message);
			req.session.error = 'Internal error';
			done();
		});
	}
));

passport.use('local-signup', new LocalStrategy({ passReqToCallback : true },
	function(req, email, password, done) {
		delete req.session.error;
		passportFunctions.localReg(email, password, req.body).then(function(result) {
			if (result.error) {
				req.session.error = result.error;
			};
			done(null, result.result);
		}).fail(function(err) {
			console.log(err.message);
			req.session.error = 'Internal error';
			done();
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
	User.findById(userId).select({"password": 0, "isDeleted": 0}).exec(function(err, res) {
		if (err || !res) {
			console.log(err || new Error("user does not exist"));
		};
		done(null, res);
	});
});

// ------------------------------ routers ------------------------------ //
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


app.use('/api', require('./routing.js')(passport));


// ------------------------------ start server ------------------------------ //

var server = app.listen(PORT, function() {
	console.log('SE3316 server is listening on port ' + PORT);
});
