const { ObjectId } = require('mongodb');
const Product = require('../models/product');
// const Cart = require('../models/cart');

const getDb = require('../util/database').getDb;

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.status(200);
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch((err) => {
      res.status(500).json({ err: "controller shop/getIndex failed" });
      console.log(err);
    })
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.status(200);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch((err) => {
      res.status(500).json({ err: "controller shop/getProducts failed" });
      console.log(err);
    })
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.prodId;

  Product.findById(prodId, (product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: "Product Details",
      path: '/product-detail'
    });
  });
}


exports.getCart = (req, res, next) => {
  const db = getDb();
  const productsCart = req.user.getCart().items.map(prod => {
    return { _id: prod._id, quantity: prod.quantity }
  });
  const prodIds = req.user.getCart().items.map(prod => prod._id);
  db.collection('products')
    .find({ _id: { $in: prodIds } })
    .toArray()
    .then((products) => {
      const zipProducts = products.map(prod => {
        return {
          ...prod, quantity: productsCart.find(p => {
            return p._id.equals(prod._id)
          }).quantity
        }
      });
      const totalPrice = zipProducts.reduce((acc, curr) => {
        return acc + Number(curr.quantity) * Number(curr.price);
      }, 0);
      res.render('shop/cart', {
        prods: zipProducts,
        pageTitle: 'Cart',
        path: '/cart',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        totalPrice: totalPrice
      });
    })
    .catch((err) => {
      console.log('getCart shop ctrl failed: ', err);
    });

};

exports.postCart = (req, res, next) => {
  const prodId = req.body._id;
  Product.findById(prodId, (product) => {
    req.user.addToCart(product);
    res.redirect('/products');
  });
}

exports.deleteFromCart = (req, res, next) => {
  const prodId = req.body._id;

  req.user.removeFromCart(prodId)
    .then(result => {
      console.log('removed from cart, ', result);
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

// exports.getOrders = (req, res, next) => {
//   res.render('shop/orders', {
//     pageTitle: 'Orders',
//     path: '/orders'
//   });
// }

