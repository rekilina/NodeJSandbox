exports.register = (req, res, next) => {
if (!req.body.name || !req.body.email || !req.body.password) {
	return res.json('required name, email and password');
}
}

exports.login = (req, res, next) => {

}

exports.logout = (req, res, next) => {

}