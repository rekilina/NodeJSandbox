const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findByPk(1)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => { console.log('app middleware user err: ', err); });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// create table associations
User.hasMany(Product);
Product.belongsTo(User, {
	constraints: true,
	onDelete: 'CASCADE'
});

//setting up our database
sequelize
	// force overwrites tables
	// .sync({ force: true })
	.sync()
	.then(result => {
		return User.findByPk(1);
		// console.log('Sequelize sync() runs ');
	})
	.then(user => {
		if (!user) {
			return User.create();
		}
		return Promise.resolve(user);
	})
	.catch(err => {
		console.log('Couldnt sequelize.sync() err: ', err);
	});

app.listen(3000);
