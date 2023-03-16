const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
	body('email')
		.isEmail().notEmpty()
		.custom((value, { req }) => {
			return User.findOne({ email: value }).then(userDoc => {
				if (userDoc) {
					return Promise.reject('Email already exists');
				}
			})
		}).normalizeEmail(),
	body('name').trim().notEmpty(),
	body('password').isStrongPassword()
], authController.signup);

router.post('/login', authController.login);

module.exports = router;