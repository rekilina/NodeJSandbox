const fs = require('fs');

const requestHandler = (response, request) => {
	const url = request.url;
	const method = request.method;

	if (url === '/') {
		// console.log('here');
		response.setHeader('Content-Type', 'text/html');
		response.write(`
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<form action="/message" method="POST">
		<input name="message" type="text" />
		<button>Submit</button>
	</form>

</body>
</html>`);
		return response.end();
	}
	if (url === '/message' && method === 'POST') {
		const body = [];
		request.on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const message = parsedBody.split('=')[1];
			fs.writeFile('message.txt', message, (err) => {
				response.statusCode = 302;
				response.setHeader('Location', '/');
				return response.end();
			});
		});
		response.setHeader('Content-Type', 'text/html');
		response.write(`
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	<h1>Hello world</h1>
</body>

</html>
		`);
		return response.end();
	}
}

module.exports = requestHandler;