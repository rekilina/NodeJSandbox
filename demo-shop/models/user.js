const { ObjectId } = require('mongodb');

const getDb = require('../util/database').getDb;

class User {
	constructor(username, email, cart, _id) {
		this.username = username;
		this.email = email;
		this.cart = cart; // {items: []}
		this._id = _id ? new ObjectId(_id) : null;
	}

	save() {
		const db = getDb();
		return db.collection('users').insertOne(this)
	}

	// В общем хранить полное описание товара плохая идея,
	// Потому что если ты обновишь товар в админке,
	// В корзине он не обновится
	// Сейчас уж пусть хранится всё,
	// Но использовать из этого можно по сути только _id
	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex(p => {
			return p._id.equals(product._id);
		});
		let newQuantity = 1;
		let updatedCart = { ...this.cart };
		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCart.items[cartProductIndex].quantity = newQuantity;
		} else {
			updatedCart.items.push({ ...product, quantity: 1 });
		}
		const db = getDb();
		return db.collection('users').updateOne(
			{ _id: this._id },
			{ $set: { cart: updatedCart } }
		);
	}

	static findById(userId) {
		const db = getDb();
		if (ObjectId.isValid(userId)) {
			return db.collection('users')
				.findOne({ _id: new ObjectId(userId) });
		} else {
			console.log("invalid user_id");
			throw ('invalid _id User');
		}
	}

	getCart() {
		return this.cart;
	}

}

module.exports = User;