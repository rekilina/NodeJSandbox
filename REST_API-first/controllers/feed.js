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