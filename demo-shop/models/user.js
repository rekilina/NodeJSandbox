const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = require('./product');
const Order = require('./order');

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		default: 'Ivan Test'
	},
	email: {
		type: String,
		required: true,
		default: 'test@test.com'
	},
	cart: {
		items: {
			type: [{
				_id: {
					type: Schema.Types.ObjectId,
					required: true,
					ref: 'Product'
				},
				quantity: {
					type: Number,
					required: true,
					default: 1
				}
			}],
			default: []
		}
	}
});

userSchema.methods.addToCart = function (product) {
	const cartProductIndex = this.cart.items.findIndex(p => {
		return p._id.equals(product._id);
	});
	let newQuantity = 1;
	let updatedCart = { ...this.cart };
	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCart.items[cartProductIndex].quantity = newQuantity;
	} else { ///_id: product._id or ...product
		updatedCart.items.push({ _id: product._id, quantity: 1 });
	}
	this.cart = updatedCart;
	return this.save();
}

userSchema.methods.removeFromCart = function (prodId) {
	const cartProductIndex = this.cart.items.findIndex(p => {
		return p._id.equals(prodId);
	});
	const cartProduct = this.cart.items.find(p => {
		return p._id.equals(prodId);
	});
	let newQuantity = 1;
	let updatedCart = { ...this.cart };
	if (cartProduct.quantity === 1) {
		updatedCart.items = updatedCart.items.filter(p => {
			return p._id.toString() !== prodId.toString();
		})
	} else if (cartProduct.quantity > 1) {
		updatedCart.items[cartProductIndex].quantity = cartProduct.quantity - 1;
	} else {
		throw ('quantity err User.removeFromCart');
	}
	this.cart = updatedCart;
	return this.save();
}

userSchema.methods.clearCart = function () {
	this.cart.items = [];
	return this.save();
}

userSchema.methods.addOrder = function () {
	return this.populate('cart.items._id')
		.then(user => {
			const cartItemsArray = user.cart.items;
			const zipProducts = cartItemsArray.map(elem => {
				console.log(elem._id);
				return {
					...elem._id._doc,
					quantity: elem.quantity
				}
			});
			const totalPrice = zipProducts.reduce((acc, curr) => {
				return acc + Number(curr.quantity) * Number(curr.price);
			}, 0);

			const order = new Order({
				userId: this._id,
				totalPrice: totalPrice.toFixed(2),
				items: zipProducts
			});
			return order.save();
		});
}

module.exports = mongoose.model('User', userSchema);
