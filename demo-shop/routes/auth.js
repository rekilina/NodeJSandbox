
const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup',
	check('email').isEmail().custom((value, { req }) => {
		return User.findOne({ email: value })
			.then(userDoc => {
				if (userDoc) {
					// throw new Error('email is already registered');
					return Promise.reject('email is already registered');
				}
			})
	}),
	check('password').isStrongPassword(),
	check('confirm_password').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('passwords dont match');
		}
		return true;
	}),
	authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getReset);

router.post('/reset-password', authController.postReset);

router.get('/new-password/:token', authController.getSetNewPassword);

router.post('/new-password', authController.postSetNewPassword);

module.exports = router;
