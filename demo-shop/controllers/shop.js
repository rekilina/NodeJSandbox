const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Products',
      path: '/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchAll(cart => {
    Product.fetchAll(products => {
      const prodCartId = cart.products.map(prod => prod.prodId);
      const productsInCart = products.filter(prod => prodCartId.includes(prod.prodId));
      const productsRender = productsInCart.map(prod => {
        const qty = cart.products.find(pr => pr.prodId == prod.prodId).quantity;
        return { ...prod, quantity: qty };
      });
      res.render('shop/cart', {
        prods: productsRender,
        pageTitle: 'Cart',
        path: '/cart',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        totalPrice: cart.totalPrice
      });
    });
  });
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

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
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