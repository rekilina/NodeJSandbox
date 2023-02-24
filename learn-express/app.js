
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

// set up a server with express
const app = express();
// use allows to add a middlewar function
// a function, passed to .use()
// will be executed for every incoming request
// and this function will receive
// req, res, next
// next will be passed by Node js 
// next should be executed to allow the request 
// travel on to the next middleware function

app.use(bodyParser.urlencoded());

app.use(adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
	res.status(404).send(`<h1>Error page<h1/>`);
});

app.listen(3000);