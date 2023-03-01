const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const { mongoPassword, mongoLogin } = require('./credentials');

let _db;

const mongoConnect = (cb) => {
	MongoClient.connect(`mongodb+srv://${mongoLogin}:${mongoPassword}@cluster0.jt3fsu1.mongodb.net/testdb?retryWrites=true&w=majority`)
		.then(client => {
			_db = client.db();
			return cb();
		})
		.catch(err => {
			console.log('DB connectopn err: ', err);
			throw err;
		});
}

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'Can\'t connect to Mongodb';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
