const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	database: 'demo_shop_0',
	password: 'root'
});

module.exports = pool.promise();
