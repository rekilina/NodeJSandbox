const User = require('../models/user');
const Task = require('../models/task');

const errorHandler = require('../util/error');

exports.getTasks = async (req, res, next) => {
	// res.status(200).json({
	// 	"message": "Hello, world",
	// 	...req.user
	// });
	const userId = req.user.id;
	try {
		if (!userId) {
			throw errorHandler({
				message: "Not Authorized",
				statusCode: 401
			});
		}
		const tasks = await Task.find({ user: userId });

		res.status(200).json(tasks);
	} catch (err) {
		return next(err);
	}

}

exports.createTask = async (req, res, next) => {
	const userId = req.user.id;
	try {
		if (!userId) {
			throw errorHandler({
				message: "Not Authorized",
				statusCode: 401
			});
		}
		const taskName = req.body.name;
		const taskComplete = req.body.complete;

		if (!taskName) {
			throw errorHandler({
				message: "Can't create empty task",
				statusCode: 417
			});
		}

		const newTask = new Task({
			name: taskName,
			complete: taskComplete,
			user: userId
		});

		const createdTask = await newTask.save();

		const currentUser = await User.findById(userId);
		currentUser.tasks.push(createdTask);
		await currentUser.save();

		res.status(201).json({
			message: "Task created successfully",
			...createdTask._doc
		})

	} catch (err) {
		return next(err);
	}
}