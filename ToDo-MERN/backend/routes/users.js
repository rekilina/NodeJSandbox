const express = require('express');

const userControllers = require("../controllers/users");

const router = express.Router();

router.get('/me', userControllers.getUserInfo);

router.post('/me', userControllers.postUserInfo);


module.exports = router;