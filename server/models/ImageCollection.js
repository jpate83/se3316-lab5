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
		default: '',
	},
	images: {
		type: [String],
		required: true,
		default: [],
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
		default: 0,
	},
	isPublic: Boolean,
	isDeleted: Boolean,
});

var Model = mongoose.model('imageCollections', schema);
module.exports = Model;
