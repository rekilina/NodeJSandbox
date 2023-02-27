const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products, fieldData]) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(err => {
      console.log('shop Controllers getProducts error: ', err)
    });
};

exports.getCart = (req, res, next) => {
  Cart.fetchAll(cart => {
    Product.fetchAll()
      .then(([products, fieldData]) => {
        let productsRender, totalPrice;
        if (cart.products) {
          const prodCartId = cart.products.map(prod => prod.prodId);
          const productsInCart = products.filter(prod => prodCartId.includes(String(prod.prodId)));
          console.log('productsInCart: ', products);
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
      });
  });
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then(([product, fieldData]) => {
      console.log(product[0]);
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: "Product Details",
        path: '/product-detail'
      });
    });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => {
      console.log('shop Controllers getIndex err', err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.findById(prodId)
    .then(([product, fieldData]) => {
      Cart.addProduct(prodId, product[0].price);
    })
    .catch(err => {
      console.log('shop controllers postCart err: ', err)
    })
    .then(() => {
      res.redirect('/products');
    });
  // console.log(prodId);
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