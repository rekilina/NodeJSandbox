const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const rootDir = path.dirname(require.main.filename);

// const products = [];

module.exports = class Product {
	constructor(title, price) {
		this.title = title;
		this.price = price;
	}

	save() {
		// this refers to the object created in this class
		const p = path.join(rootDir, 'data', 'products.json');
		let products = [];
		fs.readFileSync(p, (err, fileContent) => {
			if (!err) {
				products = JSON.parse(fileContent);
			}
			products.push(this);
			fs.writeFileSync(p, JSON.stringify(products), (err) => {
				console.log('error? ', err);
			});
		});
	}

	// this method should be could directly on the class itself, 
	// and not on an instantiated object
	static fetchAll(cb) {
		const p = path.join(rootDir, 'data', 'products.json');
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				cb([]);
			}
			cb(JSON.parse(fileContent));
		});
	}
}