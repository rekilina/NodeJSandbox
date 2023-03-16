const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/isAuth');

router.get('/posts', isAuth, feedController.getPosts);

router.get('/posts/:postId', isAuth, feedController.getPost);

router.put('/posts/:postId', isAuth, [
	body('title').trim().isLength({ min: 5 }).notEmpty(),
	body('content').trim().isLength({ min: 5 }).notEmpty()
], feedController.updatePost);

router.post('/post', isAuth, [
	body('title').trim().isLength({ min: 5 }).notEmpty(),
	body('content').trim().isLength({ min: 5 }).notEmpty()
], feedController.createPost);

router.delete('/posts/:postId', isAuth, feedController.deletePost);

module.exports = router;