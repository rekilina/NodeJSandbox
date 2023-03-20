const User = require('../models/user');
const errorHandler = require('../util/error');

exports.getUserInfo = async (req, res, next) => {
	try {
		const data = await User
			.findById(req.user.id)
			.select("name email tasks");
		if (!data) {
			throw errorHandler({
				message: "Forbidden token or user not found",
				statusCode: 403
			});
		}
		return res.status(200).json(data);
	} catch (err) {
		return next(err);
	}
}

exports.postUserInfo = async (req, res, next) => {
	try {
		const updatedUser = await User
			.findByIdAndUpdate(req.user.id, {
				email: req.body.email,
				name: req.body.name
			}, {
				new: true
			}).select("name email");
		return res.status(200).json(updatedUser);
	} catch (err) {
		return next(err);
	}
}