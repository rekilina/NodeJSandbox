const Product = require('../models/product');
const ObjectId = require('mongodb').ObjectId;

const getDb = require('../util/database').getDb;

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
		req.body.title,
		req.body.price,
		req.body.description,
		req.body.imageUrl);
	product.save()
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

	Product.findById(prodId, (product) => {
		res.status(200);
		res.render('admin/edit-product', {
			product: product,
			pageTitle: "Edit Product",
			path: '/admin/edit-product'
		});
	})

};

exports.postEditProduct = (req, res, next) => {
	const db = getDb();
	const updates = {
		title: req.body.title,
		description: req.body.description,
		price: req.body.price,
		imgUrl: req.body.imgUrl
	};
	const prodId = req.body._id;

	if (ObjectId.isValid(prodId)) {
		db.collection('products')
			.updateOne(
				{ _id: new ObjectId(prodId) },
				{ $set: updates }
			)
			.then(result => {
				res.status(200).redirect("/admin/products");
			})
			.catch(err => {
				res.status(500).json({ error: 'update failed: ' + err });
				console.log('update failed', err);
			})
	} else {
		res.status(500).json({ error: 'update failed' });
		console.log('update failed');
	}
}

exports.postDeleteProduct = (req, res, next) => {
	const db = getDb();
	const prodId = req.body._id;
	if (ObjectId.isValid(prodId)) {
		db.collection('products')
			.deleteOne({ _id: new ObjectId(prodId) })
			.then(result => {
				res.status(200).redirect("/admin/products");
				return result;
			})
			.catch(err => {
				res.status(500).json({ error: 'delete failed: ' + err });
				console.log('update failed', err);
			})
	} else {
		console.log('update failed');
		throw ('update failed');
	}
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
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
	// const db = getDb();
	// db.collection('products')
	// 	.find()
	// 	.forEach(product => {
	// 		products.push(product);
	// 	})
	// 	.then(() => {
	// 		res.status(200);
	// 		res.render('admin/products', {
	// 			prods: products,
	// 			pageTitle: 'Admin products',
	// 			path: '/admin/products',
	// 			hasProducts: products.length > 0,
	// 			activeShop: true,
	// 			productCSS: true
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		res.status(500).json({ err: "admin/getProducts failed" });
	// 	})
};