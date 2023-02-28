// clicking Checkout button in the cart
// should clear the cart and create
// and order to particular user

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('orders', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	}
});

module.exports = Order;