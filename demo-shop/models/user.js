const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = require('./product');

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
	console.log(this);
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
	console.log(this);
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

module.exports = mongoose.model('User', userSchema);



// class User {

// 	removeFromCart(prodId) {
// 		const cartProductIndex = this.cart.items.findIndex(p => {
// 			return p._id.equals(new ObjectId(prodId));  // may be ObjectId
// 		});
// 		const cartProduct = this.cart.items.find(p => {
// 			return p._id.equals(new ObjectId(prodId));  // may be ObjectId
// 		});
// 		let updatedCart = { ...this.cart };
// 		if (cartProduct.quantity === 1) {
// 			updatedCart.items = updatedCart.items.filter(p => {
// 				return p._id.toString() !== prodId.toString();
// 			})
// 		} else if (cartProduct.quantity > 1) {
// 			updatedCart.items[cartProductIndex].quantity = cartProduct.quantity - 1;
// 		} else {
// 			throw ('quantity err User.removeFromCart');
// 		}
// 		const db = getDb();
// 		return db.collection('users').updateOne(
// 			{ _id: this._id },
// 			{ $set: { cart: updatedCart } }
// 		);
// 	}

// 	static findById(userId) {
// 		const db = getDb();
// 		if (ObjectId.isValid(userId)) {
// 			return db.collection('users')
// 				.findOne({ _id: new ObjectId(userId) });
// 		} else {
// 			console.log("invalid user_id");
// 			throw ('invalid _id User');
// 		}
// 	}

// 	getCart() {
// 		return this.cart;
// 	}

// 	addOrder() {
// 		const db = getDb();
// 		let totalPrice = 0;

// 		const productsCart = this.cart.items.map(prod => {
// 			return { _id: prod._id, quantity: prod.quantity }
// 		});
// 		const prodIds = this.cart.items.map(prod => prod._id);
// 		db.collection('products')
// 			.find({ _id: { $in: prodIds } })
// 			.toArray()
// 			.then((products) => {
// 				const zipProducts = products.map(prod => {
// 					return {
// 						...prod, quantity: productsCart.find(p => {
// 							return p._id.equals(prod._id)
// 						}).quantity
// 					}
// 				});
// 				const totalPrice = zipProducts.reduce((acc, curr) => {
// 					return acc + Number(curr.quantity) * Number(curr.price);
// 				}, 0);

// 				const order = {
// 					items: this.cart.items,
// 					userId: this._id,
// 					totalPrice: totalPrice
// 				}

// 				return db.collection('orders')
// 					.insertOne(order)
// 					.then(result => {
// 						this.cart = { items: [] };
// 						db.collection('users')
// 							.updateOne(
// 								{ _id: this._id },
// 								{ $set: { cart: { items: [] } } }
// 							)
// 					})
// 					.catch(err => {
// 						console.log('User.addOrder failed: ', err)
// 					})

// 			})
// 			.catch((err) => {
// 				console.log('getCart shop ctrl failed: ', err);
// 			});

// 	}

// 	getOrders() {
// 		const db = getDb();
// 		return db.collection('orders')
// 			.find({ userId: this._id }).toArray();
// 	}
// }

// module.exports = User;