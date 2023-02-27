const Sequelize = require('sequelize');

// connection pool + environment
const sequelize = require('../util/database');

const Product = sequelize.define('products', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    default: "New Product Item"
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
    default: "default product description"
  },
  imageUrl: {
    type: Sequelize.TEXT,
    allowNull: true,
    default: "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149330605.jpg?w=2000"
  }
});

module.exports = Product;