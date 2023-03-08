const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { sendgrid_api } = require('../util/credentials');

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