const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { mongoPassword, mongoLogin } = require('./util/credentials');
const path = require('path');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const MONGODB_URI = `mongodb+srv://${mongoLogin}:${mongoPassword}@cluster0.jt3fsu1.mongodb.net/SocialMediaProject?retryWrites=true&w=majority`;

const app = express();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './images');
	},
	filename: (req, file, cb) => {
		const date = Date.now();
		const filename = date + '-' + file.originalname;
		cb(null, filename);
	}
});


const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/webp') {
		cb(null, true);
	} else {
		cb(null, false);
	}
}

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use(multer({
	storage: fileStorage,
	fileFilter: fileFilter
}).single('image'));

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

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

