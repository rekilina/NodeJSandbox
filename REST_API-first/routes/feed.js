const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);

router.get('/posts/:postId', feedController.getPost);

router.put('/posts/:postId', [
	body('title').trim().isLength({ min: 5 }).notEmpty(),
	body('content').trim().isLength({ min: 5 }).notEmpty()
], feedController.updatePost);

router.post('/post', [
	body('title').trim().isLength({ min: 5 }).notEmpty(),
	body('content').trim().isLength({ min: 5 }).notEmpty()
], feedController.createPost);

router.delete('/posts/:postId', feedController.deletePost);

module.exports = router;