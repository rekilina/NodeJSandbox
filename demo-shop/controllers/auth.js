const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { sendgrid_api } = require('../util/credentials');
const crypto = require('crypto');
const path = require('path');
const ejs = require('ejs');
const { reset } = require('nodemon');

const transporter = nodemailer.createTransport(sendgridTransport({
	auth: {
		api_key: sendgrid_api,
	}
}));

exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: "Login",
		isAuthenticated: false,
		errorMessage: message
	});
};

exports.postLogin = (req, res, next) => {
	const userEmail = req.body.email;
	const password = req.body.password;
	User.findOne({ email: userEmail })
		.then(user => {
			if (!user) {
				req.flash('error', 'Invalid email');
				res.redirect('/login');
			}
			bcrypt.compare(password, user.password)
				.then(doMatch => {
					if (doMatch) {
						req.session.user = user;
						req.session.isLoggedIn = true;
						return req.session.save(err => {
							console.log(err);
							return res.redirect('/');
						})
					}
					res.redirect('/login');
				})
				.catch(err => {
					console.log(err);
					res.redirect('/login');
				})
		})
		.catch(err => {
			console.log('Middleware User err: ', err);
		})
}

exports.postLogout = (req, res, next) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
}

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: "Signup",
		isAuthenticated: false
	});
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirm_password;
	// find out if meail already exists 
	User.findOne({ email: email })
		.then(userDoc => {
			if (userDoc || (password != confirmPassword)) {
				return res.redirect('/signup');
			} else {
				return bcrypt
					.hash(password, 12)
					.then(hashedPassword => {
						const user = new User({
							email: email,
							password: hashedPassword,
							cart: { items: [] }
						});
						return user.save();
					});
			}
		})
		.then(result => {
			res.redirect('/login');
			return transporter.sendMail({
				to: email,
				from: 'iv.shebarshina@gmail.com',
				subject: 'Signup succeeded!',
				html: '<h1>Test email</h1>'
			})
				.catch(err => {
					console.log(err);
				});
		})
		.catch(err => {
			console.log(err);
		});

}

exports.getReset = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		path: '/reset-password',
		pageTitle: "Reset Password",
		isAuthenticated: false,
		errorMessage: message
	});
}

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/reset-password');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					req.flash('error', 'Email not found');
					return res.redirect('/reset-password');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				return user.save();
			})
			.then(result => {
				res.redirect('/');
				const rootDir = path.dirname(require.main.filename);
				ejs.renderFile(path.join(rootDir, 'views', 'email', 'reset-password.ejs'),
					{ userName: 'Jhon Doe', token: token },
					(err, data) => {
						if (err) {
							console.log(err);
							return;
						}
						transporter.sendMail({
							to: req.body.email,
							from: 'iv.shebarshina@gmail.com',
							subject: 'Password reset',
							html: data
						})
					})
			})
			.catch(err => {
				console.log(err);
			});
	})
}

exports.getSetNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() }
	})
		.then(user => {
			let message = req.flash('error');
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: "Reset Password",
				isAuthenticated: false,
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token
			});
		})
		.catch(err => {
			console.log(err);
		});
}

exports.postSetNewPassword = (req, res, next) => {
	const newPassword = req.body.new_password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId
	})
		.then(user => {
			resetUser = user;
			return bcrypt.hash(newPassword, 12);
		})
		.then(hashedPassword => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = null;
			resetUser.resetTokenExpiration = undefined;
			return resetUser.save();
		})
		.then(result => {
			res.redirect('/login');
		})
		.catch(err => {
			console.log(err);
		});
}