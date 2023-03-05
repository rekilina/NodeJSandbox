exports.getLogin = (req, res, next) => {
	console.log(req.session.isLoggedIn);
	console.log(req.session);
	res.render('auth/login', {
		path: '/login',
		pageTitle: "Login"
	});
};

exports.postLogin = (req, res, next) => {
	// res.setHeader('Set-Cookie', 'loggedIN=true');
	req.session.isLoggedIn = true;
	res.redirect('/');
}