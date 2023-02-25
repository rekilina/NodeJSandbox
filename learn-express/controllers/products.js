const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('add-product',
		{ path: '/admin/add-product' });
};

exports.postNewProduct = (req, res, next) => {
	const product = new Product(req.body.title, req.body.price);
	product.save();
	res.redirect('/');
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('shop', {
			products: products,
			docTytle: 'MyShop',
			path: '/'
		});
	});
};
