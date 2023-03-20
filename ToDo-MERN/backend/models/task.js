const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	complete: {
		type: Boolean,
		required: true,
		default: false
	},
	name: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}

}, {
	timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);