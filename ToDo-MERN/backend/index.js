const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { mongoPassword, mongoLogin } = require('./util/credentials');
const cors = require('cors');
const morgan = require('morgan'); // for logging
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const { isAuth } = require('./middleware/isAuth');

const MONGODB_URI = `mongodb+srv://${mongoLogin}:${mongoPassword}@cluster0.jt3fsu1.mongodb.net/todo_list_db?retryWrites=true&w=majority`;
const port = 8080;

const app = express();

//middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'html');

// error handling middleware
app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	res.status(status).json({ message: message })
});

// routes
app.use('/auth', authRoutes);
app.use('/tasks', isAuth, taskRoutes);
app.use('/users', isAuth, userRoutes);

// error handler
app.use((err, req, res, next) => {
	if (!err.statusCode) {
		err.statusCode = 500;
	}
	if (!err.message) {
		err.message = "Undefined server error";
	}
	return res.status(Number(err.statusCode)).json({
		messsage: err.message,
		statusCode: err.statusCode
	});
});

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});


mongoose.connect(MONGODB_URI)
	.then(result => {
		const server = app.listen(port);
	})
	.catch(err => {
		console.log(err);
	});

