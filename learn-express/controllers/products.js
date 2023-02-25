const products = [];

exports.getAddProduct = (req, res, next) => {
	res.render('add-product',
		{ path: '/admin/add-product' });
};

exports.postNewProduct = (req, res, next) => {
	products.push({
		title: req.body.title,
		price: req.body.price
	});
	console.log(req.body);
	res.redirect('/');
}

exports.getProducts = (req, res, next) => {
	// 2nd arg is object with data that we pass to pug
	res.render('shop', {
		products: products,
		docTytle: 'MyShop',
		path: '/'
	});
};

exports.products = products;