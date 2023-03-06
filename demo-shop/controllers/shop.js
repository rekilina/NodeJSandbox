const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
	Product.find()
		.then(products => {
			res.status(200);
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
				hasProducts: products.length > 0,
				activeShop: true,
				productCSS: true,
				isAuthenticated: req.session.isLoggedIn
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

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/sheckout', {
//     pageTitle: 'Checkout',
//     path: '/checkout'
//   });
// }


exports.getOrders = (req, res, next) => {
	Order.find()
		.then(orders => {
			res.render('shop/orders', {
				pageTitle: 'Orders',
				path: '/orders',
				orders: orders,
				isAuthenticated: req.session.isLoggedIn
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
