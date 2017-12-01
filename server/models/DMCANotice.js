var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	created: {
		type: Date,
		required: true,
	},
	to: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	read: Boolean,
	disputeMessage: String,
	disputeDate: Date,
});

var Model = mongoose.model('dmcaNotices', schema);
module.exports = Model;
