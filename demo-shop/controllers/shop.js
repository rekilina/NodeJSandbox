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


// exports.getCart = (req, res, next) => {
//   Cart.fetchAll(cart => {
//     Product.fetchAll(products => {
//       let productsRender, totalPrice;
//       if (cart.products) {
//         const prodCartId = cart.products.map(prod => prod.prodId);
//         const productsInCart = products.filter(prod => prodCartId.includes(prod.prodId));
//         productsRender = productsInCart.map(prod => {
//           const qty = cart.products.find(pr => pr.prodId == prod.prodId).quantity;
//           return { ...prod, quantity: qty };
//         });
//         totalPrice = cart.totalPrice;
//       } else {
//         productsRender = [];
//         totalPrice = 0;
//       }

//       res.render('shop/cart', {
//         prods: productsRender,
//         pageTitle: 'Cart',
//         path: '/cart',
//         hasProducts: productsRender.length > 0,
//         activeShop: true,
//         productCSS: true,
//         totalPrice: totalPrice
//       });
//     });
//   });
// };

exports.postCart = (req, res, next) => {
  const prodId = req.body._id;
  Product.findById(prodId, (product) => {
    req.user.addToCart(product);
    res.redirect('/products');
  });
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

// exports.deleteFromCart = (req, res, next) => {
//   Cart.deleteProoduct(req.body.prodId, req.body.price);
//   console.log(req.body.prodId, req.body.price);
//   res.redirect('/cart');
// }