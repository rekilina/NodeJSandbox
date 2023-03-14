const Product = require('../models/product');
const path = require('path');

const deleteFile = require('../util/files');
const { ObjectId } = require('mongodb');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		formsCSS: true,
		productCSS: true,
		activeAddProduct: true,
		isAuthenticated: req.session.isLoggedIn,
		errorMessage: null
	});
};

exports.postAddProduct = (req, res, next) => {
	const image = req.file;
	if (!image) {
		console.log('image: ', image);
		return res.status(422).render('admin/add-product',
			{
				pageTitle: 'Add Product',
				path: '/admin/add-product',
				formsCSS: true,
				productCSS: true,
				activeAddProduct: true,
				isAuthenticated: req.session.isLoggedIn,
				errorMessage: 'Image upload error'
			})
	} else {
		const imageUrl = image.path;
		try {
			const product = new Product(
				{
					// _id: ObjectId('640081a2faa354f19d0528bc'),
					title: req.body.title,
					price: req.body.price,
					description: req.body.description,
					imageUrl: imageUrl
				});

			product
				.save() // method provided by mongoose
				.then(() => {
					res.status(200);
					res.redirect('/admin/add-product');
				})
				.catch(err => {
					// console.log('admin postAddProduct failed');
					// console.log(err);
					const error = new Error('Creating of product failed');
					error.httpStatusCode = 500;
					return next(error);
				});
		} catch {
			const error = new Error('Creating of product object failed');
			error.httpStatusCode = 500;
			return next(error);
		}

	}
};

exports.getEditProduct = (req, res, next) => {
	const prodId = req.params.prodId;

	Product.findById(prodId)
		.then((product) => {
			res.status(200);
			res.render('admin/edit-product', {
				product: product,
				pageTitle: "Edit Product",
				path: '/admin/edit-product',
				isAuthenticated: req.session.isLoggedIn
			});
		})

};

exports.postEditProduct = (req, res, next) => {

	const image = req.file;
	const prodId = req.body._id;

	Product.findById(prodId)
		.then(product => {
			product.title = req.body.title;
			product.description = req.body.description;
			product.price = req.body.price;
			if (image) {
				deleteFile(product.imageUrl);
				product.imageUrl = path.join(...image.path.split('\\'));
			}
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
	Product.findById(new ObjectId(prodId)).then(product => {
		if (!product) {
			return next(new Error('Product not found'));
		}
		deleteFile(product.imageUrl);
		return Product.findByIdAndRemove(prodId)
	})
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
				productCSS: true,
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch((err) => {
			res.status(500).json({ err: "controller admin/getProducts failed" });
			console.log(err);
		})

};