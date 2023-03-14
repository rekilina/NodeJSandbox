const express = require('express');
const router = require('router');

const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);

module.exports = router;