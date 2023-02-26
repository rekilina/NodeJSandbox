const fs = require('fs');
const path = require('path');

const p = path.join(
	path.dirname(require.main.filename),
	'data',
	'cart.json'
);

const getCartFromFile = cb => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb({ products: [], totalPrice: 0 });
		} else {
			try {
				const cartStored = JSON.parse(fileContent);
				cb(cartStored);
			} catch (e) {
				cb({ products: [], totalPrice: 0 });
			}
		}
	});
};

module.exports = class Cart {
	static addProduct(id, price) {
		// Fetch the previous cart
		getCartFromFile(cart => {
			// Analyze the cart = > Find existing products
			const existingProductIndex = cart.products.findIndex(prod => prod.prodId == id)
			// Add new product / increase quantity
			let updatedProduct;
			if (existingProductIndex != -1) {
				const existingProduct = cart.products[existingProductIndex];
				updatedProduct = { ...existingProduct };
				updatedProduct.quantity = updatedProduct.quantity + 1;
				cart.products[existingProductIndex] = updatedProduct;
			} else { // new product
				updatedProduct = { prodId: id, quantity: 1 };
				// cart.products = [...cart.products, updatedProduct];
				cart.products.push(updatedProduct);
			}
			cart.totalPrice = Number(cart.totalPrice) + Number(price);
			// update cart, save cart to the file
			fs.writeFile(p, JSON.stringify(cart), err => {
				console.log(err);
			});
		});
	}

	static fetchAll(cb) {
		getCartFromFile(cb);
	}

	static deleteProoduct(id, prodPrice) {
		getCartFromFile(cart => {
			const existingProsuctIndex = cart.products.findIndex(prod => prod.prodId == id);
			let existingProduct = cart.products[existingProsuctIndex];
			let updatedCart, updatedCartProducts, updatedTotalPrice;
			if (existingProduct.quantity === 1) {
				updatedCartProducts = cart.products.filter(prod => prod.prodId == id);
			} else {
				existingProduct.quantity = existingProduct.quantity - 1;
				updatedCartProducts = [...cart.products];
				updatedCartProducts[existingProsuctIndex] = existingProduct;
			}
			console.log(prodPrice);
			updatedTotalPrice = cart.totalPrice - prodPrice;
			updatedCart = {
				products: updatedCartProducts,
				totalPrice: updatedTotalPrice
			};
			fs.writeFile(p, JSON.stringify(updatedCart), err => {
				console.log(err);
			});
		});
	}
}