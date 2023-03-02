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

	addToCart(product) {
		// const cartProduct = this.cart.items.findIndex(p => {
		// 	return p._id === product._id;
		// })
		const updatedCart = { items: [{ ...product, quantity: 1 }] };
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

}

module.exports = User;