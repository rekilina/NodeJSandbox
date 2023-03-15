const { validationResult } = require('express-validator');
const user = require('../models/user');

exports.signup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Signup validation failed');
		error.statusCode = 422;
		error.data = errors.array();
		console.log('errors:', errors);
		console.log('error.data: ', error.data);
		throw error;
	}
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;

}