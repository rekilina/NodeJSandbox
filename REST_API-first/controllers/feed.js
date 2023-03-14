exports.getPosts = (req, res, next) => {
	res.status(200).json({
		posts: [{
			title: "post title",
			contect: "this is post"
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
			id: new Date().toString(),
			title: title,
			content: content
		}
	})
}