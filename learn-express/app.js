
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const errorRoutes = require('./controllers/error');

// set up a server with express
const app = express();

app.set('view engine', 'pug');
app.set('views', 'views'); // its default by the way

// use allows to add a middlewar function
// a function, passed to .use()
// will be executed for every incoming request
// and this function will receive
// req, res, next
// next will be passed by Node js 
// next should be executed to allow the request 
// travel on to the next middleware function

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorRoutes.get404);

app.listen(3000);