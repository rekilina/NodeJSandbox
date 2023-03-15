const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/feed', feedRoutes);

mongoose.connect('mongodb+srv://ivshebarshina:g5e5BFUHcxVyhnVs@cluster0.jt3fsu1.mongodb.net/SocialMediaProject')
	.then(result => {
		app.listen(8080);
	})
	.catch(err => {
		// how can i pass this err to frontend
		// to display error message there? 
		// msg, that DB connection is broken?
		console.log(err);
	});

