const db = require('../util/database');

module.exports = class Product {
  constructor(title, price, description, imageUrl, prodId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.prodId = prodId;
  }

  save() {
    if (this.prodId) {
      return db.execute(
        ` UPDATE products
        SET title = \"${this.title}\", 
        description = \"${this.description}\", 
        price = ${this.price},
        imageUrl = \"${this.imageUrl}\"
        WHERE prodId = ${this.prodId}; `
      );
    } else {
      return db.execute(
        `INSERT INTO products (title, description, price, imageUrl) VALUES (\"${this.title}\",\"${this.description}\", ${this.price}, \"${this.imageUrl}\"); `
      );
      // db.execute('NSERT INTO products (title, description, price, imageUrl) VALUES (?, ?, ?, ?)', [this.title, this.description, this.price, this.imageUrl]);
    }
  }

  static delete(id) {
    // getProductsFromFile(products => {
    //   const updatedProducts = products.filter(prod => prod.prodId != id);
    //   fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //     console.log(err);
    //   });
    // })
    db.execute(`DELETE FROM products WHERE prodId=${id};`);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute(`SELECT * FROM products WHERE prodId=${id}`);
  }



  // getProductsFromFile(products => {
  //   let updatedProducts = [...products];
  //   if (this.prodId) {
  //     const existingProductIndex = products.findIndex(p => p.prodId == this.prodId);
  //     updatedProducts[existingProductIndex] = this;
  //   } else {
  //     this.prodId = new String(Math.random());
  //     updatedProducts.push(this);
  //   }
  //   fs.writeFile(p, JSON.stringify(updatedProducts), err => {
  //     console.log(err);
  //   });
  // });

};

