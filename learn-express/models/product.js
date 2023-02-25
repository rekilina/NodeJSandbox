const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(require.main.filename);
const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			return cb([]);
		}
		cb(JSON.parse(fileContent));
	});
}

module.exports = class Product {
	constructor(title, price) {
		this.title = title;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log('error? ', err);
			});
		});
	}

	// this method should be could directly on the class itself, 
	// and not on an instantiated object
	static fetchAll(cb) {
		getProductsFromFile(cb);
	}
}