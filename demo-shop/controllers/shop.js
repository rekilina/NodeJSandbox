const Product = require('../models/product');
const Order = require('../models/order');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const e = require('connect-flash');
const PDFDocument = require('pdfkit');
const ejs = require('ejs');
// const pdf = require("pdf-creator-node");
let pdf = require("html-pdf");

const rootDir = path.dirname(require.main.filename);
const ITEMS_PER_PAGE = 2;
let totalItems;

exports.getIndex = (req, res, next) => {
	const page = req.query.page ? req.query.page : 1;

	Product.find().countDocuments()
		.then(numProducts => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)
		})
		.then(products => {
			res.status(200);

			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				page: page,
				path: '/',
				hasProducts: products.length > 0,
				activeShop: true,
				productCSS: true,
				isAuthenticated: req.session.isLoggedIn,
				pagesNum: Math.ceil(totalItems / ITEMS_PER_PAGE)
			});
		})
		.catch((err) => {
			res.status(500).json({ err: "controller shop/getIndex failed" });
			console.log(err);
		})
};

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.status(200);
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'Products',
				path: '/products',
				hasProducts: products.length > 0,
				activeShop: true,
				productCSS: true,
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch((err) => {
			res.status(500).json({ err: "controller shop/getProducts failed" });
			console.log(err);
		})
};

exports.getProductDetail = (req, res, next) => {
	const prodId = req.params.prodId;

	Product.findById(prodId)
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: "Product Details",
				path: '/product-detail',
				isAuthenticated: req.session.isLoggedIn
			});
		});
}

exports.getCart = (req, res, next) => {
	const cart = req.user.cart;
	req.user.populate('cart.items._id').then(user => {
		const cartItemsArray = user.cart.items;
		const zipProducts = cartItemsArray.map(elem => {
			return {
				...elem._id._doc,
				quantity: elem.quantity
			}
		});
		const totalPrice = zipProducts.reduce((acc, curr) => {
			return acc + Number(curr.quantity) * Number(curr.price);
		}, 0);
		res.render('shop/cart', {
			prods: zipProducts,
			pageTitle: 'Cart',
			path: '/cart',
			hasProducts: zipProducts.length > 0,
			activeShop: true,
			productCSS: true,
			totalPrice: totalPrice,
			isAuthenticated: req.session.isLoggedIn
		});
	})
}

exports.postCart = (req, res, next) => {
	const prodId = req.body._id;
	Product.findById(prodId)
		.then((product) => {
			req.user.addToCart(product);
			res.redirect('/products');
		});
}

exports.deleteFromCart = (req, res, next) => {
	const prodId = req.body._id;

	req.user.removeFromCart(prodId)
		.then(result => {
			res.redirect('/cart');
		})
		.catch(err => {
			console.log('fail removing from cart, ', err)
		})

}

exports.getOrders = (req, res, next) => {
	const userEmail = req.session.user.email;
	Order.find({ userId: new ObjectId(req.session.user._id) })
		.then(orders => {
			res.render('shop/orders', {
				pageTitle: 'Orders',
				path: '/orders',
				orders: orders,
				isAuthenticated: req.session.isLoggedIn,
				userEmail: req.session.user.email
			});
		})

};


exports.postOrder = (req, res, next) => {
	req.user.addOrder()
		.then(result => {
			req.user.clearCart();
			res.redirect('/cart');
		});
}

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	const invoiceName = 'invoice_' + String(orderId) + '.pdf';
	const invoicePath = path.join(rootDir, 'data', invoiceName);

	const userId = req.session.user._id;

	Order.findById(new ObjectId(orderId))
		.then(order => {
			if (!order) {
				return next(new Error('Order not found'));
			}
			if (userId.toString() !== order.userId.toString()) {
				// res.status(401).redirect('/login');
				throw new Error('Unauthorized access');
			} else {
				return order;
			}
		})
		.then(order => {
			res.header('Content-Type', 'application/pdf');
			res.header('Content-Disposition', 'attachment; filename="' + invoiceName + '"');

			// ---------- using PDFKIT ----------------

			const invoiceDoc = new PDFDocument();
			invoiceDoc.pipe(fs.createWriteStream(invoicePath));
			invoiceDoc.pipe(res);
			invoiceDoc.fontSize(26).text('Invoice', {
				underlined: true
			});
			invoiceDoc.text('---------------------------');
			order.items.forEach(item => {
				invoiceDoc.text(item.title + ' x ' + item.quantity + ' x ' + item.price);
			})
			invoiceDoc.text('Total: ' + order.totalPrice);
			invoiceDoc.end();

			// ---------------------------------------

			// ----------- USING HTML-PDF ------------------

			// ejs.renderFile(path.join(rootDir, 'views', "email", 'invoice.ejs'),
			// 	{ order: order }, (err, data) => {
			// 		if (err) {
			// 			res.send(err);
			// 		} else {
			// 			pdf.create(data, {}).toFile(invoicePath, (err, data) => {
			// 				if (err) {
			// 					res.send(err);
			// 				} else {
			// 					res.send("File created successfully");
			// 					return resolve(invoiceName);
			// 				}
			// 			});
			// 		}
			// 	});
			// -----------------------------------------


			// -------- try html-pdf-node package

		})
		.then((err) => {
			// ok so i've created file now I want to download it 
			// IF it was created successfully

			// fs.readFile(invoicePath, (err, data) => {
			// 	if (err) {
			// 		console.log('We have an error and we are in then block', err);
			// 		return next(err);
			// 	}
			// 	res.header('Content-Type', 'text/plain');
			// 	// this header is necessary
			// 	res.header('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
			// 	res.send(data);
			// });

			// const file = fs.createReadStream(invoicePath);
			// res.header('Content-Type', 'text/plain');
			// res.header('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
			// file.pipe(res);
		})
		.catch(err => {
			console.log('find order by id failed: ', err.message);
			return res.status(301).redirect('/login');
			// return next();
		})
}