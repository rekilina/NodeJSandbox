const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('users', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		defaultValue: 'Jhon Doe'
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		defaultValue: "jhon-doe@mailbox.qq"
	}
});

module.exports = User;