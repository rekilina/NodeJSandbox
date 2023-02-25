
const products = [];

module.exports = class Product {
	constructor(title, price) {
		this.title = title;
		this.price = price;
	}

	save() {
		// this refers to the object created in this class
		products.push(this);
	}

	// this method should be could directly on the class itself, 
	// and not on an instantiated object
	static fetchAll() {
		return products;
	}
}