const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../util/credentials');

exports.signup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Signup validation failed');
		error.statusCode = 422;
		error.data = errors.array();
		console.log('error.data: ', error.data);
		throw error;
	}
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;
	bcrypt
		.hash(password, 12)
		.then(hashedPassword => {
			const user = new User({
				email: email,
				name: name,
				password: hashedPassword
			});
			return user.save();
		})
		.then(user => {
			res.status(201).json({
				message: 'User created',
				userId: String(user._id)
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
				next(err);
			}
		});
}

exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				const error = new Error('User not found');
				error.statusCode = 401;
				throw error;
			}
			loadedUser = user;
			return bcrypt.compare(password, user.password);
		})
		.then(isEqual => {
			if (!isEqual) {
				const error = new Error('Wrong password');
				error.statusCode = 401;
				throw error;
			}
			// generate JWT
			const token = jwt.sign({
				email: loadedUser.email,
				userId: loadedUser._id.toString(),
			}, secret, {
				expiresIn: '1h'
			});
			res.status(200).json({
				token: token,
				userId: loadedUser._id.toString()
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}

exports.getUserStatus = (req, res, next) => {
	User.findById(req.userId)
		.then(user => {
			if (!user) {
				const error = new Error("User not found");
				error.statusCode = 404;
				throw error;
			}
			res.status(200).json({
				status: user.status
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		})
}

exports.updateUserStatus = (req, res, next) => {
	User.findById(req.userId)
		.then(user => {
			if (!user) {
				const error = new Error("User not found");
				error.statusCode = 404;
				throw error;
			}
			console.log(req.body.status);
			user.status = req.body.status;
			return user.save();
		})
		.then(user => {
			res.status(200).json({
				status: user.status
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		})
}