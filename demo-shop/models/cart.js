const fs = require('fs');
const path = require('path');

const p = path.join(
	path.dirname(require.main.filename),
	'data',
	'cart.json'
);

module.exports = class Cart {
	static addProduct(id, price) {
		// Fetch the previous cart
		fs.readFile(p, (err, fileContent) => {
			let cart = { products: [], totalPrice: 0 };
			if (!err) {
				cart = JSON.parse(fileContent);
			}
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
}