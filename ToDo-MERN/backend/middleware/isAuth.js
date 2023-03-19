const jwt = require('jsonwebtoken');
const { jwtsecret } = require('../util/credentials');
const errorHandler = require('../util/error.js');

exports.isAuth = (req, res, next) => {
	const token = req.cookies.access_token;
	try {
		if (!token) {
			throw errorHandler({
				message: "Authentiaction failed. No token available",
				statusCode: "401"
			});
		}
		return jwt.verify(token, jwtsecret, (err, decodedMsg) => {
			if (err) {
				err.statusCode = 401;
				throw err;
			} else {
				req.user = decodedMsg;
				return next();
			}
		})
	} catch (err) {
		// if (!err.statusCode) {
		// 	err.statusCode = 500;
		// }
		// return res.status(err.statusCode).json({ "message": err.message });
		next(err);
	}
}