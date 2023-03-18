const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/register', authController.register);

router.get('/register', authController.getRegister);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router;