const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { jwtsecret } = require('../util/credentials');
const User = require('../models/user');
const errorHandler = require('../util/error.js');

exports.register = async (req, res, next) => {
	const password = req.body.password;
	const name = req.body.name;
	const email = req.body.email;

	try {
		if (!req.body.name || !req.body.email || !req.body.password) {
			throw errorHandler({
				message: 'required name, email and password',
				statusCode: 417
			});
		}
		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			throw errorHandler({
				message: 'User already exists',
				statusCode: 500
			});
		}
		// encrypt password
		// A salt is a random string that makes the hash unpredictable. 
		const saltRouds = 10;
		const salt = await bcrypt.genSalt(saltRouds);
		const hashedPassword = await bcrypt.hash(password, salt);
		// save user
		const user = new User({
			name: name,
			email: email,
			password: hashedPassword
		});
		const response = await user.save();
		return res.status(201).json(response);
	} catch (err) {
		return next(err);
	}
}

exports.login = async (req, res, next) => {
	try {
		if (!req.body.email || !req.body.password) {
			throw errorHandler({
				message: 'Input required',
				statusCode: 400
			});
		}
		const email = req.body.email;
		const password = req.body.password;
		const user = await User.findOne({ email: email })
			.select("name email password");
		if (!user) {
			throw errorHandler({
				message: "User not found",
				statusCode: 404
			});
		}
		// remember? our password was encrypted
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			throw errorHandler({
				message: "Incorrect password",
				statusCode: 401
			});
		}
		//create cookie with token for our user
		const payload = {
			id: user._id,
			name: user.name,
			email: user.email
		}
		const token = jwt.sign(payload, jwtsecret, {
			expiresIn: '1h'
		});
		// return res.status(200).json({
		// 	token: token,
		// 	userId: user._id.toString()
		// });
		return res.cookie('access_token', token, {
			httpOnly: true // you can't access cookie on frontend
		}).status(200).json({ message: "login success" });
	} catch (err) {
		return next(err);
	}
}

exports.logout = async (req, res, next) => {
	// clear cookie
	const result = await res.clearCookie('access_token');
	return res.status(200).json({ message: "Logout success" });
}

exports.isLoggedIn = async (req, res, next) => {
	// check our token
	// every time we send the request from our frontend
	// we will go to this route and check token
	// (at this thime I have no idea how we will use it 
	// as the frontend)
	const token = req.cookie.access_token;
	try {
		if (!token) {
			throw errorHandler({
				message: "No token available in isLoggedIn function",
				statusCode: 401
			});
		}
		return jwt.verify(token, secret, (err) => {
			if (err) {
				// throw errorHandler({
				// 	message: "Token verification failed in isLoggedIn()",
				// 	statusCode: 401
				// });
				return res.json(false);
			}
			return res.json(true);
		})
	} catch (err) {
		return next(err);
	}
}