const Sequelize = require('sequelize');

const sequelize = new Sequelize('demo_shop_1', 'root', 'root',
	{
		dialect: 'mysql',
		host: 'localhost'
	}
);

module.exports = sequelize;