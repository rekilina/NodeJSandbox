const Product = require('../models/product');

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
  req.user.getCart()
    .then(cart => {
      cart.getProducts()
        .then(products => {
          products = products.map(p => p.dataValues);

          const productsRender = products.map(p => {
            const q = p.cartItems.quantity;
            const newProduct = { ...p, quantity: q };
            return newProduct;
          });

          const totalPrice = productsRender.reduce((acc, val) => {
            return acc + val.quantity * val.price;
          }, 0);

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
        .catch(err => { 'shop controllers getCart, err1: ', err });
    })
    .catch(err => { 'shop controllers getCart, err2: ', err });
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
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({
        where: {
          prodId: prodId
        }
      });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let newQuantity = 1;
      if (product) {
        const oldQuantity = product.cartItems.quantity;
        newQuantity = oldQuantity + 1;
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      }
      return Product.findByPk(prodId)
        .then(product => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity }
          });
        })
        .catch(err => { console.log("shop controllers postCart err1: ", err) })
    })
    .then(result => {
      res.redirect('/products');
    })
    .catch(err => {
      console.log('shop controllers postCart err2: ', err);
    })
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

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItems = { quantity: product.cartItems.quantity };
            return product;
          }));
        })
        .catch(err => {
          console.log('shop controllers postOrder err1: ', err);
        });
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => {
      console.log('shop controllers postOrder err2: ', err);
    })
}

exports.deleteFromCart = (req, res, next) => {
  const prodId = req.body.prodId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { prodId: prodId } })
    })
    .then(products => {
      const product = products[0];
      product.cartItems.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log('shop controllers deleteFromCart err: ', err));
}