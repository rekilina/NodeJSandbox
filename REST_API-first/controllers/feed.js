exports.getPosts = (req, res, next) => {
	res.json({
		posts: [{
			title: "post title",
			contect: "this is post"
		}]
	});
}