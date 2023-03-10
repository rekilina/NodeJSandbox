
const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getReset);

router.post('/reset-password', authController.postReset);

router.get('/new-password/:token', authController.getSetNewPassword);

router.post('/new-password', authController.postSetNewPassword);

module.exports = router;
