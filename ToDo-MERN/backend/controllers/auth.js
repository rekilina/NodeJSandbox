const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.register = async (req, res, next) => {
	if (!req.body.name || !req.body.email || !req.body.password) {
		return res.json('required name, email and password');
	}

	const password = req.body.password;
	const name = req.body.name;
	const email = req.body.email;

	try {
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
		res.json(response);
	} catch (err) {
		console.log('register error: ', err)
	}
}

exports.login = (req, res, next) => {
	if (req) {

	}
}

exports.logout = (req, res, next) => {

}

exports.getRegister = (req, res, next) => {
	res.json({
		"message": "hello world"
	});
}