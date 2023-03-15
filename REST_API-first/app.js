const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { mongoPassword, mongoLogin, secret } = require('./util/credentials');
const feedRoutes = require('./routes/feed');
const MONGODB_URI = `mongodb+srv://${mongoLogin}:${mongoPassword}@cluster0.jt3fsu1.mongodb.net/SocialMediaProject?retryWrites=true&w=majority`;
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/feed', feedRoutes);

// error handling middleware
app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	res.status(status).json({ message: message })
});

mongoose.connect(MONGODB_URI)
	.then(result => {
		app.listen(8080);
	})
	.catch(err => {
		// how can i pass this err to frontend
		// to display error message there? 
		// msg, that DB connection is broken?
		console.log(err);
	});

