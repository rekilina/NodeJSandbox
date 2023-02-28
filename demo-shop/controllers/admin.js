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
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = req.body.imageUrl;
	// insert value into table products
	// it will immidiately save it to database
	Product.create({
		// table_field: local constant
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl
	})
		.then(result => {
			console.log('postAddProducts OK ');
		})
		.catch(err => {
			console.log('postAddProducts err: ', err)
		});
};

exports.getEditProduct = (req, res, next) => {
	const prodId = req.params.prodId;
	// const editMode = req.query.edit;
	Product.findById(prodId, (product) => {
		res.render('admin/edit-product', {
			product: product,
			pageTitle: "Edit Product",
			path: '/admin/edit-product'
		});
	});
};

exports.postEditProduct = (req, res, next) => {
	// find existing product and replace
	const product = new Product(
		req.body.title,
		req.body.price,
		req.body.description,
		req.body.imageUrl,
		req.body.prodId
	);
	product.save();
	res.redirect("/admin/products");
}

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.prodId;
	Product.delete(prodId);
	res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'AdminProducts',
			path: '/admin/products'
		});
	})
};