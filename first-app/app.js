const http = require('http');

const routes = require('./routes');

// createServer method requires a function requestListener,
// which will be executed on each incoming request
// request: incoming message
// response: server response
const server = http.createServer(routes);

server.listen(3000);
