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
	req.user.createProduct({
		// table_field: local constant
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl
	})
		.then(result => {
			console.log('postAddProducts OK ');
			res.redirect('/admin/add-product');
		})
		.catch(err => {
			console.log('postAddProducts err: ', err)
		});
};

exports.getEditProduct = (req, res, next) => {
	const prodId = req.params.prodId;
	// const editMode = req.query.edit;
	// Product.findByPk(prodId)
	req.user.getProducts({ where: { prodId: prodId } })
		.then((products) => {
			const product = products[0];
			res.render('admin/edit-product', {
				product: product,
				pageTitle: "Edit Product",
				path: '/admin/edit-product'
			});
		})
		.catch(err => { console.log('admin getEditProduct err: ', err) });
};

exports.postEditProduct = (req, res, next) => {
	// find existing product and replace
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = req.body.imageUrl;
	const prodId = req.body.prodId;
	Product.findByPk(prodId)
		.then(product => {
			product.title = title;
			product.description = description;
			product.imageUrl = imageUrl;
			product.price = price;
			// update product
			return product.save();
		})
		.then(result => {
			res.redirect("/admin/products");
		})
		.catch(err => { console.log('admin poostEditProduct err: ', err) });
}

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.prodId;
	Product.destroy({ where: { prodId: prodId } })
		.then(result => {
			console.log('delete result', result);
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log('admin postDeleteProduct err: ', err);
		});
}

exports.getProducts = (req, res, next) => {
	req.user
		.getProducts()
		.then(products => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'AdminProducts',
				path: '/admin/products'
			});
		})
		.catch(err => { console.log('admin getProducts err: ', err) });
};