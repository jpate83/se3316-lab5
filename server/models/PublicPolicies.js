var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	created: {
		type: Date,
		required: true,
	},
	securityPolicy: {
		type: String,
		required: true,
	},
	privacyPolicy: {
		type: String,
		required: true,
	},
	DMCAPolicy: {
		type: String,
		required: true,
	},
	infringementContactInfo: {
		type: String,
		required: true,
	},
});

var Model = mongoose.model('publicPolicies', schema);
module.exports = Model;
