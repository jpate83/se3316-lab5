var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-type-email');

var schema = new Schema({
	created: {
		type: Date,
		required: true,
	},
	email: {
		address: {
			type: mongoose.SchemaTypes.Email,
			required: true,
		},
		isVerified: Boolean,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});


schema.index({ 'email.address': 1 });
var Model = mongoose.model('users', schema);
module.exports = Model;
