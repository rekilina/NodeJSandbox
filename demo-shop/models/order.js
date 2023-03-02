const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = require('./product');

const orderSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	totalPrice: {
		type: Number,
		required: true,
		default: 0
	},
	items: {
		type: [{
			_id: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'Product'
			},
			title: {
				type: String,
				required: true,
				default: 'New Product'
			},
			price: {
				type: Number,
				required: true
			},
			description: String,
			imageUrl: String,
			quantity: {
				type: Number,
				required: true,
				default: 1
			}
		}],
		default: []
	}
});


module.exports = mongoose.model('Order', orderSchema);