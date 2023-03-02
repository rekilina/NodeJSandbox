const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:prodId', shopController.getProductDetail);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/delete-from-cart', shopController.deleteFromCart);

router.get('/orders', shopController.getOrders);

router.post('/post-order', shopController.postOrder);

module.exports = router;
