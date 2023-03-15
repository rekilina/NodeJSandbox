const { validationResult } = require('express-validator');
const Post = require('../models/posts');
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');

exports.getPosts = (req, res, next) => {
	Post.find()
		.then(posts => {
			res.status(200).json({
				posts: posts
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			console.log('Failed fetch all posts in feed.js getPosts', err);
		})
}

exports.getPost = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(new ObjectId(postId))
		.then(post => {
			if (!post) {
				const error = new Error('Post not found / feed controller error');
				error.statusCode = 404;
				throw error;
			}
			res.status(200).json({
				mesage: 'Post fetched',
				post: post
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
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
	if (!req.file) {
		const error = "Image was not uploaded";
		error.statusCode = 422;
		throw error;
	}
	// const imageUrl = path.join(...req.file.path.split('\\'));
	const imageUrl = req.file.path.replace('\\', '/');
	const title = req.body.title;
	const content = req.body.content;
	const post = new Post({
		title: title,
		creator: {
			name: "Author Name"
		},
		content: content,
		imageUrl: imageUrl
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

exports.updatePost = (req, res, next) => {
	const postId = req.params.postId;
	const title = req.body.title;
	const content = req.body.content;
	let imageUrl = req.body.image[0];

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed on createPost route.");
		error.statusCode = 422;
		throw error;
	}
	if (req.file) {
		imageUrl = req.file.path.replace('\\', '/');
	}
	if (!imageUrl) {
		const error = new Error("No image file picked.");
		error.statusCode = 422;
		throw error;
	}


	Post.findById(postId)
		.then(post => {
			if (!post) {
				console.log("Post not found, ", post);
				const error = new Error('Post not found / feed controller error');
				error.statusCode = 404;
				throw error;
			}
			if (imageUrl !== post.imageUrl) {
				clearImage(post.imageUrl);
			}
			post.title = title;
			post.imageUrl = imageUrl;
			post.content = content;
			return post.save();
		})
		.then(result => {
			res.status(200).json({
				message: "Post updated",
				post: result
			})
		})
		.catch(err => {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});

};

const clearImage = filePath => {
	filePath = path.join(path.dirname(require.main.filename), filePath);
	fs.unlink(filePath, err => console.log(err));
} 