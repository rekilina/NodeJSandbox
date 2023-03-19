const express = require('express');

const tasksController = require('../controllers/tasks');

const router = express.Router();

router.get('/', tasksController.getTasks);

module.exports = router;