const User = require('../models/user');

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