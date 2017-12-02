var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	created: {
		type: Date,
		required: true,
	},
	ownerId: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	images: {
		type: [String],
	},
	ratings: [{
		ownerId: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
	}],
	averageRating: {
		type: Number,
		required: true,
	},
	isPublic: Boolean,
	isDeleted: Boolean,
});

var Model = mongoose.model('imageCollections', schema);
module.exports = Model;
