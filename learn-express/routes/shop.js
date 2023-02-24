const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.send(`
	<h1>hello from express</h1>
	<a href="/admin/add-product">add product</a>
	`);
});

module.exports = router;