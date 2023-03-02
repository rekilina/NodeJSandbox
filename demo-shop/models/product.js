const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: 'New Product'
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  imageUrl: String
});

module.exports = mongoose.model('Product', productSchema);








// module.exports = class Product {
//   constructor(title, price, description, imageUrl) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('products')
//       .insertOne(this)
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static findById(prodId, cb) {
//     const db = getDb();

//     if (ObjectId.isValid(prodId)) {
//       db.collection('products')
//         .findOne({ _id: new ObjectId(prodId) })
//         .then((product) => {
//           cb(product);
//         })
//         .catch(err => {
//           console.log("getEditProduct err", err);
//         });
//     } else {
//       console.log("wrong _id");
//       res.redirect('/404')
//     }
//   }

// };
