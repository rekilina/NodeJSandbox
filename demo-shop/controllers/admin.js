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
	const product = new Product(
		{
			title: req.body.title,
			price: req.body.price,
			description: req.body.description,
			imageUrl: req.body.imageUrl
		});
	product
		.save() // method provided by mongoose
		.then(() => {
			res.status(200);
			res.redirect('/admin/add-product');
		})
		.catch(err => {
			console.log('admin postAddProduct failed');
		});
};

exports.getEditProduct = (req, res, next) => {
	const prodId = req.params.prodId;

	Product.findById(prodId)
		.then((product) => {
			res.status(200);
			res.render('admin/edit-product', {
				product: product,
				pageTitle: "Edit Product",
				path: '/admin/edit-product'
			});
		})

};

exports.postEditProduct = (req, res, next) => {

	const updates = {
		title: req.body.title,
		description: req.body.description,
		price: req.body.price,
		imgUrl: req.body.imgUrl
	};
	const prodId = req.body._id;

	Product.findById(prodId)
		.then(product => {
			product.title = req.body.title;
			product.description = req.body.description;
			product.price = req.body.price;
			product.imageUrl = req.body.imageUrl;
			return product.save();
		})
		.then(result => {
			res.redirect('/admin/products');
		})
		.catch(err => {
			res.status(500).json({ error: 'update failed: ' + err });
			console.log('update failed', err);
		})
}

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body._id;
	Product
		.findByIdAndRemove(prodId)
		.then(result => {
			res.status(200).redirect("/admin/products");
			return result;
		})
		.catch(err => {
			res.status(500).json({ error: 'delete failed: ' + err });
			console.log('update failed', err);
		})
}

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin products',
				path: '/admin/products',
				hasProducts: products.length > 0,
				activeShop: true,
				productCSS: true
			});
		})
		.catch((err) => {
			res.status(500).json({ err: "controller admin/getProducts failed" });
			console.log(err);
		})

};