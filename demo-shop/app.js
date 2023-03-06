const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { mongoPassword, mongoLogin, secret } = require('./util/credentials');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = `mongodb+srv://${mongoLogin}:${mongoPassword}@cluster0.jt3fsu1.mongodb.net/testdb?retryWrites=true&w=majority`;


const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

// store session in the MongoDB
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: secret,
	resave: false, // session won't be reset on every incoming request,
	// only if smth have changed in the session
	saveUninitialized: false, //
	// cookie: {}
	store: store
}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(MONGODB_URI)
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