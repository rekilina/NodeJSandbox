const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
	res.status(200).json({
		posts: [{
			_id: '1',
			title: "post title",
			creator: {
				name: "Author Name"
			},
			createdAt: new Date().toString(),
			image: "images/jelly.jpg",
			content: "this is post"
		}]
	});
}

exports.createPost = (req, res, next) => {
	// create it in the db
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			message: "Validation failed on createPost route.",
			errors: errors
		});
	}
	const title = req.body.title;
	const content = req.body.content;

	res.status(201).json({
		message: "Post created successfully",
		post: {
			_id: new Date().toString(),
			title: title,
			content: content,
			creator: {
				name: "Author Name"
			},
			createdAt: new Date().toString()
		}
	})
}