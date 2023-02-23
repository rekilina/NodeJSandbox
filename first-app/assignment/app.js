const http = require('http');

const DUMMY_USERS = [
	{ name: 'user1' },
	{ name: 'user2' },
	{ name: 'user3' },
	{ name: 'user4' }
];

const server = http.createServer((req, res) => {
	const url = req.url;
	const method = req.method;
	if (url === '/') {
		res.setHeader('Content-Type', 'text/html');
		res.write(`
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Document</title>
			</head>
			<body>
				<form action="/create-user" method="POST">
					<input name="user" type="text" />
					<button>Submit</button>
					<a href="/users">View Users</a>
				</form>

			</body>
			</html>
		`);
		return res.end();
	}
	if (url === '/create-user' && method === 'POST') {
		const body = [];
		req.on('data', (chunk) => {
			body.push(chunk);
		});
		return req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const userName = parsedBody.split('=')[1];
			// add new user to the array
			DUMMY_USERS.push({ name: userName });
			res.statusCode = 302;
			res.setHeader('Location', '/');
			return res.end();
		});
	}
	if (url === '/users') {
		res.setHeader('Content-Type', 'text/html');
		res.write(`
			<html>
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Document</title>
			</head>
			<body>
				<ul>
				${DUMMY_USERS.map(user => {
			return `<li>UserName: ${user.name}</li>`;
		})}
				</ul>
			</body>
			</html>
		`);
		return res.end();
	}
});

server.listen(3000);
