var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	created: {
		type: Date,
		required: true,
	},
	expires: Date,
	data: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		enum: [
			'EmailVerification',
		],
		required: true,
	},
	recipientId: mongoose.SchemaTypes.ObjectId,
});

var Model = mongoose.model('tokens', schema);
module.exports = Model;
