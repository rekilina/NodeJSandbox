
const express = require('express');

const router = express.Router();

router.get('/login', (req, res, next) => {
	res.render('auth', {
		pageTitle: 'Login Page',
		path: '/login'
	});
});


module.exports = router;
