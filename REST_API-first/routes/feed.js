const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);

router.post('/post', [
	body('title').trim().isLength({ min: 5 }).notEmpty(),
	body('content').trim().isLength({ min: 5 }).notEmpty()
], feedController.createPost);

module.exports = router;