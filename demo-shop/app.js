const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { mongoPassword, mongoLogin, secret } = require('./util/credentials');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const MONGODB_URI = `mongodb+srv://${mongoLogin}:${mongoPassword}@cluster0.jt3fsu1.mongodb.net/testdb?retryWrites=true&w=majority`;

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

// store session in the MongoDB
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

// initialize csrf protection
const csrfProtection = csrf();
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './data/images');
	},
	filename: (req, file, cb) => {
		const date = Date.now();
		const filename = date + '-' + file.originalname;
		// req.body.filename = filename;
		cb(null, filename);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/webp') {
		cb(null, true);
	} else {
		cb(null, false);
	}
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
	storage: fileStorage,
	fileFilter: fileFilter
}).single('image')); // file picker named image
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data/images', express.static(path.join(__dirname, 'data', 'images')));
app.use(session({
	secret: secret,
	resave: false, // session won't be reset on every incoming request,
	// only if smth have changed in the session
	saveUninitialized: false, //
	// cookie: {}
	store: store
}));
app.use(csrfProtection);

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch(err => {
			throw new Error(err);
			// console.log('Middleware User err: ', err);
		})
});

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
	// res.redirect('/500');
	res.status(500).render('500', {
		pageTitle: 'Error500',
		path: 'error500',
		isAuthenticated: req.session.isLoggedIn,
		error: error
	});
});

mongoose
	.connect(MONGODB_URI)
	.then(result => {
		app.listen(3000);
	})
	.catch(err => {
		console.log('Starting Server Error: ', err)
	});