const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		default: "Jhon Doe"
	},
	email: {
		type: String,
		required: true,
		// default: "test@test.tt"
	},
	password: {
		type: String,
		required: true
	},
	tasks: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Task'
		}]
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('User', userSchema);