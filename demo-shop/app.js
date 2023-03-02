const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { mongoPassword, mongoLogin } = require('./util/credentials');

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('64009e0cb2e1b8f4fca436e0')
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log('Middleware User err: ', err);
		})
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(`mongodb+srv://${mongoLogin}:${mongoPassword}@cluster0.jt3fsu1.mongodb.net/testdb?retryWrites=true&w=majority`)
	.then(result => {
		User.findOne().then(user => {
			if (!user) {
				const user = new User();
				user.save();
			}
		})
		app.listen(3000);
	})
	.catch(err => {
		console.log('Starting Server Error: ', err)
	});