const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../util/path');

const adminData = require('./admin');

router.get('/', (req, res, next) => {
	console.log(adminData.products);
	// 2nd arg is object with data that we pass to pug
	res.render('shop', {
		products: adminData.products,
		docTytle: 'MyShop',
		path: '/'
	});
});

module.exports = router;