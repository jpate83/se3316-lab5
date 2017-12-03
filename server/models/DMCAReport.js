var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	created: {
		type: Date,
		required: true,
	},
	creatorId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true,
	},
	reportedEntityId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'imageCollections',
		required: true,
	},
	message: String,
});

var Model = mongoose.model('dmcaReports', schema);
module.exports = Model;
