const http = require('http');
const express = require('express');

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
app.use((req, res, next) => {
	console.log('In the middleware!');
	next();
});
app.use(() => {
	console.log('In another middleware!');
});
const server = http.createServer(app);
server.listen(3000);