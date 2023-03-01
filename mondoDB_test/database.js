
const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
	connectToDb: (cb) => {
		MongoClient.connect('mongodb://localhost:27017/testdb_0')
			.then((client) => {
				dbConnection = client.db();
				return cb();
			})
			.catch((err) => {
				console.log("Connection to DB err: ", err);
				return cb(err);
			});
	},
	// return a value which is our DB connection
	getDb: () => dbConnection
}