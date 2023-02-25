const express = require('express');
const path = require('path');
const router = express.Router();

const productControllers = require('../controllers/products');

router.get('/add-product', productControllers.getAddProduct);

router.post('/product', productControllers.postNewProduct);

exports.routes = router;
// exports.products = products;