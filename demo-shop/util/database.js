const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const { mongoPassword, mongoLogin } = require('./credentials');

let _db;

