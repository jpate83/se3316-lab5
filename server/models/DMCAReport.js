var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	created: {
		type: Date,
		required: true,
	},
	creatorId: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true,
	},
	reportedEntityId: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true,
	},
	message: String,
});

var Model = mongoose.model('dmcaReports', schema);
module.exports = Model;
