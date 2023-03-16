const jwt = require('jsonwebtoken');
const { secret } = require('../util/credentials');

module.exports = (req, res, next) => {
	let token;
	let decodedToken;
	try {
		token = req.get('Authorization').split(' ')[1];
		decodedToken = jwt.verify(token, secret);
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}
	if (!decodedToken) {
		const error = new Error('Not authenticated');
		error.statusCode = 401;
		throw error;
	}
	req.userId = decodedToken.userId;
	next();
}