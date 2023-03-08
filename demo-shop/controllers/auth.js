const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: "Login",
		isAuthenticated: false
	});
};

exports.postLogin = (req, res, next) => {
	User.findById('64009e0cb2e1b8f4fca436e0')
		.then(user => {
			req.session.user = user;
			req.session.isLoggedIn = true;
			res.redirect('/');
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
		})
		.catch(err => {
			console.log(err);
		});

}