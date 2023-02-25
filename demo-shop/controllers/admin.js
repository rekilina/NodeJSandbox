const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		formsCSS: true,
		productCSS: true,
		activeAddProduct: true
	});
};

exports.postAddProduct = (req, res, next) => {
	// const product = new Product(...Object.values(req.body));  // I even don't know what's better
	const product = new Product(req.body.title,
		req.body.price,
		req.body.description,
		req.body.imageUrl);
	product.save();
	res.redirect('/admin/add-product');
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'AdminProducts',
			path: '/admin/products'
		});
	})
};