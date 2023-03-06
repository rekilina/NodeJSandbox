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