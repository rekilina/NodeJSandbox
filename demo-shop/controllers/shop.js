const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(err => { console.log('shop controllers err: ', err) });
};

exports.getCart = (req, res, next) => {
  Cart.fetchAll(cart => {
    Product.findAll()
      .then(products => {
        let productsRender, totalPrice;
        if (cart.products) {
          const prodCartId = cart.products.map(prod => prod.prodId);
          const productsInCart = products.filter(prod => prodCartId.includes(prod.prodId));
          productsRender = productsInCart.map(prod => {
            const qty = cart.products.find(pr => pr.prodId == prod.prodId).quantity;
            return { ...prod, quantity: qty };
          });
          totalPrice = cart.totalPrice;
        } else {
          productsRender = [];
          totalPrice = 0;
        }

        res.render('shop/cart', {
          prods: productsRender,
          pageTitle: 'Cart',
          path: '/cart',
          hasProducts: productsRender.length > 0,
          activeShop: true,
          productCSS: true,
          totalPrice: totalPrice
        });
      })
      .catch(err => { 'shop controllers getCart, err: ', err });
  });
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: "Product Details",
        path: '/product-detail'
      });
    })
    .catch(err => { console.log('shop controllers getProductDetail ', err) });
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      //console.log(products[0].dataValues);
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => { console.log('shop controllers err: ', err) });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  // console.log(prodId);
  res.redirect('/products');
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/sheckout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
  });
}

exports.deleteFromCart = (req, res, next) => {
  Cart.deleteProoduct(req.body.prodId, req.body.price);
  console.log(req.body.prodId, req.body.price);
  res.redirect('/cart');
}