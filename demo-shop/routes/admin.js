const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:prodId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

// router.post('/delete-product', isAuth, adminController.postDeleteProduct);

router.delete('/product/:prodId', isAuth, adminController.deleteProduct);

// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

module.exports = router;
