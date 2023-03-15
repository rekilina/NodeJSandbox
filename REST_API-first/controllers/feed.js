const { validationResult } = require('express-validator');
const Post = require('../models/posts')

exports.getPosts = (req, res, next) => {
	Post.find()
		.then(posts => {
			res.status(200).json({
				posts: posts
			});
		})
		.catch(err => {
			console.log('Failed fetch all posts in feed.js getPosts', err);
		})
}

exports.createPost = (req, res, next) => {
	// create it in the db
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed on createPost route.");
		error.statusCode = 422;
		throw error;
	}

	const title = req.body.title;
	const content = req.body.content;
	const post = new Post({
		title: title,
		creator: {
			name: "Author Name"
		},
		content: content,
		imageUrl: "images/cat.webp"
	});
	post.save()
		.then(createdPost => {
			console.log(createdPost);
			res.status(201).json({
				message: "Post created successfully",
				post: createdPost
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}