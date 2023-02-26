const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, price, description, imageUrl, prodId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.prodId = prodId;
  }

  save() {
    getProductsFromFile(products => {
      let updatedProducts = [...products];
      if (this.prodId) {
        console.log('here in class');
        const existingProductIndex = products.findIndex(p => p.prodId == this.prodId);
        updatedProducts[existingProductIndex] = this;
      } else {
        this.prodId = Math.random();
        updatedProducts.push(this);
      }
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.prodId == id);
      cb(product);
    });
  }
};
