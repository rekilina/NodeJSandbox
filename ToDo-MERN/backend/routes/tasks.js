const express = require('express');

const tasksController = require('../controllers/tasks');

const router = express.Router();

router.get('/', tasksController.getTasks);

router.post('/new', tasksController.createTask);

router.put('/:taskId', tasksController.updateTask);

router.delete('/delete/:taskId', tasksController.deleteTask);

module.exports = router;