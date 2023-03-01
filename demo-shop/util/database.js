const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb+srv://ivshebarshina:g5e5BFUHcxVyhnVs@cluster0.jt3fsu1.mongodb.net/?retryWrites=true&w=majority')
	.then(result => {
		console.log('DB connected');
	})
	.catch(err => {
		console.log('DB connectopn err: ', err)
	});